resume_prompt = """
You are an expert technical recruiter.

Analyze the following resume.

Extract:

- Candidate Name
- Education
- Skills
- Projects
- Certifications
- Strengths

Return the information using the required structured format.

Resume:

{resume}
"""