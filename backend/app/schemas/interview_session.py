from pydantic import BaseModel
from typing import List, Optional


class InterviewMessage(BaseModel):
    role: str
    content: str


class InterviewSession(BaseModel):
    session_id: str
    resume_analysis: dict
    messages: List[InterviewMessage] = []
    current_question: Optional[str] = None
    question_number: int = 0