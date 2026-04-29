import { Link } from 'react-router-dom'
import styles from './ForBusiness.module.css'

export const BUSINESS_DATA = [
  {
    slug: 'enterprise-strategy',
    icon: '🏢',
    title: 'Enterprise & Strategy',
    tagline: 'AI intelligence for Fortune 500 strategy teams.',
    desc: 'Custom AI market intelligence and executive advisory services designed for enterprise strategy, innovation, and M&A teams navigating the AI-first transformation.',
    highlights: ['AI landscape monitoring', 'Competitive intelligence', 'M&A target identification', 'Executive briefings', 'Board-ready decks'],
    cta: 'Talk to Strategy',
    color: 'rgba(0,212,255,0.1)',
    highlight: false,
  },
  {
    slug: 'investors-funds',
    icon: '💼',
    title: 'Investors & Funds',
    tagline: 'Systematic deal flow and due diligence for AI investments.',
    desc: 'Proprietary sourcing, scoring, and due diligence for VC, CVC, PE, and family offices investing in AI. Reduce blind spots, find better deals, move faster.',
    highlights: ['Curated deal sourcing', 'Portfolio benchmarking', 'Sector deep dives', 'Co-investment opportunities', 'LP reporting support'],
    cta: 'Book a Call',
    color: 'rgba(124,58,237,0.1)',
    highlight: true,
  },
  {
    slug: 'startups-founders',
    icon: '🚀',
    title: 'Startups & Founders',
    tagline: 'Get discovered, funded, and connected.',
    desc: 'Get your AI startup featured on KDA Analytics, reach enterprise buyers and investors, and benchmark your positioning globally.',
    highlights: ['Featured startup profile', 'Investor introductions', 'Enterprise buyer connections', 'Competitive benchmarking', 'Media visibility'],
    cta: 'List Your Startup',
    color: 'rgba(16,185,129,0.1)',
    highlight: false,
  },
  {
    slug: 'api-data-partners',
    icon: '🔌',
    title: 'API & Data Partners',
    tagline: 'Embed live AI startup intelligence into your product.',
    desc: 'Power your VC platform, research tool, or enterprise application with our structured, live AI startup database via REST API, GraphQL, and webhooks.',
    highlights: ['REST & GraphQL APIs', 'Real-time webhooks', 'Data enrichment', 'White-label options', 'SLA uptime guarantees'],
    cta: 'Request API Access',
    color: 'rgba(245,158,11,0.1)',
    highlight: false,
  },
]

export default function ForBusinessPage() {
  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <p className="section-label">For Business</p>
        <h1 className={styles.heroTitle}>Engagements built<br />around your goals</h1>
        <p className={styles.heroSub}>
          Whether you're an enterprise executive, investment professional, AI founder,
          or product team — we have a tailored engagement path built for your outcomes.
        </p>
      </div>

      <section className={styles.grid}>
        {BUSINESS_DATA.map((b, i) => (
          <Link
            key={b.slug}
            to={`/for-business/${b.slug}`}
            className={`${styles.card} ${b.highlight ? styles.highlight : ''}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={styles.iconWrap} style={{ background: b.color }}>{b.icon}</div>
            <h2 className={styles.title}>{b.title}</h2>
            <p className={styles.tagline}>{b.tagline}</p>
            <p className={styles.desc}>{b.desc}</p>
            <ul className={styles.highlights}>
              {b.highlights.map(h => <li key={h}><span>✓</span>{h}</li>)}
            </ul>
            <span className={styles.cta}>{b.cta} →</span>
          </Link>
        ))}
      </section>

      <div className={styles.bottomCta}>
        <h2>Not sure where you fit?</h2>
        <p>Tell us about your challenge — we'll find the right engagement.</p>
        <Link to="/contact" className="btn-primary">Contact Us</Link>
      </div>
    </div>
  )
}
