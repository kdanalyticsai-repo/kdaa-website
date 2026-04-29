import { Link } from 'react-router-dom'
import styles from './Features.module.css'

const FEATURES = [
  { icon: '🗂️', title: 'Curated AI Directory',      desc: 'Verified profiles of 5+ AI startups worldwide — updated weekly with funding rounds, team size, and technology stack.', color: 'rgba(0,212,255,0.1)',    detail: 'Our editorial team reviews and validates every company profile. No stale data — we guarantee weekly refresh cycles with primary-source verification.' },
  { icon: '📊', title: 'Real-Time Analytics',         desc: 'Track trends, funding activity, and market movements across AI categories with interactive dashboards.', color: 'rgba(124,58,237,0.1)',  detail: 'Live funding dashboards, trend lines, and category heatmaps updated as deals close. Filter by geography, stage, and technology.' },
  { icon: '🔍', title: 'Advanced Search & Filters',   desc: 'Find startups by country, category, funding stage, team size, technology, or any combination of parameters.', color: 'rgba(16,185,129,0.1)',  detail: 'Boolean search with 40+ filter parameters. Save custom views, export results, and share saved searches with your team.' },
  { icon: '🌐', title: 'Global Coverage',             desc: 'We track AI innovation across 60+ countries — from Silicon Valley to Singapore, London to Lagos.', color: 'rgba(245,158,11,0.1)',  detail: 'Dedicated coverage desks in North America, Europe, MENA, South Asia, and Southeast Asia — with local-language sourcing.' },
  { icon: '🔔', title: 'Smart Alerts',                desc: 'Set custom alerts for funding rounds, new startups in your niche, acquisitions, or IPOs — delivered instantly.', color: 'rgba(239,68,68,0.1)',   detail: 'Configurable via email, Slack, or webhook. Alert on any signal — new seed round in AI healthcare, competitor hires, or patent filings.' },
  { icon: '🤝', title: 'Partnership Network',         desc: 'Connect directly with AI founders, investors, and enterprise buyers through our verified matchmaking engine.', color: 'rgba(236,72,153,0.1)',  detail: 'Warm introductions from our team to vetted founders and investors. Our NPS from matched connections is 92/100.' },
]

export default function FeaturesPage() {
  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.hero}>
        <div className={styles.glow} />
        <p className="section-label">Platform Features</p>
        <h1 className={styles.heroTitle}>Everything you need to<br />navigate the AI landscape</h1>
        <p className={styles.heroSub}>From real-time startup tracking to deep analytics — the definitive intelligence platform for the AI economy.</p>
        <Link to="/contact" className="btn-primary">Get Started →</Link>
      </div>

      <section className={styles.grid}>
        {FEATURES.map((f, i) => (
          <div key={f.title} className={styles.card} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className={styles.icon} style={{ background: f.color }}>{f.icon}</div>
            <h2 className={styles.title}>{f.title}</h2>
            <p className={styles.desc}>{f.desc}</p>
            <p className={styles.detail}>{f.detail}</p>
          </div>
        ))}
      </section>

      <div className={styles.cta}>
        <h2>Ready to explore?</h2>
        <p>Get in touch and we'll walk you through the platform.</p>
        <div className={styles.ctaActions}>
          <Link to="/contact" className="btn-primary">Contact Us</Link>
          <Link to="/services" className="btn-outline">Our Services</Link>
        </div>
      </div>
    </div>
  )
}
