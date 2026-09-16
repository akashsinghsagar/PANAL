from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import uuid

from app.agents.interviewer_agent import generate_questions
from app.agents.live_interviewer_agent import live_interviewer_agent
from app.agents.answer_evaluator import answer_evaluator
from app.agents.final_report_agent import final_report_agent


router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)


# =========================================================
# CONSTANTS
# =========================================================

MAX_QUESTIONS = 10

STAGES = [
    "Resume parsed",
    "Experience",
    "Certifications",
    "Projects",
    "Wrap-up"
]


# =========================================================
# REQUEST MODELS
# =========================================================

class InterviewRequest(BaseModel):
    resume_analysis: Dict[str, Any]


class AnswerRequest(BaseModel):
    session_id: str
    answer: str


class FinalReportRequest(BaseModel):
    session_id: str


# =========================================================
# IN-MEMORY SESSIONS
# =========================================================

interview_sessions = {}


# =========================================================
# GENERATE PREDEFINED QUESTIONS
# =========================================================

@router.post("/questions")
async def generate_interview_questions(
    request: InterviewRequest
):

    if not request.resume_analysis:
        raise HTTPException(
            status_code=400,
            detail="Resume analysis is empty"
        )

    try:

        questions = generate_questions(
            request.resume_analysis
        )

        # Keep exactly 10 questions
        questions = questions[:MAX_QUESTIONS]

        return {
            "questions": questions
        }

    except Exception as e:

        print("Question generation error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate questions: {str(e)}"
        )


# =========================================================
# START INTERVIEW
# =========================================================

@router.post("/start")
async def start_interview(
    request: InterviewRequest
):

    if not request.resume_analysis:
        raise HTTPException(
            status_code=400,
            detail="Resume analysis is empty"
        )

    session_id = str(uuid.uuid4())

    interview_sessions[session_id] = {
        "resume_analysis": request.resume_analysis,
        "conversation": [],
        "evaluations": [],
        "question_number": 1,
        "current_stage": 0,
        "completed": False
    }

    try:

        first_question = (
            live_interviewer_agent.generate_stage_question(
                resume_analysis=request.resume_analysis,
                conversation=[],
                stage=STAGES[0],
                question_number=1,
            )
        )

        interview_sessions[session_id]["conversation"].append({
            "role": "interviewer",
            "content": first_question
        })

        return {
            "session_id": session_id,
            "question_number": 1,
            "stage": STAGES[0],
            "stage_number": 1,
            "total_stages": 5,
            "question": first_question,
            "total_questions": MAX_QUESTIONS,
            "answered_questions": 0
        }

    except Exception as e:

        interview_sessions.pop(session_id, None)

        print("Interview start error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Failed to start interview: {str(e)}"
        )


# =========================================================
# ANSWER QUESTION
# =========================================================

@router.post("/answer")
async def answer_question(
    request: AnswerRequest
):

    session = interview_sessions.get(
        request.session_id
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    if session["completed"]:
        raise HTTPException(
            status_code=400,
            detail="Interview is already completed"
        )

    if not request.answer.strip():
        raise HTTPException(
            status_code=400,
            detail="Answer cannot be empty"
        )

    try:

        # =================================================
        # CURRENT QUESTION
        # =================================================

        if not session["conversation"]:
            raise HTTPException(
                status_code=400,
                detail="No active interview question"
            )

        current_question = (
            session["conversation"][-1]["content"]
        )

        current_question_number = session["question_number"]

        # =================================================
        # STORE ANSWER
        # =================================================

        session["conversation"].append({
            "role": "candidate",
            "content": request.answer.strip()
        })

        # =================================================
        # EVALUATE ANSWER
        # =================================================

        evaluation = answer_evaluator.evaluate(
            question=current_question,
            answer=request.answer.strip(),
            resume_analysis=session["resume_analysis"]
        )

        session["evaluations"].append({
            "question_number": current_question_number,
            "question": current_question,
            "answer": request.answer.strip(),
            "evaluation": evaluation
        })

        # =================================================
        # CHECK IF Q10
        # =================================================

        if current_question_number >= MAX_QUESTIONS:

            session["completed"] = True

            return {
                "session_id": request.session_id,
                "question_number": current_question_number,
                "answered_questions": current_question_number,
                "total_questions": MAX_QUESTIONS,
                "stage": STAGES[4],
                "stage_number": 5,
                "interview_completed": True,
                "evaluation": evaluation,
                "message": "Interview completed. You can now generate the final report."
            }

        # =================================================
        # NEXT QUESTION
        # =================================================

        next_question_number = current_question_number + 1

        # 2 questions per stage
        next_stage_index = (next_question_number - 1) // 2

        session["current_stage"] = next_stage_index

        next_question = (
            live_interviewer_agent.generate_stage_question(
                resume_analysis=session["resume_analysis"],
                conversation=session["conversation"],
                stage=STAGES[next_stage_index],
                question_number=next_question_number,
            )
        )

        session["question_number"] = next_question_number

        session["conversation"].append({
            "role": "interviewer",
            "content": next_question
        })

        return {
            "session_id": request.session_id,
            "question_number": next_question_number,
            "answered_questions": current_question_number,
            "total_questions": MAX_QUESTIONS,
            "stage": STAGES[next_stage_index],
            "stage_number": next_stage_index + 1,
            "total_stages": 5,
            "question": next_question,
            "evaluation": evaluation,
            "interview_completed": False
        }

    except HTTPException:
        raise

    except Exception as e:

        print("Answer processing error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Failed to process answer: {str(e)}"
        )


# =========================================================
# GENERATE FINAL REPORT
# =========================================================

@router.post("/final")
async def generate_final_report(
    request: FinalReportRequest
):

    session = interview_sessions.get(
        request.session_id
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    if not session["completed"]:
        raise HTTPException(
            status_code=400,
            detail="Interview is not completed yet"
        )

    evaluations = session.get(
        "evaluations",
        []
    )

    if len(evaluations) != MAX_QUESTIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Expected {MAX_QUESTIONS} evaluations, found {len(evaluations)}"
        )

    try:

        report = final_report_agent.generate_report(
            resume_analysis=session["resume_analysis"],
            evaluations=evaluations
        )

        # Store report inside session
        session["final_report"] = report

        return {
            "session_id": request.session_id,
            "report": report
        }

    except Exception as e:

        print("Final report generation error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate final report: {str(e)}"
        )


# =========================================================
# GET FINAL REPORT
# =========================================================
# THIS FIXES:
# {"detail": "Not Found"}
#
# React calls:
# GET /interview/final/{session_id}
# =========================================================

@router.get("/final/{session_id}")
async def get_final_report(
    session_id: str
):

    session = interview_sessions.get(
        session_id
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    if not session.get("completed"):
        raise HTTPException(
            status_code=400,
            detail="Interview has not been completed yet"
        )

    # If report was already generated
    if session.get("final_report"):
        return {
            "session_id": session_id,
            "report": session["final_report"]
        }

    # Generate report
    evaluations = session.get(
        "evaluations",
        []
    )

    if len(evaluations) != MAX_QUESTIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Expected {MAX_QUESTIONS} evaluations, found {len(evaluations)}"
        )

    try:

        report = final_report_agent.generate_report(
            resume_analysis=session["resume_analysis"],
            evaluations=evaluations
        )

        session["final_report"] = report

        return {
            "session_id": session_id,
            "report": report
        }

    except Exception as e:

        print("Final report error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate final report: {str(e)}"
        )


# =========================================================
# GET INTERVIEW STATUS
# =========================================================

@router.get("/status/{session_id}")
async def interview_status(
    session_id: str
):

    session = interview_sessions.get(
        session_id
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    answered = len(
        session.get("evaluations", [])
    )

    current_question = session.get(
        "question_number",
        1
    )

    stage_index = min(
        (max(current_question, 1) - 1) // 2,
        4
    )

    return {
        "session_id": session_id,
        "question_number": current_question,
        "answered_questions": answered,
        "total_questions": MAX_QUESTIONS,
        "stage": STAGES[stage_index],
        "stage_number": stage_index + 1,
        "total_stages": 5,
        "completed": session.get(
            "completed",
            False
        )
    }