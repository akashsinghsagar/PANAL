import re

from langchain_groq import ChatGroq

from app.config import GROQ_API_KEY, MODEL_NAME


class LiveInterviewerAgent:

    def __init__(self):

        self.llm = ChatGroq(
            api_key=GROQ_API_KEY,
            model=MODEL_NAME,
            temperature=0.5,
            max_tokens=180,
        )


    def generate_stage_question(
        self,
        resume_analysis: dict,
        conversation: list,
        stage: str,
        question_number: int
    ):

        stage_instructions = {

            "Resume parsed": """
Focus on the candidate's background, education,
technical foundation, and resume overview.

Ask questions that verify information actually
present in the resume.
""",

            "Experience": """
Focus on the candidate's experience, technical
skills, practical exposure, internships, tools,
and professional development.

Ask questions based only on the resume.
""",

            "Skills": """
Focus on the candidate's technical skills listed
in the resume. Ask how the candidate used those
skills, their level of understanding, and which
tools or technologies were used in projects.
""",

            "Projects": """
Focus heavily on the candidate's actual projects.

Ask about:
- architecture
- implementation
- technologies
- algorithms
- preprocessing
- challenges
- debugging
- evaluation metrics
- results
- improvements

Use actual project names from the resume.
""",

            "Wrap-up": """
Ask final technical or problem-solving questions
that connect the candidate's projects, skills,
and overall technical knowledge.

The questions should be slightly more challenging
and should test practical thinking.
"""
        }


        instructions = stage_instructions.get(
            stage,
            stage_instructions["Resume parsed"]
        )

        project_names = self._subjects_from_resume(resume_analysis, "projects")
        skill_names = self._subjects_from_resume(resume_analysis, "skills")
        experience_names = self._subjects_from_resume(resume_analysis, "experience")
        project_name = self._select_subject(project_names, question_number, "project")
        skill_name = self._select_subject(skill_names, question_number, "skill")
        experience_name = self._select_subject(
            experience_names,
            question_number,
            "experience",
        )
        named_subject = {
            "Projects": project_name,
            "Skills": skill_name,
            "Experience": experience_name,
            "Wrap-up": project_name,
        }.get(stage, "the candidate's CV")


        prompt = f"""
You are conducting a professional technical
interview.

The interview has a strict 5-stage structure.

CURRENT STAGE:
{stage}

THIS IS QUESTION {question_number} OF THIS STAGE.

Each stage has EXACTLY 2 questions.

The stages are:

1. Resume parsed
2. Projects
3. Skills
4. Experience
5. Wrap-up

CURRENT STAGE INSTRUCTIONS:
{instructions}

SPECIFIC CV SUBJECT FOR THIS QUESTION:
{named_subject}

When the stage is Projects, begin the question with or clearly include:
"On your CV, you mentioned the {project_name} project. ..."
When the stage is Skills, clearly name this skill or technology:
"On your CV, you listed {skill_name}. ..."
When the stage is Experience, clearly name this experience:
"On your CV, you mentioned your {experience_name} experience. ..."
When the stage is Wrap-up, clearly name this project:
"On your CV, you mentioned the {project_name} project. ..."

CANDIDATE RESUME:
{resume_analysis}


PREVIOUS CONVERSATION:
{conversation}


IMPORTANT RULES:

1. Ask EXACTLY ONE question.

2. Stay inside the CURRENT STAGE.

3. Do NOT jump to another stage.

4. Use the candidate's actual resume.

5. Do NOT invent projects, skills, certifications,
   companies, experience, or technologies.

6. Do NOT ask multiple questions.

7. Do NOT repeat previous questions.

8. Make the second question of a stage a natural
   follow-up or deeper question.

9. The question should feel like a real human
   technical interviewer is speaking.

10. For project questions, use actual project names.

11. For technical questions, ask about implementation,
    decisions, challenges, trade-offs, or results.

12. Ask directly about the specific project, skill, or
    experience extracted from the CV. Do not ask the
    candidate to generally "tell me about your project".

13. For a project, explicitly introduce the subject with:
    "On your CV, you mentioned the [exact project name] project."
    Then ask one deep technical question about that project.

14. For experience, explicitly introduce the exact experience
    name. For skills, explicitly introduce the exact skill name.

15. Use the candidate's previous answer as a follow-up
    when it contains a concrete detail worth exploring.

16. Do not mention the stage name to the candidate.

17. Return ONLY the question.

Do not provide an answer.
Do not provide explanation.
"""


        response = self.llm.invoke(prompt)
        question = self._clean_question(response.content)
        question = self._ensure_cv_context(
            question,
            stage,
            project_name,
            skill_name,
            experience_name,
        )

        previous_questions = {
            item.get("content", "").strip().lower()
            for item in conversation
            if item.get("role") == "interviewer"
        }

        required_subject = named_subject.lower()
        generic_subject = required_subject in {
            "the candidate's cv",
            "the projects listed on your cv",
            "the skills listed on your cv",
            "the experience listed on your cv",
            "the work described on your cv",
        } or required_subject.startswith("a specific ")
        names_subject = (
            stage not in {"Projects", "Skills", "Experience", "Wrap-up"}
            or (not generic_subject and required_subject in question.lower())
        )

        if question and question.lower() not in previous_questions and names_subject:
            return question

        return self._fallback_question(resume_analysis, stage, question_number)

    @staticmethod
    def _fallback_question(
        resume_analysis: dict,
        stage: str,
        question_number: int,
    ) -> str:
        candidate_name = resume_analysis.get("candidate_name", "the candidate")
        project_names = LiveInterviewerAgent._subjects_from_resume(resume_analysis, "projects")
        skill_names = LiveInterviewerAgent._subjects_from_resume(resume_analysis, "skills")
        experience_names = LiveInterviewerAgent._subjects_from_resume(resume_analysis, "experience")
        project_name = LiveInterviewerAgent._select_subject(
            project_names,
            question_number,
            "project",
        )
        skill_name = LiveInterviewerAgent._select_subject(
            skill_names,
            question_number,
            "skill",
        )
        experience_name = LiveInterviewerAgent._select_subject(
            experience_names,
            question_number,
            "experience",
        )

        is_follow_up = question_number % 2 == 0

        fallback_questions = {
            "Resume parsed": (
                f"{candidate_name}, which part of your education or background most directly "
                "prepared you for the technical work shown on your CV?"
                if not is_follow_up else
                "Which technical decision from your background would you make differently "
                "today, and why?"
            ),
            "Projects": (
                f"On your CV, you mentioned the {project_name} project. Could you walk me "
                "through how you designed its data flow from input to final result?"
                if not is_follow_up else
                f"On your CV, you mentioned the {project_name} project. What was its hardest "
                "technical trade-off, and how did you validate your decision?"
            ),
            "Skills": (
                f"On your CV, you listed {skill_name}. In which project did you use it, and "
                "what did you personally implement with it?"
                if not is_follow_up else
                f"On your CV, you listed {skill_name}. What limitation did you encounter "
                "while using it, and how did you work around it?"
            ),
            "Experience": (
                f"On your CV, you mentioned your {experience_name} experience. What technical "
                "problem did you solve, and what was your specific contribution?"
                if not is_follow_up else
                f"On your CV, you mentioned your {experience_name} experience. What measurable "
                "result came from your contribution?"
            ),
            "Wrap-up": (
                f"On your CV, you mentioned the {project_name} project. What would you improve "
                "first, and why?"
                if not is_follow_up else
                f"On your CV, you mentioned the {project_name} project. What concrete change "
                "would you make first, and how would you measure its success?"
            ),
        }

        return fallback_questions.get(
            stage,
            f"Based on your CV, what is the most important technical detail we should "
            f"discuss for question {question_number}?",
        )

    @staticmethod
    def _first_evidence(value) -> str:
        if isinstance(value, list) and value:
            return str(value[0])
        if isinstance(value, dict) and value:
            return str(next(iter(value)))
        if isinstance(value, str) and value.strip():
            return value.strip()[:120]
        return "the work described on your CV"

    @staticmethod
    def _select_subject(subjects: list[str], question_number: int, kind: str) -> str:
        if subjects:
            return subjects[(question_number - 1) % len(subjects)]
        return f"the {kind} identified in your uploaded resume"

    @staticmethod
    def _clean_question(value: str) -> str:
        question = value.strip()
        question = re.sub(r"^#{1,6}\s*", "", question)
        question = question.strip().strip('"`')
        return question

    @staticmethod
    def _ensure_cv_context(
        question: str,
        stage: str,
        project_name: str,
        skill_name: str,
        experience_name: str,
    ) -> str:
        if not question or "on your cv" in question.lower():
            return question

        if stage in {"Projects", "Wrap-up"}:
            prefix = f"On your CV, you mentioned the {project_name} project. "
        elif stage == "Skills":
            prefix = f"On your CV, you listed {skill_name}. "
        elif stage == "Experience":
            prefix = f"On your CV, you mentioned your {experience_name} experience. "
        else:
            return question

        return prefix + question[0].upper() + question[1:]

    @classmethod
    def _subjects_from_resume(cls, resume_analysis: dict, field: str) -> list[str]:
        structured_value = resume_analysis.get(field)
        subjects = cls._subjects_from_value(structured_value, field)
        if subjects:
            return subjects

        source_texts = [
            resume_analysis.get("raw_analysis", ""),
            resume_analysis.get("_resume_text", ""),
        ]
        for raw_analysis in source_texts:
            if not isinstance(raw_analysis, str):
                continue
            aliases = {
                "projects": "projects?|project experience|selected projects",
                "skills": "skills?|technical skills|technologies",
                "experience": "experience|work experience|employment",
            }[field]
            section_stops = {
                "projects": "experience|work experience|education|skills|certifications|awards",
                "skills": "experience|work experience|education|projects?|certifications|awards",
                "experience": "education|skills|projects?|certifications|awards",
            }[field]
            patterns = (
                rf"\|\s*\**(?:{aliases})\**\s*\|\s*([^|\n]*?)(?:\||$)",
                rf"(?:^|\n)\s*(?:[-*]\s*)?\**(?:{aliases})\**\s*[:\-]\s*([^\n]+)",
                rf"(?:^|\n)\s*#+\s*(?:{aliases})\s*\n(.*?)(?:\n#|\Z)",
                rf"(?:^|\n)\s*(?:{aliases})\s*:?\s*\n(.*?)(?=\n\s*(?:{section_stops})\s*:?[ \t]*\n|\Z)",
            )
            for pattern in patterns:
                match = re.search(pattern, raw_analysis, re.IGNORECASE | re.DOTALL)
                if match:
                    subjects = cls._subjects_from_value(match.group(1), field)
                    if subjects:
                        return subjects

        return []

    @classmethod
    def _subjects_from_value(cls, value, field: str) -> list[str]:
        if isinstance(value, dict):
            value = list(value.keys())
        if isinstance(value, list):
            values = value
        elif isinstance(value, str) and value.strip():
            values = [value]
        else:
            return []

        subjects = []
        for item in values:
            cleaned = re.sub(r"<[^>]+>", " ", str(item))
            cleaned = re.sub(r"[*_`]+", "", cleaned)
            for part in re.split(r"\s*;\s*|\s*[•▪]\s*|\r?\n+", cleaned):
                part = re.sub(r"\s+", " ", part).strip(" -*•▪")
                if field in {"skills", "projects"}:
                    parts = re.split(r"\s*,\s*", part)
                else:
                    parts = [part]
                subjects.extend(
                    part for part in parts
                    if part
                    and part.lower() not in {field, "summary", "-"}
                    and not (
                        field in {"projects", "experience"}
                        and re.match(
                            r"^(built|developed|created|implemented|used|designed|worked|responsible)\b",
                            part,
                            re.IGNORECASE,
                        )
                    )
                )

        return list(dict.fromkeys(subjects))

live_interviewer_agent = LiveInterviewerAgent()