# 🤖 PANAL (AI Interviewer)

> **An AI-powered, resume-aware technical interview platform that analyzes a candidate's resume, generates personalized interview questions, evaluates answers, and produces a detailed final interview performance report.**

<p align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![LangChain](https://img.shields.io/badge/LangChain-LLM%20Orchestration-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)
![Mistral AI](https://img.shields.io/badge/Mistral%20AI-LLM-FF7000?style=for-the-badge)
![REST API](https://img.shields.io/badge/API-REST-02569B?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Solution](#-solution)
* [Key Features](#-key-features)
* [Project Highlights](#-project-highlights)
* [System Architecture](#-system-architecture)
* [AI Agent Architecture](#-ai-agent-architecture)
* [Interview Workflow](#-interview-workflow)
* [Five-Stage Interview System](#-five-stage-interview-system)
* [Question Generation Flow](#-question-generation-flow)
* [Answer Evaluation Flow](#-answer-evaluation-flow)
* [Final Report Architecture](#-final-report-architecture)
* [Data Flow](#-data-flow)
* [Project Structure](#-project-structure)
* [Technology Stack](#-technology-stack)
* [Backend Architecture](#-backend-architecture)
* [Frontend Architecture](#-frontend-architecture)
* [API Documentation](#-api-documentation)
* [Installation](#-installation)
* [Environment Configuration](#-environment-configuration)
* [Running the Project](#-running-the-project)
* [Interview Process](#-interview-process)
* [Evaluation System](#-evaluation-system)
* [Final Report](#-final-report)
* [Security](#-security)
* [Error Handling](#-error-handling)
* [Testing](#-testing)
* [Future Improvements](#-future-improvements)
* [Project Statistics](#-project-statistics)
* [License](#-license)

---

# 🚀 Overview

**AI Interviewer** is a full-stack AI-powered interview platform designed to simulate a structured technical interview using information extracted from a candidate's resume.

Instead of asking generic interview questions, the system analyzes the candidate's:

* Education
* Technical skills
* Projects
* Certifications
* Experience
* Resume strengths

and uses this information to create a **personalized 10-question interview**.

The interview is divided into **5 stages**, with **2 questions per stage**.

```text
5 Stages × 2 Questions = 10 Questions
```

During the interview, candidate answers are evaluated using multiple criteria, and after the final question the system generates a comprehensive performance report.

---

# 🎯 Problem Statement

Traditional interview preparation platforms often rely on predefined question banks.

This creates several problems:

* Questions may not match the candidate's resume.
* Candidates may practice technologies they don't actually use.
* Evaluation is often limited to correctness.
* Communication quality is difficult to measure.
* There is no complete comparison between resume claims and interview performance.
* Candidates don't receive a personalized improvement plan.

The goal of this project is to build an AI system that behaves more like a structured technical interviewer.

---

# 💡 Solution

The platform follows this pipeline:

```text
Resume Upload
      ↓
PDF Text Extraction
      ↓
Resume Analysis
      ↓
Candidate Profile
      ↓
Personalized Interview
      ↓
Answer Evaluation
      ↓
Performance Analysis
      ↓
Final Interview Report
```

The system uses specialized AI agents for different responsibilities rather than using one large prompt for the entire interview.

---

# ✨ Key Features

## 📄 Resume Analysis

Upload a PDF resume and automatically extract:

* Candidate name
* Education
* Skills
* Projects
* Certifications
* Strengths

---

## 🧠 Resume-Aware Question Generation

Questions are generated from the candidate's actual resume.

Example:

```text
Resume:
Python
FastAPI
React
Machine Learning
Student Grade Prediction Project

                ↓

AI Interviewer

"How did you evaluate the Random Forest model
in your Student Grade Prediction project?"
```

The interviewer is instructed to avoid inventing experience.

---

## 🎤 Live Interview Flow

The platform conducts the interview sequentially.

```text
Question
   ↓
Candidate Answer
   ↓
Answer Evaluation
   ↓
Follow-up / Next Question
   ↓
Next Stage
```

---

## 📊 Multi-Dimensional Answer Evaluation

Each answer can be evaluated on:

| Metric              | Description                                    |
| ------------------- | ----------------------------------------------- |
| Relevance           | How directly the answer addresses the question |
| Technical Knowledge | Understanding of the technical concept         |
| Clarity             | How clearly the answer is communicated         |
| Completeness        | Whether important parts are covered            |
| Confidence          | Confidence demonstrated through the answer     |
| Technical Depth     | Level of implementation/detail                 |
| Overall Score       | Combined performance                           |

---

## 📑 Automated Final Report

After completing all 10 questions, the system generates a detailed report containing:

* Candidate overview
* Interview overview
* Executive summary
* Overall scores
* Question-by-question analysis
* Communication analysis
* Mistakes and corrections
* Strengths
* Weaknesses
* Resume vs interview analysis
* Final verdict
* Hiring recommendation
* Personalized improvement plan

---

# 📈 Project Highlights

```text
┌─────────────────────────────────────────────┐
│              AI INTERVIEWER                 │
├─────────────────────────────────────────────┤
│                                             │
│  5 Specialized AI Agents                    │
│  5 Interview Stages                         │
│  10 Personalized Questions                  │
│  5 REST API Core Endpoints                  │
│  Resume-Aware Question Generation           │
│  AI Answer Evaluation                       │
│  Automated Final Report                     │
│                                             │
└─────────────────────────────────────────────┘
```

### Core Statistics

| Component           | Implementation |
| -------------------- | ---------------: |
| AI Agents           |          **5** |
| Interview Stages    |          **5** |
| Questions per Stage |          **2** |
| Total Questions     |         **10** |
| Core REST APIs      |          **5** |
| Resume Input        |            PDF |
| Backend             |        FastAPI |
| Frontend            |       React.js |
| LLM Orchestration   |      LangChain |
| Primary LLM         |     Mistral AI |

---

# 🏗️ System Architecture

```mermaid
flowchart TB

    USER["👤 Candidate"]

    FRONTEND["⚛️ React Frontend"]

    API["🚀 FastAPI Backend"]

    RESUME["📄 Resume Upload"]

    PDF["📑 PDF Text Extraction"]

    RESUME_AGENT["🧠 Resume Analysis Agent"]

    INTERVIEWER["🎯 Interviewer Agent"]

    LIVE["🎤 Live Interviewer Agent"]

    EVALUATOR["📊 Answer Evaluator"]

    REPORT["📋 Final Report Agent"]

    LLM["🤖 Mistral AI / LLM"]

    SESSION["💾 Interview Session"]

    FINAL["📑 Final Performance Report"]


    USER --> FRONTEND

    FRONTEND --> API

    API --> RESUME

    RESUME --> PDF

    PDF --> RESUME_AGENT

    RESUME_AGENT --> LLM

    RESUME_AGENT --> SESSION

    SESSION --> INTERVIEWER

    INTERVIEWER --> LLM

    INTERVIEWER --> LIVE

    LIVE --> LLM

    LIVE --> USER

    USER --> FRONTEND

    FRONTEND --> API

    API --> EVALUATOR

    EVALUATOR --> LLM

    EVALUATOR --> SESSION

    SESSION --> REPORT

    REPORT --> LLM

    REPORT --> FINAL

    FINAL --> FRONTEND

    FRONTEND --> USER
```

---

# 🤖 AI Agent Architecture

The project uses **five specialized agents**.

```mermaid
flowchart LR

    RESUME["📄 Resume"]

    A1["1️⃣ Resume Analysis Agent"]

    A2["2️⃣ Interviewer Agent"]

    A3["3️⃣ Live Interviewer Agent"]

    A4["4️⃣ Answer Evaluator"]

    A5["5️⃣ Final Report Agent"]

    PROFILE["👤 Candidate Profile"]

    QUESTIONS["❓ Interview Questions"]

    ANSWERS["💬 Candidate Answers"]

    EVALUATIONS["📊 Answer Evaluations"]

    REPORT["📋 Final Report"]


    RESUME --> A1
    A1 --> PROFILE

    PROFILE --> A2
    A2 --> QUESTIONS

    QUESTIONS --> A3
    A3 --> QUESTIONS

    QUESTIONS --> ANSWERS

    ANSWERS --> A4
    A4 --> EVALUATIONS

    PROFILE --> A5
    EVALUATIONS --> A5

    A5 --> REPORT
```

---

# 🧠 Agent Responsibilities

## 1. Resume Analysis Agent

### Input

```text
Resume PDF
```

### Processing

```text
PDF
 ↓
Extract Text
 ↓
LLM Analysis
 ↓
Structured Candidate Profile
```

### Output

```json
{
  "candidate_name": "Candidate Name",
  "education": "B.Tech Computer Science",
  "skills": [
    "Python",
    "SQL",
    "Machine Learning"
  ],
  "projects": [
    "AI Interviewer",
    "Student Grade Prediction"
  ],
  "certifications": [
    "Azure Data Fundamentals"
  ],
  "strengths": [
    "Machine Learning",
    "Python Development"
  ]
}
```

---

# 2. Interviewer Agent

Responsible for generating personalized interview questions.

The agent considers:

* Resume skills
* Projects
* Education
* Certifications
* Previous questions
* Interview stage
* Difficulty progression

---

# 3. Live Interviewer Agent

Responsible for maintaining the conversational interview experience.

```text
Candidate Answer
       ↓
Analyze Context
       ↓
Check Previous Questions
       ↓
Generate Next Question
       ↓
Continue Interview
```

The interviewer is instructed to:

* Ask one question at a time
* Avoid duplicate questions
* Use resume information
* Ask relevant follow-ups
* Gradually increase difficulty
* Avoid inventing experience

---

# 4. Answer Evaluator

Each candidate answer is evaluated independently.

```mermaid
flowchart TD

    Q["❓ Interview Question"]

    A["💬 Candidate Answer"]

    CONTEXT["📄 Resume Context"]

    EVAL["🧠 Answer Evaluator"]

    R["Relevance"]

    T["Technical Knowledge"]

    C["Clarity"]

    CO["Completeness"]

    CF["Confidence"]

    D["Technical Depth"]

    O["Overall Score"]

    FEEDBACK["📝 Feedback"]


    Q --> EVAL
    A --> EVAL
    CONTEXT --> EVAL

    EVAL --> R
    EVAL --> T
    EVAL --> C
    EVAL --> CO
    EVAL --> CF
    EVAL --> D

    R --> O
    T --> O
    C --> O
    CO --> O
    CF --> O
    D --> O

    O --> FEEDBACK
```

---

# 5. Final Report Agent

The Final Report Agent combines:

```text
Resume Analysis
      +
10 Answer Evaluations
      ↓
Final Performance Report
```

The report provides a structured overview of the candidate's interview performance.

---

# 🎯 Interview Workflow

The complete interview follows:

```mermaid
flowchart TD

    START["🚀 Start Interview"]

    UPLOAD["📄 Upload Resume"]

    EXTRACT["📑 Extract Resume Text"]

    ANALYZE["🧠 Analyze Resume"]

    PROFILE["👤 Candidate Profile"]

    STAGE1["1️⃣ Resume Parsed"]

    STAGE2["2️⃣ Experience"]

    STAGE3["3️⃣ Certifications"]

    STAGE4["4️⃣ Projects"]

    STAGE5["5️⃣ Wrap-up"]

    COMPLETE["✅ Interview Completed"]

    REPORT["📊 Generate Final Report"]

    END["📋 View Report"]


    START --> UPLOAD
    UPLOAD --> EXTRACT
    EXTRACT --> ANALYZE
    ANALYZE --> PROFILE

    PROFILE --> STAGE1
    STAGE1 --> STAGE2
    STAGE2 --> STAGE3
    STAGE3 --> STAGE4
    STAGE4 --> STAGE5

    STAGE5 --> COMPLETE
    COMPLETE --> REPORT
    REPORT --> END
```

---

# 🧩 Five-Stage Interview System

The interview contains exactly **10 questions**.

## Stage 1 — Resume Parsed

```text
Q1
Q2
```

Focus:

* Resume understanding
* Candidate background
* Basic technical context

---

## Stage 2 — Experience

```text
Q3
Q4
```

Focus:

* Experience
* Responsibilities
* Technologies
* Problem solving

---

## Stage 3 — Certifications

```text
Q5
Q6
```

Focus:

* Certification-related knowledge
* Concepts covered by certifications
* Practical application

---

## Stage 4 — Projects

```text
Q7
Q8
```

Focus:

* Project architecture
* Implementation
* Algorithms
* Technologies
* Challenges
* Evaluation metrics

---

## Stage 5 — Wrap-up

```text
Q9
Q10
```

Focus:

* Advanced technical discussion
* Problem solving
* Career/project understanding
* Final technical assessment

---

# 📊 Interview Progress

```text
LIVE SESSION

INTERVIEW STAGES

● 1 Resume Parsed
    COMPLETED

● 2 Experience
    COMPLETED

● 3 Certifications
    IN PROGRESS

○ 4 Projects

○ 5 Wrap-up

────────────────────

PROGRESS

6 / 10 Questions
60%
```

---

# ❓ Question Generation Flow

```mermaid
sequenceDiagram

    participant C as Candidate
    participant UI as React
    participant API as FastAPI
    participant IA as Interviewer Agent
    participant LLM as Mistral AI

    C->>UI: Start Interview
    UI->>API: Start Session
    API->>IA: Resume + Stage
    IA->>LLM: Generate Question
    LLM-->>IA: Question
    IA-->>API: Question
    API-->>UI: Question
    UI-->>C: Display Question

    C->>UI: Submit Answer
    UI->>API: Send Answer
```

---

# 📊 Answer Evaluation Flow

```mermaid
sequenceDiagram

    participant C as Candidate
    participant UI as React
    participant API as FastAPI
    participant E as Answer Evaluator
    participant LLM as Mistral AI

    C->>UI: Submit Answer

    UI->>API: POST /interview/answer

    API->>E: Question + Answer + Resume

    E->>LLM: Evaluate Answer

    LLM-->>E: Structured Evaluation

    E-->>API: Scores + Feedback

    API->>API: Store Evaluation

    API-->>UI: Evaluation + Next Question

    UI-->>C: Display Next Question
```

---

# 📋 Final Report Architecture

```mermaid
flowchart TD

    PROFILE["👤 Candidate Profile"]

    E1["Evaluation Q1"]
    E2["Evaluation Q2"]
    E3["Evaluation Q3"]
    E4["Evaluation Q4"]
    E5["Evaluation Q5"]
    E6["Evaluation Q6"]
    E7["Evaluation Q7"]
    E8["Evaluation Q8"]
    E9["Evaluation Q9"]
    E10["Evaluation Q10"]

    AGENT["📊 Final Report Agent"]

    OVERVIEW["Candidate Overview"]

    SUMMARY["Executive Summary"]

    SCORES["Overall Skill Scores"]

    QUESTIONS["Question-by-Question Analysis"]

    COMM["Communication Analysis"]

    MISTAKES["Mistakes & Corrections"]

    STRENGTHS["Top Strengths"]

    WEAKNESSES["Top Weaknesses"]

    RESUME["Resume vs Interview"]

    VERDICT["Final Verdict"]

    PLAN["Improvement Plan"]


    PROFILE --> AGENT

    E1 --> AGENT
    E2 --> AGENT
    E3 --> AGENT
    E4 --> AGENT
    E5 --> AGENT
    E6 --> AGENT
    E7 --> AGENT
    E8 --> AGENT
    E9 --> AGENT
    E10 --> AGENT

    AGENT --> OVERVIEW
    AGENT --> SUMMARY
    AGENT --> SCORES
    AGENT --> QUESTIONS
    AGENT --> COMM
    AGENT --> MISTAKES
    AGENT --> STRENGTHS
    AGENT --> WEAKNESSES
    AGENT --> RESUME
    AGENT --> VERDICT
    AGENT --> PLAN
```

---

# 📑 Final Report Structure

The final report is designed around the following sections.

## 1. Candidate & Interview Overview

```text
Candidate Name
Target Role
Experience
Interview Date
Total Questions: 10
Questions Answered: 10/10
Interview Duration
Overall Score
```

---

## 2. Executive Summary

A concise AI-generated summary describing:

* Overall performance
* Technical ability
* Communication
* Strong areas
* Areas requiring improvement

---

## 3. Overall Skill Scores

```text
Technical Knowledge
Problem Solving
Communication
Answer Relevance
Confidence
Technical Depth
Professionalism
Overall
```

Example:

```text
Technical Knowledge     ████████░░  8.2/10
Problem Solving         ███████░░░  7.4/10
Communication           ████████░░  8.0/10
Technical Depth         ███████░░░  7.5/10
Confidence              ████████░░  8.1/10
```

---

# 🔍 Question-by-Question Analysis

Each of the 10 questions contains:

```text
Question
Candidate Answer
Score
Correctness
Relevance
Technical Depth
What Went Well
What Could Be Improved
Better Answer Approach
```

Example:

```text
Question 7
────────────────────────────

Question:
How did you evaluate your machine learning model?

Candidate Answer:
...

Score:
8.2 / 10

Correctness:
Correct

Relevance:
High

Technical Depth:
Good

What Went Well:
Mentioned model evaluation metrics.

Improve:
Include dataset split and validation strategy.

Better Approach:
Explain the evaluation process step-by-step
and provide the actual metric values.
```

---

# 🗣️ Communication Analysis

For text-based interviews:

```text
Written Communication Analysis
```

Possible metrics:

* Fluency
* Clarity
* Grammar
* Vocabulary
* Sentence Structure
* Repeated Words
* Filler Words
* Professionalism

For a future voice-enabled version:

```text
Speaking Speed
Pauses
Filler Words
Pronunciation
Voice Confidence
```

---

# ❌ Mistakes & Corrections

The report can identify mistakes in:

| Category              |
| ---------------------- |
| Grammar               |
| Vocabulary            |
| Technical Terminology |
| Sentence Structure    |
| Pronunciation         |

Example:

```text
Candidate Used:
"I have did preprocessing."

Correct Version:
"I performed data preprocessing."

Type:
Grammar
```

---

# 💪 Top 5 Strengths

The final report identifies the candidate's strongest areas.

Example:

```text
1. Strong Python fundamentals
2. Good understanding of ML concepts
3. Practical project experience
4. Clear technical explanations
5. Good problem-solving approach
```

---

# ⚠️ Top 5 Weaknesses

Example:

```text
1. Limited discussion of evaluation metrics
2. Some answers lacked implementation details
3. Could improve technical depth
4. Some explanations were too brief
5. Need stronger system-design explanations
```

---

# 📄 Resume vs Interview Analysis

The platform can compare what the resume claims with what the candidate demonstrates during the interview.

```mermaid
flowchart LR

    RESUME["📄 Resume Claims"]

    INTERVIEW["🎤 Interview Demonstration"]

    COMPARE["🔎 Comparison Engine"]

    STRONG["Strongly Demonstrated"]

    PARTIAL["Partially Demonstrated"]

    NOT["Not Demonstrated"]


    RESUME --> COMPARE
    INTERVIEW --> COMPARE

    COMPARE --> STRONG
    COMPARE --> PARTIAL
    COMPARE --> NOT
```

Example:

| Resume Claim     | Interview Evidence               | Status                 |
| ----------------- | --------------------------------- | ----------------------- |
| Python           | Strong implementation discussion | Strongly Demonstrated  |
| Machine Learning | Explained algorithms and metrics | Strongly Demonstrated  |
| FastAPI          | Basic understanding              | Partially Demonstrated |
| Kubernetes       | No relevant discussion           | Not Demonstrated       |

---

# 🏁 Final Verdict

The final section includes:

```text
Overall Score
Performance Level
Final Assessment
Hiring Recommendation
```

Possible recommendation values:

```text
Strongly Recommended
Recommended
Consider
Not Recommended
```

It also generates:

### 7-Day Improvement Plan

```text
Day 1 → Review Python fundamentals
Day 2 → Practice ML concepts
Day 3 → Explain projects
Day 4 → Practice SQL
Day 5 → Practice system design
Day 6 → Mock interview
Day 7 → Final assessment
```

### 30-Day Improvement Plan

A longer personalized learning and interview preparation roadmap.

---

# 🗂️ Project Structure

```text
AI-INTERVIEW/
│
└── ai-interviewer/
    │
    ├── backend/
    │   │
    │   ├── .env
    │   ├── requirements.txt
    │   ├── uploads/
    │   │
    │   └── app/
    │       │
    │       ├── main.py
    │       ├── config.py
    │       │
    │       ├── api/
    │       │   ├── resume.py
    │       │   └── interview.py
    │       │
    │       ├── agents/
    │       │   ├── resume_agent.py
    │       │   ├── interviewer_agent.py
    │       │   ├── live_interviewer_agent.py
    │       │   ├── answer_evaluator.py
    │       │   └── final_report_agent.py
    │       │
    │       ├── prompts/
    │       │
    │       ├── schemas/
    │       │   ├── resume_schema.py
    │       │   ├── evaluation_schema.py
    │       │   └── final_report_schema.py
    │       │
    │       └── services/
    │           └── pdf_reader.py
    │
    └── frontend/
        │
        ├── package.json
        ├── vite.config.js
        │
        ├── public/
        │
        └── src/
            │
            ├── components/
            ├── pages/
            │   ├── Home.jsx
            │   ├── Interview.jsx
            │   └── Report.jsx
            │
            ├── services/
            │   └── api.js
            │
            ├── App.jsx
            ├── main.jsx
            └── index.css
```

---

# ⚙️ Technology Stack

## Backend

| Technology    | Purpose                   |
| -------------- | -------------------------- |
| Python        | Core programming language |
| FastAPI       | REST API backend          |
| Uvicorn       | ASGI server               |
| Pydantic      | Data validation           |
| PyPDF         | PDF text extraction       |
| Python-dotenv | Environment configuration |

---

## AI / LLM

| Technology         | Purpose               |
| -------------------- | ---------------------- |
| Mistral AI         | Large Language Model  |
| LangChain          | LLM orchestration     |
| Structured Output  | Reliable AI responses |
| Prompt Engineering | Agent behavior        |

---

## Frontend

| Technology  | Purpose                   |
| ------------ | -------------------------- |
| React.js    | UI                        |
| Vite        | Development/build tooling |
| JavaScript  | Frontend logic            |
| CSS         | UI styling                |
| Fetch/Axios | API communication         |

---

# 🔌 API Architecture

```mermaid
flowchart LR

    UI["React Frontend"]

    UPLOAD["POST /resume/upload"]

    QUESTIONS["POST /interview/questions"]

    START["POST /interview/start"]

    ANSWER["POST /interview/answer"]

    FINALPOST["POST /interview/final"]

    FINALGET["GET /interview/final/{session_id}"]


    UI --> UPLOAD
    UI --> QUESTIONS
    UI --> START
    UI --> ANSWER
    UI --> FINALPOST
    UI --> FINALGET
```

---

# 🌐 API Documentation

## 1. Upload Resume

```http
POST /resume/upload
```

### Input

```text
multipart/form-data
file = resume.pdf
```

### Processing

```text
PDF
 ↓
Text Extraction
 ↓
Resume Agent
 ↓
Candidate Profile
```

---

# 2. Generate Questions

```http
POST /interview/questions
```

### Input

```json
{
  "resume_analysis": {
    "candidate_name": "Candidate",
    "skills": [
      "Python",
      "SQL",
      "Machine Learning"
    ],
    "projects": [
      "AI Interviewer"
    ]
  }
}
```

---

# 3. Start Interview

```http
POST /interview/start
```

Creates an interview session.

Example response:

```json
{
  "session_id": "abc123",
  "question_number": 1,
  "question": "Tell me about your AI Interviewer project."
}
```

---

# 4. Submit Answer

```http
POST /interview/answer
```

Example:

```json
{
  "session_id": "abc123",
  "answer": "I built the backend using FastAPI..."
}
```

The backend:

```text
Answer
 ↓
Answer Evaluator
 ↓
Evaluation
 ↓
Next Question
```

---

# 5. Generate Final Report

```http
POST /interview/final
```

After all 10 questions are completed, the final report is generated.

---

# 6. Get Final Report

```http
GET /interview/final/{session_id}
```

Used by the frontend report page.

Example:

```text
/interview/final/abc123
```

---

# 🔄 Complete API Lifecycle

```mermaid
sequenceDiagram

    participant U as User
    participant R as React
    participant F as FastAPI
    participant A as AI Agents
    participant L as LLM

    U->>R: Upload Resume
    R->>F: POST /resume/upload
    F->>A: Resume Analysis
    A->>L: Analyze Resume
    L-->>A: Candidate Profile
    A-->>F: Profile
    F-->>R: Resume Analysis

    U->>R: Start Interview
    R->>F: POST /interview/start
    F->>A: Generate Question
    A->>L: Create Question
    L-->>A: Question
    A-->>F: Question
    F-->>R: Q1

    U->>R: Submit Answer
    R->>F: POST /interview/answer
    F->>A: Evaluate Answer
    A->>L: Evaluate
    L-->>A: Scores
    A-->>F: Evaluation

    F->>A: Generate Next Question
    A->>L: Generate
    L-->>A: Question
    A-->>F: Next Question
    F-->>R: Next Question

    Note over U,L: Process continues until Q10

    U->>R: Complete Interview
    R->>F: POST /interview/final
    F->>A: Generate Final Report
    A->>L: Analyze Performance
    L-->>A: Final Report
    A-->>F: Report
    F-->>R: Report
    R-->>U: Display Report
```

---

# 💻 Installation

## 1. Clone Repository

```bash
git clone https://github.com/akashsinghsagar/AI-INTERVIEW.git
```

```bash
cd AI-INTERVIEW/ai-interviewer
```

---

# 🐍 Backend Setup

Go to backend:

```cmd
cd backend
```

Create virtual environment:

```cmd
python -m venv venv
```

Activate:

```cmd
venv\Scripts\activate
```

Install dependencies:

```cmd
pip install -r requirements.txt
```

---

# 🔐 Environment Variables

Create:

```text
backend/.env
```

Example:

```env
APP_NAME=AI Interviewer
DEBUG=True
HOST=127.0.0.1
PORT=8000

SECRET_KEY=your-secret-key

MISTRAL_API_KEY=your-mistral-api-key
MODEL_NAME=your-available-mistral-model

DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_interviewer

REDIS_URL=redis://localhost:6379
```

> **Never commit `.env` or API keys to GitHub.**

Add to `.gitignore`:

```gitignore
.env
venv/
__pycache__/
*.pyc
uploads/
```

---

# 🚀 Run Backend

From:

```text
backend/
```

run:

```cmd
venv\Scripts\activate
```

Then:

```cmd
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

ReDoc:

```text
http://127.0.0.1:8000/redoc
```

---

# ⚛️ Frontend Setup

Open a **second terminal**.

```cmd
cd "C:\Users\ARSH\OneDrive\Desktop\AI-INTERVIEW\ai-interviewer\frontend"
```

Install dependencies:

```cmd
npm install
```

Run:

```cmd
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🖥️ Running Both Servers

You need two terminals.

### Terminal 1

```cmd
cd "C:\Users\ARSH\OneDrive\Desktop\AI-INTERVIEW\ai-interviewer\backend"
venv\Scripts\activate
uvicorn app.main:app --reload
```

### Terminal 2

```cmd
cd "C:\Users\ARSH\OneDrive\Desktop\AI-INTERVIEW\ai-interviewer\frontend"
npm run dev
```

Architecture:

```text
       Browser
          │
          ▼
┌─────────────────────┐
│ React :5173         │
│ Frontend            │
└─────────┬───────────┘
          │
          │ REST API
          ▼
┌─────────────────────┐
│ FastAPI :8000       │
│ Backend             │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Mistral AI API      │
└─────────────────────┘
```

---

# 🧪 Testing

## Backend Health Check

Open:

```text
http://127.0.0.1:8000/
```

Expected:

```json
{
  "message": "AI Interviewer API is running 🚀"
}
```

---

## Swagger API Testing

Open:

```text
http://127.0.0.1:8000/docs
```

You can test:

```text
POST /resume/upload
POST /interview/questions
POST /interview/start
POST /interview/answer
POST /interview/final

GET /interview/final/{session_id}
```

---

# 🧠 Interview Logic

The interview maintains a session containing information such as:

```text
session_id
resume_analysis
current_question
question_number
conversation
answers
evaluations
stage
interview_completed
```

Conceptually:

```mermaid
stateDiagram-v2

    [*] --> ResumeUpload

    ResumeUpload --> ResumeAnalysis

    ResumeAnalysis --> Stage1

    Stage1 --> Stage1_Q2
    Stage1_Q2 --> Stage2

    Stage2 --> Stage2_Q2
    Stage2_Q2 --> Stage3

    Stage3 --> Stage3_Q2
    Stage3_Q2 --> Stage4

    Stage4 --> Stage4_Q2
    Stage4_Q2 --> Stage5

    Stage5 --> Stage5_Q2

    Stage5_Q2 --> InterviewCompleted

    InterviewCompleted --> FinalReport

    FinalReport --> [*]
```

---

# 📊 Evaluation Methodology

For each answer, the evaluator analyzes:

```text
                    Candidate Answer
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
         Technical      Relevance      Clarity
         Knowledge
             │             │             │
             └─────────────┼─────────────┘
                           │
                     Completeness
                           │
                       Confidence
                           │
                     Technical Depth
                           │
                           ▼
                    Overall Evaluation
```

The system is instructed to evaluate **what the candidate actually answered**, rather than giving credit for information that was not demonstrated.

---

# 🛡️ Resume Grounding

One of the important design principles is:

> **Do not invent candidate experience.**

For example, if the resume contains:

```text
Python
FastAPI
Machine Learning
```

the interviewer can ask about these technologies.

But if the resume does not contain:

```text
Kubernetes
AWS
Docker
```

the system should not claim that the candidate has professional experience with those technologies.

---

# 🔒 Security Considerations

The project uses environment variables for sensitive credentials.

Never commit:

```text
.env
API Keys
Passwords
Database credentials
Secret keys
```

Use:

```gitignore
.env
```

If an API key is accidentally pushed to GitHub:

1. Revoke the key.
2. Generate a new key.
3. Update `.env`.
4. Remove the secret from Git history if necessary.

---

# ⚠️ Error Handling

The backend should handle common failures such as:

```text
Invalid PDF
Empty resume
LLM API failure
Invalid JSON response
Missing session
Invalid session ID
Interview already completed
Missing answer
Model unavailable
API rate limit
```

Example:

```text
Client
  ↓
FastAPI
  ↓
Validation
  ↓
Agent
  ↓
LLM
  ↓
Structured Response
```

---

# 🧩 Structured AI Output

For production reliability, AI-generated outputs should be validated using structured schemas.

Example:

```text
LLM
 ↓
JSON / Structured Output
 ↓
Pydantic Validation
 ↓
FastAPI Response
 ↓
React
```

This prevents malformed LLM responses from breaking the application.

---

# 📱 Frontend User Journey

```mermaid
flowchart TD

    HOME["🏠 Home Page"]

    UPLOAD["📄 Upload Resume"]

    PREVIEW["👤 Candidate Profile"]

    START["▶️ Start Interview"]

    INTERVIEW["🎤 Interview Screen"]

    Q1["Question 1"]
    Q2["Question 2"]

    PROGRESS["📊 Progress"]

    Q10["Question 10"]

    COMPLETE["✅ Interview Complete"]

    REPORT["📋 Final Report"]


    HOME --> UPLOAD
    UPLOAD --> PREVIEW
    PREVIEW --> START
    START --> INTERVIEW

    INTERVIEW --> Q1
    Q1 --> Q2
    Q2 --> PROGRESS

    PROGRESS --> INTERVIEW

    INTERVIEW --> Q10
    Q10 --> COMPLETE
    COMPLETE --> REPORT
```

---

# 🎨 Interview UI Concept

```text
┌───────────────────────────────────────────────────────┐
│                  LIVE INTERVIEW                       │
├───────────────────────┬───────────────────────────────┤
│                       │                               │
│ INTERVIEW STAGES      │       QUESTION 7 / 10         │
│                       │                               │
│ ● Resume Parsed       │   How did you evaluate       │
│   COMPLETED           │   your machine learning      │
│                       │   model?                      │
│ ● Experience          │                               │
│   COMPLETED           │                               │
│                       │   ┌───────────────────────┐   │
│ ● Certifications      │   │ Type your answer...   │   │
│   COMPLETED           │   │                       │   │
│                       │   └───────────────────────┘   │
│ ● Projects            │                               │
│   IN PROGRESS         │            [ Submit ]         │
│                       │                               │
│ ○ Wrap-up             │                               │
│                       │                               │
│ PROGRESS              │                               │
│ ███████████░░░ 70%    │                               │
│ 7 / 10 questions      │                               │
└───────────────────────┴───────────────────────────────┘
```

---

# 📋 Report UI Concept

```text
┌──────────────────────────────────────────────┐
│           INTERVIEW PERFORMANCE              │
├──────────────────────────────────────────────┤
│                                              │
│             OVERALL SCORE                    │
│                  82/100                      │
│                                              │
│          Interview Completed                 │
│                                              │
├──────────────────────────────────────────────┤
│ SKILL SCORES                                 │
│                                              │
│ Technical Knowledge     ████████░░  8.2      │
│ Problem Solving         ███████░░░  7.5      │
│ Communication           ████████░░  8.0      │
│ Confidence              ████████░░  8.1      │
│ Technical Depth         ███████░░░  7.4      │
│                                              │
├──────────────────────────────────────────────┤
│ QUESTION ANALYSIS                            │
│                                              │
│ Q1  ████████░░  8.0                          │
│ Q2  █████████░  9.0                          │
│ Q3  ███████░░░  7.0                          │
│ ...                                          │
│ Q10 ████████░░  8.0                          │
│                                              │
├──────────────────────────────────────────────┤
│ STRENGTHS                                    │
│                                              │
│ ✓ Strong Python knowledge                    │
│ ✓ Good project understanding                 │
│ ✓ Clear explanations                         │
│                                              │
├──────────────────────────────────────────────┤
│ AREAS TO IMPROVE                             │
│                                              │
│ • Technical depth                            │
│ • Evaluation metrics                         │
│ • System design                              │
│                                              │
└──────────────────────────────────────────────┘
```

---

# 🔄 Complete End-to-End Data Flow

```mermaid
flowchart TD

    USER["👤 Candidate"]

    PDF["📄 Resume PDF"]

    EXTRACT["📑 PDF Text Extraction"]

    PROFILE["🧠 Resume Analysis"]

    QUESTIONS["❓ Personalized Questions"]

    INTERVIEW["🎤 10-Question Interview"]

    ANSWERS["💬 Candidate Answers"]

    EVALUATION["📊 Answer Evaluations"]

    AGGREGATION["📈 Score Aggregation"]

    REPORT["📋 Final Report"]

    UI["⚛️ React Dashboard"]


    USER --> PDF
    PDF --> EXTRACT
    EXTRACT --> PROFILE
    PROFILE --> QUESTIONS
    QUESTIONS --> INTERVIEW
    INTERVIEW --> ANSWERS
    ANSWERS --> EVALUATION
    EVALUATION --> AGGREGATION
    AGGREGATION --> REPORT
    REPORT --> UI
    UI --> USER
```

---

# 📈 Project Metrics

The current architecture provides:

```text
                 AI INTERVIEWER
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    5 Agents       5 Stages       10 Questions
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
                Final AI Report
```

### Current measurable architecture

| Metric                    |      Value |
| -------------------------- | -----------: |
| Specialized AI Agents     |          5 |
| Interview Stages          |          5 |
| Questions / Stage         |          2 |
| Total Interview Questions |         10 |
| Core API Endpoints        |          5 |
| Resume Input              |        PDF |
| Backend Framework         |    FastAPI |
| Frontend Framework        |      React |
| LLM Framework             |  LangChain |
| Primary LLM               | Mistral AI |

> Response-time performance is intentionally not reported because it has not been formally benchmarked.

---

# 🚀 Future Improvements

## 🎙️ Voice Interview

Add:

```text
Speech-to-Text
      ↓
AI Interviewer
      ↓
Text-to-Speech
      ↓
Candidate
```

Potential technologies:

* Whisper
* TTS models
* Browser Speech APIs

---

## 👁️ Interview Behavior Analysis

Future versions could analyze:

```text
Eye Contact
Posture
Facial Expressions
Speaking Speed
Pauses
Filler Words
Confidence
```

---

## 🎧 Audio Analysis

```mermaid
flowchart LR

    VOICE["🎤 Candidate Voice"]

    STT["📝 Speech-to-Text"]

    AUDIO["🔊 Audio Analysis"]

    NLP["🧠 Language Analysis"]

    SCORE["📊 Communication Score"]


    VOICE --> STT
    VOICE --> AUDIO
    STT --> NLP
    AUDIO --> SCORE
    NLP --> SCORE
```

---

# ☁️ Deployment Architecture

Future production architecture:

```mermaid
flowchart TB

    USER["👤 User"]

    FRONT["⚛️ React Application"]

    BACKEND["🚀 FastAPI"]

    REDIS["⚡ Redis"]

    DB["🐘 PostgreSQL"]

    LLM["🤖 LLM API"]

    STORAGE["☁️ File Storage"]


    USER --> FRONT
    FRONT --> BACKEND

    BACKEND --> REDIS
    BACKEND --> DB
    BACKEND --> LLM
    BACKEND --> STORAGE
```

Potential deployment platforms:

```text
Frontend → Vercel
Backend  → Render / Railway
Database → PostgreSQL
Cache    → Redis
LLM      → Mistral / Gemini / Groq
```

---

# 🔮 Planned Architecture

The project can eventually evolve into:

```text
                    AI INTERVIEW PLATFORM
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   Resume AI          Interview AI        Evaluation AI
        │                   │                   │
        ▼                   ▼                   ▼
 Resume Parsing       Adaptive Q&A       Answer Scoring
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
                     Performance AI
                            │
                            ▼
                    Final Assessment
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
         Analytics      Improvement      Reports
```

---

# 🧪 Development Principles

The project follows several principles:

### 1. Resume Grounding

AI should use information actually present in the resume.

### 2. Structured Interview

The interview follows a fixed 5-stage / 10-question structure.

### 3. One Question at a Time

The interviewer should not ask multiple questions simultaneously.

### 4. Adaptive Conversation

Follow-up questions can consider previous answers.

### 5. Structured Evaluation

Every answer is evaluated using predefined criteria.

### 6. Separation of Responsibilities

Different AI agents handle different tasks.

### 7. API-Based Architecture

Frontend and backend communicate through REST APIs.

---

# 🛠️ Troubleshooting

## Backend doesn't start

Check:

```cmd
venv\Scripts\activate
```

Then:

```cmd
uvicorn app.main:app --reload
```

---

## `venv\Scripts\activate` not found

Make sure you're inside:

```text
ai-interviewer\backend
```

Then:

```cmd
venv\Scripts\activate
```

---

## Frontend doesn't start

Run:

```cmd
npm install
```

Then:

```cmd
npm run dev
```

---

## CORS Error

Make sure FastAPI allows the React development server:

```text
http://localhost:5173
```

---

## LLM 403 / Model Not Available

If the LLM provider returns:

```text
403
tier_not_allowed
```

the configured model is not available to the API account's current tier.

Check the provider's available models and update:

```env
MODEL_NAME=...
```

---

## LLM Rate Limit

If you receive:

```text
429 Too Many Requests
```

check the provider's current rate limits and avoid sending unnecessary repeated requests.

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

## Akash Singh Sagar

**B.Tech Computer Science & Engineering — Data Science**

### Skills

```text
Python
SQL
Machine Learning
Deep Learning
FastAPI
React.js
LangChain
LLM
RAG
NLP
Power BI
Docker
Git/GitHub
```

### Connect

* GitHub: `https://github.com/akashsinghsagar`
* LinkedIn: `https://linkedin.com/in/akashsinghsagar`

---

# ⭐ Project Summary

**AI Interviewer** is a full-stack AI interview platform that combines **resume analysis, specialized AI agents, adaptive interview questioning, answer evaluation, and automated reporting** into one workflow.

```text
                    📄 RESUME
                       │
                       ▼
              🧠 RESUME ANALYSIS
                       │
                       ▼
              👤 CANDIDATE PROFILE
                       │
                       ▼
            🎯 PERSONALIZED INTERVIEW
                       │
              ┌────────┴────────┐
              │                 │
             Q1                Q2
              │                 │
              └────────┬────────┘
                       ▼
                    STAGE 2
                       │
                       ▼
                    STAGE 3
                       │
                       ▼
                    STAGE 4
                       │
                       ▼
                    STAGE 5
                       │
                       ▼
                  💬 10 ANSWERS
                       │
                       ▼
                 📊 AI EVALUATION
                       │
                       ▼
              📈 PERFORMANCE ANALYSIS
                       │
                       ▼
                 📋 FINAL REPORT
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Strengths     Weaknesses   Improvement
                                    Plan
```

---

## 🏆 Core Architecture at a Glance

```text
┌─────────────────────────────────────────────────────────┐
│                    AI INTERVIEWER                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  React.js ────────────────► FastAPI                    │
│                                 │                       │
│                                 ▼                       │
│                         ┌───────────────┐               │
│                         │ 5 AI AGENTS   │               │
│                         ├───────────────┤               │
│                         │ Resume        │               │
│                         │ Interviewer   │               │
│                         │ Live          │               │
│                         │ Evaluator     │               │
│                         │ Report        │               │
│                         └───────┬───────┘               │
│                                 │                       │
│                                 ▼                       │
│                           Mistral AI                     │
│                                 │                       │
│                                 ▼                       │
│                    5 STAGES × 2 QUESTIONS              │
│                                 │                       │
│                                 ▼                       │
│                         10 ANSWERS                      │
│                                 │                       │
│                                 ▼                       │
│                    DETAILED AI REPORT                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 🔥 One-line project description

> **AI Interviewer is a full-stack AI interview platform featuring 5 specialized AI agents, a 5-stage/10-question resume-aware interview pipeline, automated answer evaluation, and comprehensive AI-generated performance reports using FastAPI, React.js, LangChain, and Mistral AI.**
