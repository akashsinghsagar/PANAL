import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Upload from './pages/Upload.jsx'
import Interview from './pages/Interview.jsx'
import Report from './pages/Report.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Upload />} />
          <Route path="/interview/:sessionId" element={<Interview />} />
          <Route path="/report/:sessionId" element={<Report />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)