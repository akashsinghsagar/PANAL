import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'

/* ============================================================
   ICONS
============================================================ */

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const IconAward = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
)

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const IconTarget = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="18" />
  </svg>
)

const IconBook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)

const IconClock = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

/* ============================================================
   HELPERS
============================================================ */

function normalizeScore(value) {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return 0
  }

  if (number > 10) {
    return Math.min(number / 10, 10)
  }

  return Math.min(Math.max(number, 0), 10)
}

function score100(value) {
  return Math.round(normalizeScore(value) * 10)
}

function score10(value) {
  return Math.round(normalizeScore(value) * 10) / 10
}

function getScoreLevel(score) {
  const value = score100(score)

  if (value >= 85) return 'Strong'
  if (value >= 70) return 'Good'
  if (value >= 55) return 'Moderate'
  return 'Needs Improvement'
}

function getRecommendationClass(recommendation = '') {
  const value = recommendation.toLowerCase()

  if (
    value.includes('strong hire') ||
    value.includes('strongly recommended')
  ) {
    return 'rep-badge--strong-hire'
  }

  if (
    value === 'hire' ||
    value.includes('recommended')
  ) {
    return 'rep-badge--hire'
  }

  if (value.includes('improvement')) {
    return 'rep-badge--improve'
  }

  return 'rep-badge--consider'
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string' && value.trim()) return [value]
  return []
}

/* ============================================================
   SCORE ROW
============================================================ */

function ScoreRow({ label, score }) {
  const normalized = normalizeScore(score)
  const percentage = normalized * 10

  return (
    <div className="rep-score-row">
      <div className="rep-score-info">
        <span className="rep-score-label">{label}</span>

        <span className="rep-score-num">
          {score100(normalized)}/100
        </span>
      </div>

      <div className="rep-score-bar-bg">
        <div
          className="rep-score-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({ label, value, icon }) {
  return (
    <div className="rep-stat-card">
      <div className="rep-stat-icon">
        {icon}
      </div>

      <div>
        <div className="rep-stat-label">{label}</div>
        <div className="rep-stat-value">{value}</div>
      </div>
    </div>
  )
}

/* ============================================================
   STRENGTH / WEAKNESS ITEM
============================================================ */

function BulletItem({ children, type = 'success' }) {
  return (
    <div className="rep-bullet-item">
      <span
        className={
          type === 'success'
            ? 'rep-bullet-icon rep-bullet-icon--green'
            : 'rep-bullet-icon rep-bullet-icon--accent'
        }
      >
        {type === 'success' ? <IconCheck /> : <IconTarget />}
      </span>

      <span className="rep-bullet-text">
        {children}
      </span>
    </div>
  )
}

/* ============================================================
   QUESTION ANALYSIS
============================================================ */

function QuestionAnalysis({ item, index }) {
  const question =
    item.question ||
    item.interview_question ||
    `Question ${index + 1}`

  const answer =
    item.answer ||
    item.candidate_answer ||
    'No answer recorded.'

  const score = item.score ??
    item.overall_score ??
    item.evaluation?.overall_score ??
    0

  const correctness =
    item.correctness ||
    item.evaluation?.correctness ||
    getScoreLevel(score)

  const relevance =
    item.relevance ||
    item.evaluation?.relevance ||
    getScoreLevel(
      item.evaluation?.relevance ??
      score
    )

  const technicalDepth =
    item.technical_depth ||
    item.evaluation?.technical_depth ||
    getScoreLevel(
      item.evaluation?.technical_knowledge ??
      score
    )

  const strengths = normalizeArray(
    item.what_you_did_well ||
    item.strengths ||
    item.evaluation?.strengths
  )

  const improvements = normalizeArray(
    item.what_you_could_improve ||
    item.improvements ||
    item.weaknesses ||
    item.evaluation?.weaknesses
  )

  const betterApproach =
    item.better_answer_approach ||
    item.better_approach ||
    item.evaluation?.better_answer_approach ||
    'Provide a structured answer with the approach, implementation details, challenges, and measurable results.'

  return (
    <div className="rep-question-card">

      <div className="rep-question-header">

        <div>
          <div className="rep-question-number">
            QUESTION {index + 1}
          </div>

          <h3 className="rep-question-title">
            {question}
          </h3>
        </div>

        <div className="rep-question-score">
          {score100(score)}/100
        </div>

      </div>

      <div className="rep-answer-box">
        <div className="rep-mini-label">
          Candidate Answer
        </div>

        <p>
          {answer}
        </p>
      </div>

      <div className="rep-analysis-grid">

        <div className="rep-analysis-item">
          <span>Correctness</span>
          <strong>{correctness}</strong>
        </div>

        <div className="rep-analysis-item">
          <span>Relevance</span>
          <strong>{relevance}</strong>
        </div>

        <div className="rep-analysis-item">
          <span>Technical Depth</span>
          <strong>{technicalDepth}</strong>
        </div>

      </div>

      {strengths.length > 0 && (
        <div className="rep-question-section">

          <h4>What you did well</h4>

          {strengths.map((strength, i) => (
            <BulletItem key={i}>
              {strength}
            </BulletItem>
          ))}

        </div>
      )}

      {improvements.length > 0 && (
        <div className="rep-question-section">

          <h4>What you could improve</h4>

          {improvements.map((improvement, i) => (
            <BulletItem
              key={i}
              type="improvement"
            >
              {improvement}
            </BulletItem>
          ))}

        </div>
      )}

      <div className="rep-better-answer">

        <div className="rep-mini-label">
          Better Answer Approach
        </div>

        <p>
          {betterApproach}
        </p>

      </div>

    </div>
  )
}

/* ============================================================
   MISTAKES TABLE
============================================================ */

function MistakesTable({ mistakes }) {
  if (!mistakes.length) {
    return (
      <div className="rep-empty-state">
        No major corrections were identified in the available answers.
      </div>
    )
  }

  return (
    <div className="rep-table-wrapper">

      <table className="rep-table">

        <thead>
          <tr>
            <th>Candidate Used</th>
            <th>Correct Version</th>
            <th>Type</th>
          </tr>
        </thead>

        <tbody>

          {mistakes.map((mistake, index) => {

            if (typeof mistake === 'string') {
              return (
                <tr key={index}>
                  <td>{mistake}</td>
                  <td>See feedback</td>
                  <td>Correction</td>
                </tr>
              )
            }

            return (
              <tr key={index}>
                <td>
                  {mistake.candidate_used ||
                    mistake.used ||
                    mistake.original ||
                    '—'}
                </td>

                <td>
                  {mistake.correct_version ||
                    mistake.correct ||
                    mistake.correction ||
                    '—'}
                </td>

                <td>
                  {mistake.type ||
                    mistake.category ||
                    'General'}
                </td>
              </tr>
            )
          })}

        </tbody>

      </table>

    </div>
  )
}

/* ============================================================
   RESUME VERIFICATION
============================================================ */

function ResumeVerification({ data }) {

  if (!data) {
    return (
      <div className="rep-empty-state">
        Resume-vs-interview analysis is not available yet.
      </div>
    )
  }

  const demonstrated = normalizeArray(
    data.strongly_demonstrated ||
    data.stronglyDemonstrated ||
    data.strong
  )

  const partial = normalizeArray(
    data.partially_demonstrated ||
    data.partiallyDemonstrated ||
    data.partial
  )

  const notDemonstrated = normalizeArray(
    data.not_demonstrated ||
    data.notDemonstrated ||
    data.not_demonstrated_skills ||
    data.not_demonstrated_projects
  )

  return (
    <div className="rep-verification-grid">

      <div className="rep-verification-card rep-verification-card--strong">

        <h4>
          <IconCheck />
          Strongly Demonstrated
        </h4>

        {demonstrated.length > 0 ? (
          demonstrated.map((item, index) => (
            <div key={index} className="rep-verification-item">
              {item}
            </div>
          ))
        ) : (
          <div className="rep-muted">
            None identified
          </div>
        )}

      </div>

      <div className="rep-verification-card rep-verification-card--partial">

        <h4>
          <IconAlert />
          Partially Demonstrated
        </h4>

        {partial.length > 0 ? (
          partial.map((item, index) => (
            <div key={index} className="rep-verification-item">
              {item}
            </div>
          ))
        ) : (
          <div className="rep-muted">
            None identified
          </div>
        )}

      </div>

      <div className="rep-verification-card rep-verification-card--missing">

        <h4>
          <IconTarget />
          Not Demonstrated
        </h4>

        {notDemonstrated.length > 0 ? (
          notDemonstrated.map((item, index) => (
            <div key={index} className="rep-verification-item">
              {item}
            </div>
          ))
        ) : (
          <div className="rep-muted">
            None identified
          </div>
        )}

      </div>

    </div>
  )
}

/* ============================================================
   MAIN REPORT
============================================================ */

export default function Report() {

  const { sessionId } = useParams()

  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {

    if (!sessionId) {
      setError('Interview session ID is missing.')
      return
    }

    api
      .getReport(sessionId)
      .then(res => {
        setReport(res?.report || res)
      })
      .catch(err => {
        setError(
          err?.message ||
          'Failed to load the final interview report.'
        )
      })

  }, [sessionId])

  /* ==========================================================
     LOADING
  ========================================================== */

  if (!report && !error) {

    return (
      <div className="loading-panel">

        <div className="spinner-ring" />

        <div className="spinner-text">
          Analyzing answers &amp; generating final report…
        </div>

      </div>
    )
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error) {

    return (
      <div className="rep-container">

        <div className="error-msg">

          <IconAlert />

          <span>{error}</span>

        </div>

        <Link
          to="/"
          className="rep-back-link"
        >
          <IconArrowLeft />
          Back to home
        </Link>

      </div>
    )
  }

  /* ==========================================================
     NORMALIZE REPORT
  ========================================================== */

  const candidateName =
    report.candidate_name ||
    report.candidate?.name ||
    report.candidateName ||
    'Candidate'

  const targetRole =
    report.target_role ||
    report.targetRole ||
    report.role ||
    'Technical Role'

  const experience =
    report.experience ||
    report.candidate?.experience ||
    'Not specified'

  const interviewDate =
    report.interview_date ||
    report.interviewDate ||
    new Date().toLocaleDateString()

  const totalQuestions =
    report.total_questions ||
    report.totalQuestions ||
    report.question_count ||
    report.questions?.length ||
    10

  const answeredQuestions =
    report.questions_answered ||
    report.questionsAnswered ||
    report.answered_questions ||
    report.question_analysis?.length ||
    totalQuestions

  const duration =
    report.interview_duration ||
    report.interviewDuration ||
    'Not recorded'

  const overallScore =
    report.overall_score ??
    report.overallScore ??
    0

  const recommendation =
    report.recommendation ||
    'Consider'

  const feedbackSummary =
    report.final_feedback ||
    report.summary ||
    report.executive_summary ||
    'No executive summary was generated.'

  const strengths = normalizeArray(
    report.strengths ||
    report.core_strengths
  )

  const weaknesses = normalizeArray(
    report.weaknesses ||
    report.areas_to_improve ||
    report.gaps
  )

  const mistakes = normalizeArray(
    report.mistakes ||
    report.corrections ||
    report.language_corrections
  )

  const questions = normalizeArray(
    report.question_analysis ||
    report.questions_analysis ||
    report.questions
  )

  const improvementPlan =
    report.improvement_plan ||
    report.personalized_improvement_plan ||
    {}

  const next7Days = normalizeArray(
    improvementPlan.next_7_days ||
    improvementPlan.next7Days
  )

  const next30Days = normalizeArray(
    improvementPlan.next_30_days ||
    improvementPlan.next30Days
  )

  const communication =
    report.communication_analysis ||
    report.written_communication ||
    {}

  const resumeVerification =
    report.resume_vs_interview ||
    report.resume_verification ||
    report.resume_analysis

  const recClass =
    getRecommendationClass(recommendation)

  const overallLevel =
    report.performance_level ||
    getScoreLevel(overallScore)

  /* ==========================================================
     SKILLS
  ========================================================== */

  const skillScores = [
    {
      label: 'Technical Knowledge',
      value: report.technical_knowledge ?? 0
    },
    {
      label: 'Problem Solving',
      value: report.problem_solving ?? 0
    },
    {
      label: 'Communication',
      value: report.communication ?? report.clarity ?? 0
    },
    {
      label: 'Answer Relevance',
      value: report.relevance ?? 0
    },
    {
      label: 'Confidence',
      value: report.confidence ?? 0
    },
    {
      label: 'Technical Depth',
      value: report.technical_depth ??
        report.technical_knowledge ??
        0
    },
    {
      label: 'Professionalism',
      value: report.professionalism ?? 0
    }
  ]

  return (

    <div className="rep-container">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="rep-header">

        <div className="rep-header-left">

          <div className="rep-eyebrow">
            Assessed Profile Evaluation
          </div>

          <h1 className="rep-title">
            Performance Report
          </h1>

        </div>

        <Link
          to="/"
          className="rep-back-link"
        >
          <IconArrowLeft />
          Back to home
        </Link>

      </header>


      {/* ======================================================
          CANDIDATE OVERVIEW
      ====================================================== */}

      <section className="rep-card rep-overview-card">

        <div className="rep-overview-main">

          <div>

            <div className="rep-eyebrow">
              Candidate
            </div>

            <h2 className="rep-candidate-name">
              {candidateName}
            </h2>

            <div className="rep-candidate-role">
              {targetRole}
            </div>

          </div>

          <div className="rep-overview-score">

            <div className="rep-score-circle">

              <span className="rep-score-value">
                {score100(overallScore)}
              </span>

              <span className="rep-score-total">
                /100
              </span>

            </div>

            <div className="rep-score-title">
              Overall Score
            </div>

          </div>

        </div>


        <div className="rep-stats-grid">

          <StatCard
            label="Experience"
            value={experience}
            icon={<IconAward />}
          />

          <StatCard
            label="Interview Date"
            value={interviewDate}
            icon={<IconClock />}
          />

          <StatCard
            label="Questions"
            value={`${answeredQuestions}/${totalQuestions}`}
            icon={<IconBook />}
          />

          <StatCard
            label="Duration"
            value={duration}
            icon={<IconClock />}
          />

        </div>

      </section>


      {/* ======================================================
          EXECUTIVE SUMMARY
      ====================================================== */}

      <section className="rep-card rep-card--accent-left">

        <h3 className="rep-sec-heading">
          Executive Summary
        </h3>

        <p className="rep-paragraph">
          {feedbackSummary}
        </p>

      </section>


      {/* ======================================================
          OVERALL SKILL SCORES
      ====================================================== */}

      <section className="rep-card">

        <h3 className="rep-sec-heading">
          Overall Skill Scores
        </h3>

        <div className="rep-scores-list">

          {skillScores.map((skill, index) => (
            <ScoreRow
              key={index}
              label={skill.label}
              score={skill.value}
            />
          ))}

        </div>

      </section>


      {/* ======================================================
          QUESTION-BY-QUESTION ANALYSIS
      ====================================================== */}

      <section className="rep-card">

        <div className="rep-section-heading-row">

          <div>
            <h3 className="rep-sec-heading">
              Question-by-Question Analysis
            </h3>

            <p className="rep-section-description">
              Detailed evaluation of each interview answer.
            </p>
          </div>

          <div className="rep-question-count">
            {questions.length || totalQuestions} Questions
          </div>

        </div>


        {questions.length > 0 ? (

          <div className="rep-question-list">

            {questions.map((item, index) => (
              <QuestionAnalysis
                key={index}
                item={item}
                index={index}
              />
            ))}

          </div>

        ) : (

          <div className="rep-empty-state">
            Detailed question analysis is not available.
          </div>

        )}

      </section>


      {/* ======================================================
          COMMUNICATION ANALYSIS
      ====================================================== */}

      <section className="rep-card">

        <h3 className="rep-sec-heading">
          Communication &amp; Speaking Analysis
        </h3>

        <p className="rep-section-description">
          Written communication analysis for the current V1 text-based interview.
          Voice and pronunciation analysis can be added in V2.
        </p>

        <div className="rep-communication-grid">

          <div>
            <span>Fluency</span>
            <strong>
              {communication.fluency || 'Not analyzed'}
            </strong>
          </div>

          <div>
            <span>Clarity</span>
            <strong>
              {communication.clarity ||
                report.clarity ||
                'Not analyzed'}
            </strong>
          </div>

          <div>
            <span>Grammar</span>
            <strong>
              {communication.grammar || 'Not analyzed'}
            </strong>
          </div>

          <div>
            <span>Vocabulary</span>
            <strong>
              {communication.vocabulary || 'Not analyzed'}
            </strong>
          </div>

          <div>
            <span>Speaking Speed</span>
            <strong>
              {communication.speaking_speed ||
                communication.speakingSpeed ||
                'V2'}
            </strong>
          </div>

          <div>
            <span>Filler Words</span>
            <strong>
              {communication.filler_words ||
                communication.fillerWords ||
                'V2'}
            </strong>
          </div>

          <div>
            <span>Pauses</span>
            <strong>
              {communication.pauses || 'V2'}
            </strong>
          </div>

          <div>
            <span>Pronunciation</span>
            <strong>
              {communication.pronunciation || 'V2'}
            </strong>
          </div>

        </div>

      </section>


      {/* ======================================================
          MISTAKES & CORRECTIONS
      ====================================================== */}

      <section className="rep-card">

        <h3 className="rep-sec-heading">
          Mistakes &amp; Corrections
        </h3>

        <p className="rep-section-description">
          Language, vocabulary, grammar, and technical terminology
          corrections identified from the interview.
        </p>

        <MistakesTable mistakes={mistakes} />

      </section>


      {/* ======================================================
          STRENGTHS
      ====================================================== */}

      <section className="rep-card">

        <h3 className="rep-sec-heading">
          Top Strengths
        </h3>

        <div className="rep-bullet-list">

          {strengths.length > 0 ? (

            strengths.slice(0, 5).map((strength, index) => (

              <div
                className="rep-ranked-item"
                key={index}
              >

                <span className="rep-rank">
                  {index + 1}
                </span>

                <span>
                  {strength}
                </span>

              </div>

            ))

          ) : (

            <div className="rep-empty-state">
              No strengths were generated.
            </div>

          )}

        </div>

      </section>


      {/* ======================================================
          WEAKNESSES
      ====================================================== */}

      <section className="rep-card">

        <h3 className="rep-sec-heading">
          Top Areas to Improve
        </h3>

        <div className="rep-bullet-list">

          {weaknesses.length > 0 ? (

            weaknesses.slice(0, 5).map((weakness, index) => (

              <div
                className="rep-ranked-item"
                key={index}
              >

                <span className="rep-rank rep-rank--warning">
                  {index + 1}
                </span>

                <span>
                  {weakness}
                </span>

              </div>

            ))

          ) : (

            <div className="rep-empty-state">
              No major weaknesses were identified.
            </div>

          )}

        </div>

      </section>


      {/* ======================================================
          RESUME VS INTERVIEW
      ====================================================== */}

      <section className="rep-card">

        <h3 className="rep-sec-heading">
          Resume vs Interview Analysis
        </h3>

        <p className="rep-section-description">
          Comparison between skills and experience claimed on the
          resume and what was actually demonstrated during the interview.
        </p>

        <ResumeVerification
          data={resumeVerification}
        />

      </section>


      {/* ======================================================
          FINAL VERDICT
      ====================================================== */}

      <section className="rep-card rep-final-verdict">

        <div className="rep-final-score">

          <div className="rep-final-score-number">
            {score100(overallScore)}/100
          </div>

          <div className="rep-final-score-label">
            Overall Score
          </div>

        </div>

        <div className="rep-final-content">

          <div className="rep-eyebrow">
            Performance Level
          </div>

          <h2>
            {overallLevel}
          </h2>

          <p>
            {feedbackSummary}
          </p>

        </div>

      </section>


      {/* ======================================================
          HIRING RECOMMENDATION
      ====================================================== */}

      <section className="rep-card">

        <h3 className="rep-sec-heading">
          Hiring Recommendation
        </h3>

        <div className={`rep-badge ${recClass}`}>
          {recommendation}
        </div>

      </section>


      {/* ======================================================
          PERSONALIZED IMPROVEMENT PLAN
      ====================================================== */}

      <section className="rep-card">

        <h3 className="rep-sec-heading">
          Personalized Improvement Plan
        </h3>


        <div className="rep-improvement-grid">

          <div className="rep-plan-card">

            <div className="rep-plan-title">
              Next 7 Days
            </div>

            {next7Days.length > 0 ? (

              <div className="rep-plan-list">

                {next7Days.map((item, index) => (

                  <BulletItem key={index}>
                    {item}
                  </BulletItem>

                ))}

              </div>

            ) : (

              <div className="rep-plan-list">

                <BulletItem>
                  Practice 10 technical interview questions.
                </BulletItem>

                <BulletItem>
                  Focus on the weakest technical areas.
                </BulletItem>

                <BulletItem>
                  Practice concise and structured answers.
                </BulletItem>

              </div>

            )}

          </div>


          <div className="rep-plan-card">

            <div className="rep-plan-title">
              Next 30 Days
            </div>

            {next30Days.length > 0 ? (

              <div className="rep-plan-list">

                {next30Days.map((item, index) => (

                  <BulletItem key={index}>
                    {item}
                  </BulletItem>

                ))}

              </div>

            ) : (

              <div className="rep-plan-list">

                <BulletItem>
                  Complete 5 mock technical interviews.
                </BulletItem>

                <BulletItem>
                  Strengthen weak technical skills.
                </BulletItem>

                <BulletItem>
                  Practice behavioral and problem-solving questions.
                </BulletItem>

              </div>

            )}

          </div>

        </div>

      </section>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div className="rep-footer">

        <div>
          AI Interviewer
        </div>

        <div>
          Interview Session: {sessionId}
        </div>

      </div>

    </div>
  )
}