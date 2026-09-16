import json
import re
from typing import List

from pydantic import BaseModel, Field
from langchain_groq import ChatGroq

from app.config import GROQ_API_KEY, MODEL_NAME


class AnswerEvaluation(BaseModel):
    relevance: float = Field(ge=0, le=10)
    technical_knowledge: float = Field(ge=0, le=10)
    clarity: float = Field(ge=0, le=10)
    completeness: float = Field(ge=0, le=10)
    confidence: float = Field(ge=0, le=10)

    correctness: str
    technical_depth: str

    strengths: List[str]
    weaknesses: List[str]

    what_you_did_well: List[str]
    what_you_could_improve: List[str]

    better_answer_approach: str
    mistakes: List[dict]
    feedback: str


class AnswerEvaluator:

    def __init__(self):
        self.providers = self._create_providers()

        if not self.providers:
            raise RuntimeError("No Groq AI provider configured. Add GROQ_API_KEY.")

    def _create_providers(self):
        providers = []

        try:
            llm = ChatGroq(
                api_key=GROQ_API_KEY,
                model=MODEL_NAME,
                temperature=0,
                max_tokens=1400,
            )
            providers.append(("groq", llm.with_structured_output(AnswerEvaluation)))
        except Exception as error:
            print(f"groq initialization failed: {error}")

        return providers

    @staticmethod
    def _is_unknown_answer(answer: str) -> bool:
        normalized = answer.strip().lower()
        normalized = re.sub(r"[.!?,]+$", "", normalized)

        unknown_answers = {
            "dont know",
            "don't know",
            "i dont know",
            "i don't know",
            "idk",
            "nan",
            "n/a",
            "na",
            "no idea",
            "not sure",
            "i am not sure",
            "i'm not sure",
            "unknown",
        }

        return normalized in unknown_answers

    @staticmethod
    def _unknown_answer_result():
        return AnswerEvaluation(
            relevance=0,
            technical_knowledge=0,
            clarity=0,
            completeness=0,
            confidence=0,
            correctness="Weak",
            technical_depth="Low",
            strengths=[],
            weaknesses=["The candidate did not provide an answer."],
            what_you_did_well=[],
            what_you_could_improve=[
                "Try to explain what you know, even if you are not completely certain.",
                "Explain a related concept instead of only saying that you do not know.",
            ],
            better_answer_approach=(
                "Acknowledge the knowledge gap and explain any related concept "
                "you understand."
            ),
            mistakes=[],
            feedback="The candidate did not know or did not attempt to answer.",
        ).model_dump()

    def _build_prompt(
        self,
        question: str,
        answer: str,
        resume_analysis: dict,
    ) -> str:
        return f"""
You are an expert technical interviewer and evaluator.

CANDIDATE RESUME:
{json.dumps(resume_analysis, indent=2)}

INTERVIEW QUESTION:
{question}

CANDIDATE ANSWER:
{answer}

Evaluate ONLY what the candidate actually said.

Do not invent experience, technologies, algorithms, projects,
metrics, or achievements.

Evaluate using scores from 0 to 10:

1. Relevance
2. Technical knowledge
3. Clarity
4. Completeness
5. Confidence

Correctness must be one of:
"Strong", "Moderate", "Weak"

Technical depth must be one of:
"High", "Moderate", "Low"

Identify:
- What the candidate did well
- What could be improved
- Technical weaknesses
- Missing details
- A better answer approach
- Grammar or language mistakes
- Technical terminology mistakes

For mistakes use:
[
    {{
        "candidate_used": "...",
        "correct_version": "...",
        "type": "Grammar"
    }}
]

Allowed mistake types:
Grammar
Vocabulary
Technical terminology
Sentence structure

If there are no mistakes, return an empty list.

Keep the evaluation professional, concise, and realistic.
"""

    def evaluate(
        self,
        question: str,
        answer: str,
        resume_analysis: dict,
    ):
        if not answer or self._is_unknown_answer(answer):
            return self._unknown_answer_result()

        prompt = self._build_prompt(
            question=question,
            answer=answer,
            resume_analysis=resume_analysis,
        )

        errors = []

        for provider_name, structured_llm in self.providers:
            try:
                result = structured_llm.invoke(prompt)

                if isinstance(result, AnswerEvaluation):
                    return result.model_dump()

                if isinstance(result, dict):
                    return AnswerEvaluation(**result).model_dump()

                return result.model_dump()

            except Exception as error:
                errors.append(f"{provider_name}: {error}")
                print(f"{provider_name} evaluation failed.")

        raise RuntimeError(
            "All AI providers failed. " + " | ".join(errors)
        )


answer_evaluator = AnswerEvaluator()