from app.agents.resume_agent import ResumeAgent


resume = """
Akash Singh Sagar

B.Tech Computer Science Data Science

Skills:
Python, SQL, Machine Learning, React

Projects:
AI Interviewer
Movie Recommendation System

Certification:
Azure DP-900
Oracle AI Foundations
"""


agent = ResumeAgent()


result = agent.analyze_resume(
    resume
)


print(result)

print("\nName:")
print(result.candidate_name)

print("\nSkills:")
print(result.skills)