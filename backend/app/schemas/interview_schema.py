from pydantic import BaseModel
from typing import List


class InterviewQuestions(BaseModel):

    questions: List[str]