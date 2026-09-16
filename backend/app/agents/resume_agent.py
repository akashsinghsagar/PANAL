import json
import re

from langchain_groq import ChatGroq

from app.config import GROQ_API_KEY, MODEL_NAME


class ResumeAgent:
    def __init__(self):
        self.llm = ChatGroq(
            api_key=GROQ_API_KEY,
            model=MODEL_NAME,
            temperature=0,
            max_tokens=800,
        )

    def analyze(self, resume_text: str):
        prompt = f"""
Analyze the following resume and return a concise structured analysis.

Resume:
{resume_text}

Return:
- candidate_name
- skills
- experience
- education
- projects
- strengths
- weaknesses
- suitable_interview_topics
"""

        try:
            response = self.llm.invoke(prompt)
            analysis = self._parse_analysis(response.content)
            analysis["_resume_text"] = resume_text
            return analysis
        except Exception as error:
            raise RuntimeError(f"Groq resume analysis failed: {error}") from error

    @staticmethod
    def _parse_analysis(content: str) -> dict:
        cleaned = content.strip()
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned).strip()

        try:
            parsed = json.loads(cleaned)
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            pass

        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            try:
                parsed = json.loads(match.group(0))
                if isinstance(parsed, dict):
                    return parsed
            except json.JSONDecodeError:
                pass

        return {"raw_analysis": content}


resume_agent = ResumeAgent()


def analyze_resume(resume_text: str):
    return resume_agent.analyze(resume_text)