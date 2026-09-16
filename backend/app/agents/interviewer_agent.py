import json
import re

from langchain_groq import ChatGroq

from app.config import GROQ_API_KEY, MODEL_NAME


class InterviewerAgent:

    def __init__(self):

        self.llm = ChatGroq(
            api_key=GROQ_API_KEY,
            model=MODEL_NAME,
            temperature=0.3,
            max_tokens=700,
        )

    def generate_questions(
        self,
        resume_analysis: dict
    ):

        prompt = f"""
You are an expert technical interviewer.

Create personalized interview questions using ONLY the
candidate's actual resume information.

CANDIDATE RESUME:

{json.dumps(resume_analysis, indent=2)}

Generate exactly 8 interview questions.

Requirements:

1. Questions must be based on the candidate's actual resume.
2. Include questions about projects.
3. Include questions about technical skills.
4. Include machine learning/data science questions when supported.
5. Include at least one practical/problem-solving question.
6. Do not invent experience.
7. Do not mention skills or projects that are not in the resume.
8. Questions should progress from easy to difficult.
9. Questions should be suitable for a technical interview.
10. Questions should be specific rather than generic.
11. Return ONLY valid JSON.

Return exactly:

{{
    "questions": [
        "Question 1",
        "Question 2",
        "Question 3",
        "Question 4",
        "Question 5",
        "Question 6",
        "Question 7",
        "Question 8"
    ]
}}
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

        try:

            result = json.loads(content)

            questions = result.get("questions")

            if not isinstance(questions, list):
                raise ValueError(
                    "Questions field is not a list"
                )

            return questions

        except Exception as e:

            print("Interview question parsing error:", e)
            print("Groq response:", content)

            return [
                "Can you tell me about your background in Computer Science and Data Science?",
                "How have you used Python in your projects?",
                "Can you explain your experience with SQL?",
                "Can you walk me through your AI-Drive Crop Planner project?",
                "What machine learning techniques have you worked with?",
                "Can you explain your Blinkit Power BI dashboard?",
                "What was a challenging problem you faced in one of your projects?",
                "How would you improve one of the projects listed on your resume?"
            ]


interviewer_agent = InterviewerAgent()


def generate_questions(
    resume_analysis: dict
):

    return interviewer_agent.generate_questions(
        resume_analysis
    )