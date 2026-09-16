import os
from dotenv import load_dotenv

load_dotenv()

APP_NAME = os.getenv("APP_NAME", "AI Interviewer")

DEBUG = os.getenv("DEBUG", "True").lower() == "true"

HOST = os.getenv("HOST", "127.0.0.1")

PORT = int(os.getenv("PORT", "8000"))

SECRET_KEY = os.getenv("SECRET_KEY")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

MODEL_NAME = os.getenv(
    "GROQ_MODEL_NAME",
    os.getenv("MODEL_NAME", "llama-3.1-8b-instant")
)

DATABASE_URL = os.getenv("DATABASE_URL")

REDIS_URL = os.getenv("REDIS_URL")