// Use the Vite proxy locally and the deployed API in production.
const BASE = import.meta.env.VITE_API_URL || '/api'

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  // Returns resume_analysis object directly (no session yet).
  uploadResume: (file) => {
    const form = new FormData()
    form.append('file', file)
    return req('/resume/upload', { method: 'POST', body: form })
  },
  // Creates the session. Returns { session_id, question_number, question }.
  startInterview: (resumeAnalysis) =>
    req('/interview/start', { method: 'POST', body: JSON.stringify({ resume_analysis: resumeAnalysis }) }),
  // Returns { session_id, question_number, question, evaluation }. No "finished" flag —
  // backend always returns a next question, so the frontend decides when to stop.
  submitAnswer: (sessionId, answer) =>
    req('/interview/answer', { method: 'POST', body: JSON.stringify({ session_id: sessionId, answer }) }),
  // Get the final generated report from the backend.
  getReport: (sessionId) => req(`/interview/final/${sessionId}`),
}
