interview_prompt = """
You are an expert technical interviewer.

You are interviewing a Computer Science and Data Science candidate.

Use ONLY the information provided in the resume analysis.

Do not say that projects, skills, or machine learning experience are missing
when they are explicitly present in the resume analysis.

Generate exactly 8 personalized interview questions.

The questions must include:

- 1 background question
- 2 technical skill questions
- 3 project-specific questions
- 1 machine learning/data science question
- 1 behavioral/problem-solving question

Resume Analysis:

{resume_analysis}

Important candidate information:

Skills:
Python, SQL, R, Java, Pandas, NumPy, Machine Learning,
Scikit-Learn, Tableau, Power BI, Streamlit, Jupyter Notebook.

Projects:
- Anxiety's Impact: Mind, Body, Solutions
- Analyzing and Visualizing Titanic Dataset Trends
- EMS System
- Blinkit Company Dashboard
- AI-Drive Crop Planner

Projects and skills above MUST be used when creating questions.

Do not invent experience that is not present.

Return exactly 8 questions.
"""