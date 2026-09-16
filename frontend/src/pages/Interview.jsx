import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'

/* ── Stage config ─────────────────────────────────────────────── */
const STAGES = [
  { label: 'Resume parsed',  short: 'Resume'  },
  { label: 'Experience',     short: 'Exp'     },
  { label: 'Certifications', short: 'Certs'   },
  { label: 'Projects',       short: 'Projects'},
  { label: 'Wrap-up',        short: 'Wrap-up' },
]
const TOTAL_Q = 10

/* ── Icons ────────────────────────────────────────────────────── */
const IconSend = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)
const IconFlag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
    <line x1="4" y1="22" x2="4" y2="15"/>
  </svg>
)
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const IconChevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

/* ── Word count helper ────────────────────────────────────────── */
function wordCount(str) {
  return str.trim() ? str.trim().split(/\s+/).length : 0
}

/* ── Auto-resize textarea hook ─────────────────────────────────── */
function useAutoResize(value) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 340) + 'px'
  }, [value])
  return ref
}

/* ── Main component ───────────────────────────────────────────── */
export default function Interview() {
  const { sessionId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const [question, setQuestion] = useState(state?.question || '')
  const [qNum, setQNum] = useState(state?.questionNumber || 1)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [answeredCount, setAnsweredCount] = useState(0)
  const [questionKey, setQuestionKey] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const stageIndex = isCompleted ? STAGES.length : Math.min(Math.floor((qNum - 1) / 2), STAGES.length - 1)
  const progressPct = Math.min((answeredCount / TOTAL_Q) * 100, 100)
  const words = wordCount(answer)
  const textareaRef = useAutoResize(answer)

  const onSubmit = async () => {
    if (!answer.trim() || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await api.submitAnswer(sessionId, answer)
      setAnswer('')
      setAnsweredCount(c => c + 1)
      if (res.interview_completed || !res.question) {
        setIsCompleted(true)
      } else {
        setQuestion(res.question)
        setQNum(res.question_number)
        setQuestionKey(k => k + 1)
      }
    } catch (e) {
      setError(e.message || 'Could not submit answer.')
    } finally {
      setLoading(false)
    }
  }

  const onFinish = () => navigate(`/report/${sessionId}`)
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="iv-shell">
      {/* ── Left panel: stage nav ── */}
      <aside className="iv-sidebar">
        {/* Session info */}
        <div className="iv-session-badge">
          <span className="iv-session-dot" />
          <span className="iv-session-label">Live session</span>
        </div>

        {/* Stage list */}
        <div className="iv-stages">
          <div className="iv-stages-heading">Interview stages</div>
          {STAGES.map((s, i) => {
            const isDone   = i < stageIndex
            const isActive = i === stageIndex
            return (
              <div key={s.label} className={`iv-stage ${isActive ? 'iv-stage--active' : isDone ? 'iv-stage--done' : ''}`}>
                <div className="iv-stage-indicator">
                  {isDone ? <IconChevron /> : <span className="iv-stage-num">{i + 1}</span>}
                </div>
                <div className="iv-stage-info">
                  <div className="iv-stage-name">{s.label}</div>
                  {isActive && <div className="iv-stage-status">In progress</div>}
                  {isDone   && <div className="iv-stage-status iv-stage-status--done">Complete</div>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress */}
        <div className="iv-progress-section">
          <div className="iv-progress-label">
            <span>Progress</span>
            <span className="iv-progress-pct">{Math.round(progressPct)}%</span>
          </div>
          <div className="iv-progress-track">
            <div className="iv-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="iv-progress-sub">{answeredCount} of {TOTAL_Q} questions answered</div>
        </div>

        {/* Finish CTA */}
        <button className="iv-finish-btn" onClick={onFinish} disabled={loading}>
          <IconFlag />
          End &amp; get report
        </button>
      </aside>

      {/* ── Right panel: question + answer ── */}
      <main className="iv-main">
        {isCompleted ? (
          <div className="iv-completed-card" style={{ marginTop: 24 }}>
            <div className="iv-completed-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="iv-completed-title">Interview Completed</h2>
            <p className="iv-completed-desc">
              Excellent work! You have successfully answered all {TOTAL_Q} interview questions. 
              The AI model has completed its evaluations and is ready to generate your report.
            </p>
            <button className="btn btn-primary btn-lg" onClick={onFinish} style={{ marginTop: 12 }}>
              Generate Final Report
              <span className="btn-icon-wrap" style={{ display: 'inline-flex', marginLeft: 8 }}><IconSend /></span>
            </button>
          </div>
        ) : (
          <>
            {/* Top strip */}
            <div className="iv-topstrip">
              <div className="iv-q-number">
                <span className="iv-q-num-label">Q</span>
                <span className="iv-q-num-val">{String(qNum).padStart(2, '0')}</span>
                <span className="iv-q-num-slash">/</span>
                <span className="iv-q-num-total">{TOTAL_Q}</span>
              </div>
              <div className="iv-stage-pill">
                <span className="iv-stage-pill-dot" />
                {STAGES[stageIndex]?.label}
              </div>
            </div>

            {/* Question card */}
            {question && (
              <div className="iv-question-card" key={questionKey}>
                <div className="iv-question-eyebrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Interviewer asks
                </div>
                <p className="iv-question-text">{question}</p>
              </div>
            )}

            {/* Answer area */}
            <div className="iv-answer-wrap">
              <div className="iv-answer-label">Your answer</div>
              <div className={`iv-answer-field ${loading ? 'iv-answer-field--disabled' : ''} ${answer.trim() ? 'iv-answer-field--filled' : ''}`}>
                <textarea
                  ref={textareaRef}
                  className="iv-textarea"
                  placeholder="Start typing your answer here…"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={loading}
                  rows={4}
                />
                <div className="iv-answer-footer">
                  <div className="iv-word-count">
                    <span className={words > 0 ? 'iv-wc-active' : ''}>{words}</span>
                    {' '}word{words !== 1 ? 's' : ''}
                  </div>
                  <div className="iv-answer-shortcut">Ctrl + Enter to submit</div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="iv-error">
                <IconAlert />
                {error}
              </div>
            )}

            {/* Submit button */}
            <div className="iv-actions">
              <button
                className="iv-submit-btn"
                onClick={onSubmit}
                disabled={loading || !answer.trim()}
              >
                {loading ? (
                  <>
                    <span className="iv-spinner" />
                    <span>Evaluating…</span>
                  </>
                ) : (
                  <>
                    <span>Submit answer</span>
                    <IconSend />
                  </>
                )}
              </button>

              {answeredCount > 0 && (
                <div className="iv-q-done-badge">
                  <IconChevron />
                  {answeredCount} answered
                </div>
              )}
            </div>

            {/* Tips strip */}
            <div className="iv-tips">
              <div className="iv-tip">
                <span className="iv-tip-label">TIP</span>
                Be specific — mention actual numbers, tools, and outcomes from your experience.
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
