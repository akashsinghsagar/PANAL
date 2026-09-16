import uuid


sessions = {}


def create_session(resume_analysis: dict):

    session_id = str(uuid.uuid4())

    sessions[session_id] = {
        "resume_analysis": resume_analysis,
        "messages": [],
        "question_number": 0,
        "current_question": None
    }

    return session_id


def get_session(session_id: str):

    return sessions.get(session_id)


def save_session(session_id: str, session):

    sessions[session_id] = session