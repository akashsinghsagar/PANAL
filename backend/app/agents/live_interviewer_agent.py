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

12. Do not mention the stage name to the candidate.

13. Return ONLY the question.

Do not provide an answer.
Do not provide explanation.
"""


        response = self.llm.invoke(prompt)

        return response.content.strip()


live_interviewer_agent = LiveInterviewerAgent()