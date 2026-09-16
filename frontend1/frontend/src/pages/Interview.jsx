import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'

const STAGES = ['Resume parsed', 'Experience', 'Certifications', 'Projects', 'Wrap-up']

export default function Interview() {
  const { sessionId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const [question, setQuestion] = useState(state?.question || '')
  const [qNum, setQNum] = useState(state?.questionNumber || 1)
  const [answer, setAnswer] = useState('')
  const [transcript, setTranscript] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const stageIndex = Math.min(Math.floor((qNum - 1) / 2), STAGES.length - 1)

  const onSubmit = async () => {
    if (!answer.trim()) return
    setLoading(true)
    setError('')
    const askedQ = question
    try {
      const res = await api.submitAnswer(sessionId, answer)
      setTranscript((t) => [...t, { q: askedQ, a: answer, evaluation: res.evaluation }])
      setAnswer('')
      setQuestion(res.question)
      setQNum(res.question_number)
    } catch (e) {
      setError(e.message || 'Could not submit answer.')
    } finally {
      setLoading(false)
    }
  }

  // Backend has no "finished" signal — the candidate ends it manually.
  const onFinish = () => navigate(`/report/${sessionId}`)

  return (
    <div className="interview-layout">
      <div className="rail">
        {STAGES.map((s, i) => (
          <div key={s} className={`rail-stage${i === stageIndex ? ' active' : i < stageIndex ? ' done' : ''}`}>
            {s}
          </div>
        ))}
      </div>

      <div>
        <div className="qa-count">QUESTION {String(qNum).padStart(2, '0')}</div>

        {question && (
          <div className="question-card">
            <div className="question-label">INTERVIEWER</div>
            <div className="question-text">{question}</div>
          </div>
        )}

        <textarea
          className="answer-box"
          placeholder="Type your answer…"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={loading}
        />

        {error && <div className="error-box">{error}</div>}

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn" onClick={onSubmit} disabled={loading || !answer.trim()}>
            {loading ? 'Thinking…' : 'Submit answer →'}
          </button>
          <button className="btn btn-ghost" onClick={onFinish} disabled={loading}>
            Finish interview
          </button>
        </div>

        {transcript.length > 0 && (
          <div className="transcript">
            {[...transcript].reverse().map((t, i) => (
              <div className="t-item" key={i}>
                <div className="t-q">{t.q}</div>
                <div className="t-a">{t.a}</div>
                {t.evaluation && (
                  <div className="t-a" style={{ color: 'var(--teal)', marginTop: 4 }}>
                    {typeof t.evaluation === 'string' ? t.evaluation : JSON.stringify(t.evaluation)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
