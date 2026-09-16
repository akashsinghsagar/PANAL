import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">◆</span> Panel
        </Link>
        <span className="brand-sub">AI INTERVIEW SYSTEM</span>
      </header>
      <main className="stage">
        <Outlet />
      </main>
    </div>
  )
}
