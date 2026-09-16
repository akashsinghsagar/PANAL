import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

/* ================================================================
   SVG Icons
   ================================================================ */
const IconBrain = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
)
const IconFile = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const IconTarget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
)
const IconBarChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

/* ================================================================
   Hooks
   ================================================================ */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ================================================================
   Typing animation
   ================================================================ */
function TypingText({ words }) {
  const elRef = useRef(null)
  useEffect(() => {
    let wi = 0, ci = 0, deleting = false, timer
    const tick = () => {
      const word = words[wi]
      if (!elRef.current) return
      if (!deleting) {
        elRef.current.textContent = word.slice(0, ci + 1)
        ci++
        if (ci === word.length) { deleting = true; timer = setTimeout(tick, 1800); return }
      } else {
        elRef.current.textContent = word.slice(0, ci - 1)
        ci--
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; timer = setTimeout(tick, 300); return }
      }
      timer = setTimeout(tick, deleting ? 42 : 68)
    }
    timer = setTimeout(tick, 500)
    return () => clearTimeout(timer)
  }, [words])
  return <span ref={elRef} />
}

/* ================================================================
   Nav
   ================================================================ */
function Nav() {
  const navRef = useRef(null)
  useEffect(() => {
    const onScroll = () => navRef.current?.classList.toggle('scrolled', window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <nav ref={navRef} className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <span className="nav-dot" />
          <span className="nav-name">Panel</span>
        </Link>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How it works</a>
          <a href="#testimonials" className="nav-link">Reviews</a>
        </div>
        <Link to="/app" className="nav-cta">
          Start interview
          <span style={{ opacity: 0.7, display: 'flex' }}><IconArrow /></span>
        </Link>
      </div>
    </nav>
  )
}

/* ================================================================
   Browser Mockup
   ================================================================ */
function MockupPreview() {
  return (
    <div className="hero-mockup">
      <div className="mockup-shell">
        <div className="mockup-topbar">
          <div className="mockup-dot" />
          <div className="mockup-dot" />
          <div className="mockup-dot" />
          <div className="mockup-url">panel.ai · interview · session_4f2a9c</div>
        </div>
        <div className="mockup-body">
          <div className="mockup-question">
            <div className="mockup-q-label">Interviewer · Question 03 of 10</div>
            <div className="mockup-q-text">
              You listed "built a real-time data pipeline using Kafka" — walk me through the architecture and the biggest bottleneck you encountered.
            </div>
          </div>
          <div className="mockup-answer">
            The pipeline ingested ~50k events/sec from IoT sensors. We partitioned by device ID to preserve ordering…
            <span className="typing-cursor" />
          </div>
          <div className="mockup-footer">
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 14px', borderRadius: 8, border: '1px solid #D8D3C9',
              fontSize: 12, color: '#7E7669', cursor: 'default',
            }}>
              Finish
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#18160F', color: '#F9F7F4',
              padding: '9px 16px', borderRadius: 8, fontSize: 12, cursor: 'default',
            }}>
              Submit <IconArrow />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   Features
   ================================================================ */
const FEATURES = [
  { icon: <IconFile />,     title: 'Resume-aware questions', desc: 'Every question is generated directly from your CV — your projects, certifications, and experience. No templates, no filler.' },
  { icon: <IconBrain />,    title: 'LLM-powered evaluation', desc: 'Answers are evaluated in real time by a large language model that understands nuance, depth, and technical accuracy.' },
  { icon: <IconTarget />,   title: 'Structured stages',      desc: 'The interview flows through deliberate stages — experience, certifications, projects, wrap-up — mirroring real panels.' },
  { icon: <IconBarChart />, title: 'Detailed report',        desc: 'Receive a scored report with strengths, skill gaps, a recommendation, and specific areas to develop before your real interview.' },
  { icon: <IconShield />,   title: 'Nothing stored',         desc: 'Sessions are ephemeral. Your resume is parsed once and discarded. No account, no data retention, no tracking.' },
  { icon: <IconZap />,      title: 'Instant start',          desc: 'Upload a PDF and you are in the hot seat in under 30 seconds. No signup, no waiting, no onboarding flow.' },
]

function Features() {
  const headerRef = useReveal()
  const gridRef = useReveal()
  return (
    <section id="features" className="section features-bg">
      <div className="section-inner">
        <div className="reveal" ref={headerRef}>
          <div className="section-label">Features</div>
          <h2 className="section-h2">Built for the <em>serious</em> candidate</h2>
          <p className="section-sub">Every detail is designed to give you a realistic, focused preparation — not a quiz app.</p>
        </div>
        <div className="features-grid reveal" ref={gridRef}>
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-h3">{f.title}</h3>
              <p className="feature-p">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================================================================
   Step card (extracted to avoid hook-in-map)
   ================================================================ */
function StepCard({ n, title, desc, delay }) {
  const ref = useReveal()
  return (
    <div className={`step-card reveal reveal-delay-${delay}`} ref={ref}>
      <div className="step-num">{n}</div>
      <h3 className="step-h3">{title}</h3>
      <p className="step-p">{desc}</p>
    </div>
  )
}

function HowItWorks() {
  const headerRef = useReveal()
  return (
    <section id="how-it-works" className="section">
      <div className="section-inner">
        <div className="reveal" ref={headerRef}>
          <div className="section-label">Process</div>
          <h2 className="section-h2">Three steps.<br /><em>Real results.</em></h2>
          <p className="section-sub">From upload to report in under 15 minutes.</p>
        </div>
        <div className="steps-grid">
          <StepCard n="1" delay={1} title="Upload your resume" desc="Drop your PDF. The AI parses every section — projects, skills, experience, and certifications." />
          <StepCard n="2" delay={2} title="Face your questions" desc="Answer a structured set of questions derived entirely from your own resume. No generics." />
          <StepCard n="3" delay={3} title="Get your report"    desc="Receive an overall score, strength analysis, skill gaps, and a hiring recommendation." />
        </div>
      </div>
    </section>
  )
}

/* ================================================================
   Stats bar
   ================================================================ */
const STATS = [
  { n: '< 30', unit: 's',  label: 'to first question'  },
  { n: '10',   unit: '+',  label: 'targeted questions'  },
  { n: '100',  unit: '%',  label: 'resume-derived'      },
  { n: '0',    unit: '',   label: 'accounts required'   },
]
function Stats() {
  return (
    <section className="stats-section">
      <div className="stats-grid" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {STATS.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-num">{s.n}<em>{s.unit}</em></div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ================================================================
   Testimonials
   ================================================================ */
const TESTIMONIALS = [
  { quote: "I uploaded my resume and got questions I didn't expect — all pulled from a project I'd half-forgotten. Exactly what I needed before a tough panel.", name: 'Priya S.',  role: 'ML Engineer'      },
  { quote: "The report was ruthless in the best way. It flagged a gap in my systems design answers that I then spent two weeks fixing. Got the offer.",          name: 'James L.', role: 'Backend Engineer' },
  { quote: "Every other mock interview tool asks generic questions. Panel actually read my CV. The difference is night and day.",                                 name: 'Fatima K.',role: 'Data Scientist'    },
]

function TestimonialCard({ quote, name, role, delay }) {
  const ref = useReveal()
  return (
    <div className={`testimonial-card reveal reveal-delay-${delay}`} ref={ref}>
      <p className="testimonial-quote">"{quote}"</p>
      <div className="testimonial-author">
        <div className="testimonial-avatar">{name[0]}</div>
        <div>
          <div className="testimonial-name">{name}</div>
          <div className="testimonial-role">{role}</div>
        </div>
      </div>
    </div>
  )
}

function Testimonials() {
  const headerRef = useReveal()
  return (
    <section id="testimonials" className="section features-bg">
      <div className="section-inner">
        <div className="reveal" ref={headerRef}>
          <div className="section-label">Reviews</div>
          <h2 className="section-h2">What candidates say</h2>
          <p className="section-sub">Real feedback from engineers who used Panel before their interviews.</p>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} delay={i + 1} {...t} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================================================================
   CTA section
   ================================================================ */
function CTA() {
  const ref = useReveal()
  return (
    <section className="cta-section">
      <div className="cta-inner reveal" ref={ref}>
        <h2 className="cta-h2">Ready to face<br /><em>your own resume?</em></h2>
        <p className="cta-sub">Upload your CV and start your interview in under 30 seconds. No account required.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/app" className="btn btn-white btn-lg">
            Start interview now
            <span className="btn-icon-wrap" style={{ display: 'flex' }}><IconArrow /></span>
          </Link>
          <a href="#how-it-works" className="btn btn-white-outline btn-lg">
            See how it works
          </a>
        </div>
      </div>
    </section>
  )
}

/* ================================================================
   Footer
   ================================================================ */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-dot" />
          <span className="footer-name">Panel</span>
        </div>
        <span className="footer-copy">© 2025 Panel · AI Interview System · No data retained</span>
      </div>
    </footer>
  )
}

/* ================================================================
   Landing Page
   ================================================================ */
export default function Landing() {
  return (
    <div className="landing">
      <Nav />

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AI-powered · Resume-driven · No account needed
          </div>
          <h1 className="hero-h1">
            The interview that<br />
            knows your{' '}
            <em>
              <TypingText words={['resume.', 'projects.', 'stack.', 'gaps.']} />
            </em>
          </h1>
          <p className="hero-sub">
            Panel reads your CV and builds a real technical interview around it.
            Every question comes from your experience — nothing generic, nothing random.
          </p>
          <div className="hero-actions">
            <Link to="/app" className="btn btn-primary btn-lg">
              Upload your resume
              <span className="btn-icon-wrap" style={{ display: 'flex' }}><IconArrow /></span>
            </Link>
            <a href="#how-it-works" className="btn btn-outline btn-lg">
              How it works
            </a>
          </div>
        </div>
        <MockupPreview />
      </section>

      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}
