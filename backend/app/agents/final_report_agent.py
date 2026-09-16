import json
import re

from langchain_groq import ChatGroq
from app.config import GROQ_API_KEY, MODEL_NAME


class FinalReportAgent:

    def __init__(self):

        self.llm = ChatGroq(
            api_key=GROQ_API_KEY,
            model=MODEL_NAME,
            temperature=0,
            max_tokens=4096,
        )

    def generate_report(
        self,
        resume_analysis: dict,
        evaluations: list
    ):

        prompt = f"""
You are a senior technical interview assessor.

Create a structured final interview report.

CANDIDATE RESUME:
{json.dumps(resume_analysis, indent=2)}

INTERVIEW EVALUATIONS:
{json.dumps(evaluations, indent=2)}

There are exactly 10 interview questions.

Analyze ONLY the information provided.

Calculate the average score for:

- relevance
- technical_knowledge
- clarity
- completeness
- confidence
- overall_score

Also calculate:

- problem_solving
- technical_depth
- professionalism

Use the available evidence from the interview.

Return EXACTLY this JSON structure:

{{
    "candidate_name": "",
    "target_role": "",
    "experience": "",
    "total_questions": 10,
    "questions_answered": 10,
    "overall_score": 0,
    "performance_level": "",

    "executive_summary": "",

    "skill_scores": {{
        "technical_knowledge": 0,
        "problem_solving": 0,
        "communication": 0,
        "answer_relevance": 0,
        "confidence": 0,
        "technical_depth": 0,
        "professionalism": 0,
        "overall": 0
    }},

    "question_analysis": [
        {{
            "question_number": 1,
            "question": "",
            "candidate_answer": "",
            "score": 0,
            "correctness": "",
            "relevance": "",
            "technical_depth": "",
            "what_you_did_well": [],
            "what_to_improve": [],
            "better_answer_approach": ""
        }}
    ],

    "communication_analysis": {{
        "type": "Written Communication Analysis",
        "fluency": "",
        "clarity": "",
        "grammar": "",
        "vocabulary": "",
        "filler_words": "",
        "sentence_structure": ""
    }},

    "mistakes_corrections": [
        {{
            "candidate_used": "",
            "correct_version": "",
            "type": ""
        }}
    ],

    "strengths": [],

    "weaknesses": [],

    "resume_vs_interview": [
        {{
            "skill_or_claim": "",
            "resume_claim": "",
            "interview_demonstration": "",
            "status": "Strongly demonstrated"
        }}
    ],

    "final_verdict": {{
        "overall_score": 0,
        "performance_level": "",
        "summary": ""
    }},

    "recommendation": "",

    "improvement_plan": {{
        "next_7_days": [],
        "next_30_days": []
    }}
}}

Rules:

1. Return ONLY valid JSON.
2. Do not use markdown.
3. Do not use ```json.
4. Do not invent experience.
5. Use ONLY information contained in the resume and evaluations.
6. There must be exactly 10 objects inside question_analysis.
7. strengths must contain the top 5 strengths.
8. weaknesses must contain the top 5 weaknesses.
9. recommendation must be exactly one of:
   "Strongly Recommended"
   "Recommended"
   "Consider"
   "Not Recommended"
10. resume_vs_interview status must be exactly one of:
   "Strongly demonstrated"
   "Partially demonstrated"
   "Not demonstrated"
11. Keep written communication analysis separate from voice analysis.
12. Do not claim pronunciation or speaking speed because answers are typed.
"""

        response = self.llm.invoke(prompt)

        content = response.content.strip()

        # Remove markdown fences
        content = re.sub(
            r"^```(?:json)?\s*",
            "",
            content,
            flags=re.IGNORECASE
        )

        content = re.sub(
            r"\s*```$",
            "",
            content
        )

        content = content.strip()

        # Parse JSON
        try:

            report = json.loads(content)

        except json.JSONDecodeError:

            match = re.search(
                r"\{.*\}",
                content,
                re.DOTALL
            )

            if not match:
                raise ValueError(
                    "Groq returned invalid JSON for final report."
                )

            try:
                report = json.loads(
                    match.group(0)
                )

            except json.JSONDecodeError as e:

                print("Final report JSON error:")
                print(content)

                raise ValueError(
                    f"Could not parse final report JSON: {e}"
                )

        # =================================================
        # SAFETY / STRUCTURE NORMALIZATION
        # =================================================

        report.setdefault(
            "candidate_name",
            resume_analysis.get(
                "candidate_name",
                ""
            )
        )

        report.setdefault(
            "total_questions",
            10
        )

        report.setdefault(
            "questions_answered",
            10
        )

        report.setdefault(
            "strengths",
            []
        )

        report.setdefault(
            "weaknesses",
            []
        )

        report.setdefault(
            "question_analysis",
            []
        )

        report.setdefault(
            "mistakes_corrections",
            []
        )

        report.setdefault(
            "resume_vs_interview",
            []
        )

        report.setdefault(
            "improvement_plan",
            {
                "next_7_days": [],
                "next_30_days": []
            }
        )

        return report


final_report_agent = FinalReportAgent()