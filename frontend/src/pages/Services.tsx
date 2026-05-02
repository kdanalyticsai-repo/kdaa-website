import { Link } from 'react-router-dom'
import styles from './Services.module.css'

export const SERVICES_DATA = [
  {
    slug: 'ai-strategy-consulting',
    num: '01',
    icon: '🧠',
    title: 'AI Strategy & Adoption Consulting',
    tagline: 'From AI curiosity to measurable ROI.',
    desc: 'Advisory services helping enterprises identify the right AI use cases, build business cases, and execute adoption roadmaps with clear ROI frameworks. We translate AI potential into concrete business outcomes — across autonomous agents, GenAI, and predictive intelligence.',
    bullets: [
      'AI readiness assessment & use-case prioritisation',
      'Build vs buy vs partner analysis',
      'ROI frameworks & KPI design',
      'Change management and workforce enablement',
      'Vendor and technology selection guidance',
    ],
    color: 'rgba(0,212,255,0.1)',
  },
  {
    slug: 'ai-implementation',
    num: '02',
    icon: '⚙️',
    title: 'AI Implementation & Integration',
    tagline: 'End-to-end delivery of enterprise AI solutions.',
    desc: 'Hands-on implementation of AI products across our top 10 use cases — autonomous agents, knowledge copilots, fraud detection, document processing, and more. We integrate seamlessly with your existing enterprise systems and ensure production-ready deployment.',
    bullets: [
      'Custom AI solution development & deployment',
      'Enterprise system integration (ERP, CRM, core banking)',
      'Model fine-tuning and domain adaptation',
      'MLOps setup, monitoring, and ongoing optimisation',
      'Security, compliance, and governance frameworks',
    ],
    color: 'rgba(124,58,237,0.1)',
  },
  {
    slug: 'market-research',
    num: '03',
    icon: '📊',
    title: 'AI Market Research & Intelligence',
    tagline: 'Deep-dive research, expertly delivered.',
    desc: 'Comprehensive research reports on any AI vertical, geography, or technology segment. Delivered by our team of domain experts with competitive landscape analysis, market sizing, use-case benchmarking, and actionable strategic insights.',
    bullets: [
      'Custom AI research & intelligence reports',
      'Market sizing, TAM, and opportunity analysis',
      'Competitive landscape and vendor benchmarking',
      'Use-case feasibility and ROI research',
      'Primary research & expert interviews',
    ],
    color: 'rgba(16,185,129,0.1)',
  },
  {
    slug: 'api-data-licensing',
    num: '04',
    icon: '⚡',
    title: 'Data Infrastructure & API Solutions',
    tagline: 'The data foundation your AI products need.',
    desc: 'Enterprise-grade data pipelines, APIs, and domain-specific datasets to fuel your AI applications. We deliver clean, structured, and reliable data infrastructure so your models, agents, and products perform at their best — at scale.',
    bullets: [
      'REST & GraphQL APIs with SLA guarantees',
      'Domain-specific dataset curation and enrichment',
      'Real-time data pipelines, streaming & webhooks',
      'Bulk data exports (JSON/CSV/Parquet)',
      'Data governance, lineage, and compliance controls',
    ],
    color: 'rgba(245,158,11,0.1)',
  },
]

export default function ServicesPage() {
  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <p className="section-label">Our Services</p>
        <h1 className={styles.heroTitle}>End-to-end AI adoption services<br />for the global enterprise</h1>
        <p className={styles.heroSub}>
          From strategy and research to hands-on implementation and data infrastructure —
          we help enterprises across the globe adopt AI capabilities that drive real business outcomes.
        </p>
      </div>

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

      <section className={styles.ctaBanner}>
        <h2>Not sure where to start?</h2>
        <p>Tell us about your AI goals and we'll recommend the right engagement — from a quick discovery session to a full-scale implementation.</p>
        <Link to="/contact" className="btn-primary">Talk to Our Team</Link>
      </section>
    </div>
  )
}
