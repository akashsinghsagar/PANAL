from pydantic import BaseModel
from typing import List


class ResumeAnalysis(BaseModel):
    candidate_name: str
    education: str
    skills: List[str]
    projects: List[str]
    certifications: List[str]
    strengths: List[str]