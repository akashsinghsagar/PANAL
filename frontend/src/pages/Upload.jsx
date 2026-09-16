import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

const IconUpload = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

export default function Upload() {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const pick = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf') { setError('Please upload a PDF file.'); return }
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
      setError(e.message || 'Upload failed. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-panel">
      <div className="page-eyebrow">
        <span className="page-eyebrow-line" />
        Resume-driven interview
      </div>

      <h1 className="page-h1">
        Upload your CV.<br />
        Answer <em>what it raises.</em>
      </h1>
      <p className="page-sub">
        Every question is drawn from your experience, certifications, and
        projects — nothing generic, nothing guessed.
      </p>

      {/* Dropzone */}
      <div
        className={`dropzone${dragging ? ' dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]) }}
      >
        <div className="dropzone-icon-wrap">
          <IconUpload />
        </div>
        <div className="dropzone-label">
          {dragging ? 'Release to upload' : 'Drop your resume here, or click to browse'}
        </div>
        <div className="dropzone-hint">PDF · Single file · Parsed instantly</div>
        <input ref={inputRef} type="file" accept="application/pdf" onChange={(e) => pick(e.target.files?.[0])} />
      </div>

      {/* File chip */}
      {file && (
        <div className="file-chip">
          <div className="file-chip-info">
            <div className="file-chip-badge">PDF</div>
            <span className="file-chip-name">{file.name}</span>
          </div>
          <button className="file-chip-remove" onClick={() => setFile(null)}>remove</button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-msg">
          <IconAlert />
          {error}
        </div>
      )}

      {/* Submit */}
      <button className="btn btn-primary" style={{ marginTop: 28 }} disabled={!file || loading} onClick={onSubmit}>
        {loading ? (
          <>
            <span className="spinner-ring" style={{ width: 14, height: 14, borderWidth: '1.5px' }} />
            Reading resume…
          </>
        ) : (
          <>
            Start interview
            <span className="btn-icon-wrap"><IconArrow /></span>
          </>
        )}
      </button>
    </div>
  )
}
