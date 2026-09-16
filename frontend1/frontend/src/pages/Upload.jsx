import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const pick = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }
    setError('')
    setFile(f)
  }

  const onSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const resumeAnalysis = await api.uploadResume(file)
      const started = await api.startInterview(resumeAnalysis)
      navigate(`/interview/${started.session_id}`, {
        state: { question: started.question, questionNumber: started.question_number },
      })
    } catch (e) {
      setError(e.message || 'Upload failed. Check the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <div className="hero-eyebrow">RESUME-DRIVEN INTERVIEW</div>
      <h1 className="hero-title">Upload your CV.<br />Answer what it raises.</h1>
      <p className="hero-sub">
        Every question comes from what's on the page — your experience,
        certifications, and projects. No generic prompts.
      </p>

      <div
        className={`dropzone${dragging ? ' dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          pick(e.dataTransfer.files?.[0])
        }}
      >
        <div className="dropzone-icon">PDF</div>
        <div className="dropzone-label">Drop your resume here, or click to browse</div>
        <div className="dropzone-hint">Single PDF file</div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>

      {file && (
        <div className="file-chip">
          <span>{file.name}</span>
          <button onClick={() => setFile(null)}>remove</button>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      <button className="btn" disabled={!file || loading} onClick={onSubmit}>
        {loading ? 'Reading resume…' : 'Start interview →'}
      </button>
    </div>
  )
}
