import { Link } from 'react-router-dom'
import styles from './Services.module.css'

export const SERVICES_DATA = [
  {
    slug: 'market-research',
    num: '01',
    icon: '📊',
    title: 'AI Market Research & Intelligence Reports',
    tagline: 'Deep-dive research, expertly delivered.',
    desc: 'Comprehensive research reports on any AI vertical, geography, or technology segment. Delivered by our team of domain experts with primary interviews, funding data, and competitive landscape analysis.',
    bullets: ['Custom research & reports', 'Market sizing & TAM analysis', 'Competitive landscape mapping', 'Investment thesis development', 'Primary research interviews'],
    color: 'rgba(0,212,255,0.1)',
  },
  {
    slug: 'startup-scouting',
    num: '02',
    icon: '🔭',
    title: 'Startup Scouting & Due Diligence',
    tagline: 'Find your next deal before your competition.',
    desc: 'We identify high-potential AI startups matching your investment thesis or partnership criteria, then deliver comprehensive due diligence packages with financial, technical, and team assessment.',
    bullets: ['Curated deal flow pipelines', 'Proprietary scoring models', 'Risk assessment frameworks', 'Founder background checks', 'Technology stack analysis'],
    color: 'rgba(124,58,237,0.1)',
  },
  {
    slug: 'ai-strategy-consulting',
    num: '03',
    icon: '🧠',
    title: 'AI Strategy Consulting',
    tagline: 'From AI curiosity to measurable ROI.',
    desc: 'Advisory services helping enterprises define, execute, and measure AI adoption roadmaps with measurable ROI frameworks. We translate AI potential into business outcomes.',
    bullets: ['AI readiness assessments', 'Use-case identification & prioritisation', 'Build vs buy vs partner analysis', 'ROI frameworks & KPI design', 'Change management playbooks'],
    color: 'rgba(16,185,129,0.1)',
  },
  {
    slug: 'api-data-licensing',
    num: '04',
    icon: '⚡',
    title: 'API & Data Licensing',
    tagline: 'Power your product with clean, structured AI data.',
    desc: 'Access our structured AI startup database programmatically. REST API, GraphQL, and webhooks — power your own VC platform, research tool, or enterprise intelligence application.',
    bullets: ['REST & GraphQL APIs', 'Real-time webhook streams', 'Bulk data exports (JSON/CSV)', 'Custom data enrichment', 'SLA-backed uptime guarantees'],
    color: 'rgba(245,158,11,0.1)',
  },
]

export default function ServicesPage() {
  return (
    <div className={`${styles.page} page-enter`}>
      {/* Header */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <p className="section-label">Our Services</p>
        <h1 className={styles.heroTitle}>Intelligence-driven services<br />for the AI economy</h1>
        <p className={styles.heroSub}>End-to-end analytical and consulting services to help enterprises, investors, and startups succeed in the AI-first world.</p>
      </div>

      {/* Service tiles */}
      <section className={styles.grid}>
        {SERVICES_DATA.map((s, i) => (
          <Link key={s.slug} to={`/services/${s.slug}`} className={styles.card} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className={styles.cardInner}>
              <div className={styles.icon} style={{ background: s.color }}>{s.icon}</div>
              <div className={styles.num}>{s.num}</div>
              <h2 className={styles.title}>{s.title}</h2>
              <p className={styles.tagline}>{s.tagline}</p>
              <p className={styles.desc}>{s.desc}</p>
              <div className={styles.pills}>
                {s.bullets.slice(0, 3).map(b => <span key={b} className={styles.pill}>{b}</span>)}
              </div>
              <span className={styles.cta}>Learn more →</span>
            </div>
          </Link>
        ))}
      </section>

      {/* CTA */}
      <section className={styles.ctaBanner}>
        <h2>Not sure which service fits?</h2>
        <p>Tell us about your goals and we'll recommend the right engagement.</p>
        <Link to="/contact" className="btn-primary">Talk to Our Team</Link>
      </section>
    </div>
  )
}
