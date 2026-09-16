import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Report() {
  const { sessionId } = useParams()

  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('Loading report for:', sessionId)

    api
      .getReport(sessionId)
      .then((data) => {
        console.log('Report API response:', data)
        setReport(data.report ?? data)
      })
      .catch((e) => {
        console.error('Report error:', e)
        setError(e.message)
      })
  }, [sessionId])

  if (error) {
    return (
      <div className="panel">
        <div className="error-box">
          {error}
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="panel">
        <div className="spinner">
          LOADING REPORT...
        </div>
      </div>
    )
  }

  return (
    <div className="panel">

      <div className="report-header">
        <div className="hero-eyebrow">
          INTERVIEW COMPLETE
        </div>

        <div className="report-score">
          {report.overall_score}
        </div>

        <div className="report-score-label">
          OVERALL SCORE / 10
        </div>

        <div style={{ marginTop: '15px' }}>
          <span className="tag">
            {report.recommendation}
          </span>
        </div>
      </div>

      <div className="report-section">
        <h3>Performance</h3>

        <p>
          Relevance: {report.relevance}/10
        </p>

        <p>
          Technical Knowledge: {report.technical_knowledge}/10
        </p>

        <p>
          Clarity: {report.clarity}/10
        </p>

        <p>
          Completeness: {report.completeness}/10
        </p>

        <p>
          Confidence: {report.confidence}/10
        </p>
      </div>

      <div className="report-section">
        <h3>Strengths</h3>

        <ul>
          {report.strengths?.map((strength, index) => (
            <li key={index}>
              {strength}
            </li>
          ))}
        </ul>
      </div>

      <div className="report-section">
        <h3>Areas to Improve</h3>

        <ul>
          {report.weaknesses?.map((weakness, index) => (
            <li key={index}>
              {weakness}
            </li>
          ))}
        </ul>
      </div>

      <div className="report-section">
        <h3>Final Feedback</h3>

        <p>
          {report.final_feedback}
        </p>
      </div>

      <div className="report-section">
        <h3>Recommendation</h3>

        <p>
          <span className="tag">
            {report.recommendation}
          </span>
        </p>
      </div>

      <Link to="/" className="btn btn-ghost">
        Start another interview
      </Link>

    </div>
  )
}