import { Link } from 'react-router-dom'
import styles from './About.module.css'

const VALUES = [
  {
    icon: '🎯',
    title: 'Impact First',
    desc: 'Every AI use case we build or advise on is chosen for its measurable business impact — not novelty. We focus on the problems that move the needle.',
  },
  {
    icon: '🌍',
    title: 'Global Reach',
    desc: 'We serve enterprises across the globe, bringing world-class AI capabilities to organisations regardless of geography or scale.',
  },
  {
    icon: '🏗️',
    title: 'Production-Grade Quality',
    desc: 'We build to enterprise standards — secure, scalable, compliant, and designed to last. No proof-of-concepts left on the shelf.',
  },
  {
    icon: '⚡',
    title: 'Speed to Value',
    desc: 'We operate with startup velocity. Most clients see working AI pilots within a couple of weeks, with full production deployments in few months.',
  },
  {
    icon: '🤝',
    title: 'Long-Term Partnership',
    desc: 'We are a fast growing startup believing in a long-term AI adoption partnership and growing with you as your ambitions scale.',
  },
  {
    icon: '🔍',
    title: 'Radical Transparency',
    desc: 'We tell you exactly what is working, what is not, and why. Honest guidance over comfortable answers, always.',
  },
]

const STATS = [
  { num: '5+',   label: 'Enterprise AI Use Cases' },
  { num: '2wk',  label: 'Time to First POC' },
  { num: '5+',   label: 'Industries Served' },
  { num: '100%', label: 'Client-Focused Delivery' },
]

export default function AboutPage() {
  return (
    <div className={`${styles.page} page-enter`}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <p className="section-label">About KDA Analytics</p>
        <h1 className={styles.heroTitle}>
          We help the world's enterprises<br />adopt AI — and win with it
        </h1>
        <p className={styles.heroSub}>
          KDA Analytics is a fast-growing AI adoption company headquartered in Delhi NCR, India.
          We partner with enterprises across the globe to identify, build, and deploy the AI
          capabilities that drive real business outcomes — at speed and at scale.
        </p>
      </div>

      {/* Mission */}
      <section className={styles.missionSection}>
        <div className={styles.missionInner}>
          <div className={styles.missionText}>
            <p className="section-label">Our Mission</p>
            <h2 className={styles.missionTitle}>
              Making enterprise AI adoption faster, smarter, and more impactful
            </h2>
            <p className={styles.missionBody}>
              The world is moving to AI — but most enterprises struggle to bridge the gap
              between AI potential and real business value. They face unclear use-case
              priorities, fragmented vendors, slow implementations, and no measurable ROI.
            </p>
            <p className={styles.missionBody}>
              KDA Analytics exists to solve exactly this. We bring together strategy,
              deep domain expertise, and hands-on engineering to help enterprises adopt
              the right AI use cases — autonomous agents, knowledge copilots, fraud
              intelligence, document processing, and more — and turn them into production-grade
              solutions that deliver results from day one.
            </p>
          </div>
          <div className={styles.statsGrid}>
            {STATS.map(s => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className={styles.valuesSectionInner}>
          <p className="section-label">What We Stand For</p>
          <h2 className="section-title">Our values shape<br />how we work with you</h2>
          <div className={styles.valuesGrid}>
            {VALUES.map(v => (
              <div key={v.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className={styles.whatSection}>
        <div className={styles.whatInner}>
          <div className={styles.whatText}>
            <p className="section-label">What We Do</p>
            <h2 className={styles.whatTitle}>Strategy to deployment — end to end</h2>
            <p className={styles.whatBody}>
              We cover the full AI adoption lifecycle. Our four service lines work in concert:
              we research the landscape, define your strategy, implement the solutions, and
              build the data infrastructure that powers them — all under one roof.
            </p>
            <p className={styles.whatBody}>
              Our product portfolio spans the top globally adopted enterprise AI use cases —
              from autonomous business agents and RAG-powered knowledge copilots to real-time
              fraud detection and intelligent document processing. Whether you need a custom
              build, a guided implementation, or a readiness assessment, we have a path for you.
            </p>
            <div className={styles.whatActions}>
              <Link to="/services" className="btn-primary">Explore Our Services</Link>
              <Link to="/products" className="btn-outline">View Our Products</Link>
            </div>
          </div>
          <div className={styles.whatCards}>
            {[
              { icon: '🧠', label: 'AI Strategy & Adoption Consulting' },
              { icon: '⚙️', label: 'AI Implementation & Integration' },
              { icon: '📊', label: 'AI Market Research & Intelligence' },
              { icon: '⚡', label: 'Data Infrastructure & API Solutions' },
            ].map(c => (
              <div key={c.label} className={styles.whatCard}>
                <span className={styles.whatCardIcon}>{c.icon}</span>
                <span className={styles.whatCardLabel}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaBanner}>
        <h2>Ready to start your AI journey?</h2>
        <p>
          Whether you are exploring AI for the first time or scaling an existing initiative,
          we would love to hear about your goals.
        </p>
        <Link to="/contact" className="btn-primary">Get in Touch</Link>
      </section>

    </div>
  )
}
