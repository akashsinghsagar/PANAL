import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

/* Minimal top bar for app pages (Upload → Interview → Report) */
function AppBar() {
  return (
    <header className="nav scrolled" style={{ position: 'fixed' }}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <span className="nav-dot" />
          <span className="nav-name">Panel</span>
        </Link>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--ink-faint)',
          border: '1px solid var(--border)',
          padding: '3px 10px',
          borderRadius: 'var(--r-full)',
        }}>
          AI Interview System
        </span>
      </div>
    </header>
  )
}

/* App shell — used for /app, /interview/:id, /report/:id */
export default function App() {
  return (
    <div className="shell">
      <AppBar />
      <main className="app-stage">
        <Outlet />
      </main>
    </div>
  )
}
