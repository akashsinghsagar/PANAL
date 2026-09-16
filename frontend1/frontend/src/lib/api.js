const BASE = 'http://127.0.0.1:8000'

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: options.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }

  return res.json()
}

export const api = {
  uploadResume: (file) => {
    const form = new FormData()
    form.append('file', file)

    return req('/resume/upload', {
      method: 'POST',
      body: form,
    })
  },

  startInterview: (resumeAnalysis) =>
    req('/interview/start', {
      method: 'POST',
      body: JSON.stringify({
        resume_analysis: resumeAnalysis,
      }),
    }),

  submitAnswer: (sessionId, answer) =>
    req('/interview/answer', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        answer,
      }),
    }),

  // CORRECT BACKEND ROUTE
  getReport: (sessionId) =>
    req(`/interview/final/${sessionId}`),
}