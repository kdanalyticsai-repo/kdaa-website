import { Link } from 'react-router-dom'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './Home.module.css'

// ── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: '🗂️', title: 'Curated AI Directory',       desc: 'Verified profiles of 5+ AI startups worldwide — updated weekly with funding rounds, team size, and technology stack.', color: 'rgba(0,212,255,0.1)' },
  { icon: '📊', title: 'Real-Time Analytics',          desc: 'Track trends, funding activity, and market movements across AI categories with interactive dashboards.', color: 'rgba(124,58,237,0.1)' },
  { icon: '🔍', title: 'Advanced Search & Filters',    desc: 'Find startups by country, category, funding stage, team size, technology, or any combination of parameters.', color: 'rgba(16,185,129,0.1)' },
  { icon: '🌐', title: 'Global Coverage',              desc: 'We track AI innovation across 60+ countries — from Silicon Valley to Singapore, London to Lagos.', color: 'rgba(245,158,11,0.1)' },
  { icon: '🔔', title: 'Smart Alerts',                 desc: 'Set custom alerts for funding rounds, new startups in your niche, acquisitions, or IPOs — delivered instantly.', color: 'rgba(239,68,68,0.1)' },
  { icon: '🤝', title: 'Partnership Network',          desc: 'Connect directly with AI founders, investors, and enterprise buyers through our verified matchmaking engine.', color: 'rgba(236,72,153,0.1)' },
]

const SERVICES = [
  { num: '01', slug: 'market-research',         title: 'AI Market Research & Intelligence Reports', desc: 'Deep-dive reports on any AI vertical, geography, or technology segment — delivered by domain experts.' },
  { num: '02', slug: 'startup-scouting',        title: 'Startup Scouting & Due Diligence',          desc: 'Identify high-potential AI startups matching your investment thesis or partnership criteria.' },
  { num: '03', slug: 'ai-strategy-consulting',  title: 'AI Strategy Consulting',                    desc: 'Advisory services helping enterprises define, execute, and measure their AI adoption roadmaps.' },
  { num: '04', slug: 'api-data-licensing',      title: 'API & Data Licensing',                      desc: 'Access our structured AI startup database programmatically. Power your own product with live, clean data.' },
]

const BUSINESS_TILES = [
  { slug: 'enterprise-strategy', title: 'Enterprise & Strategy',   desc: 'Custom AI market intelligence and executive advisory for Fortune 500 strategy teams.',             cta: 'Talk to Strategy →', highlight: false },
  { slug: 'investors-funds',     title: 'Investors & Funds',        desc: 'Sourcing, scoring, and due diligence for VC, CVC, PE, and family offices in AI.',                 cta: 'Book a Call →',      highlight: true  },
  { slug: 'startups-founders',   title: 'Startups & Founders',      desc: 'Get featured on KDA, reach investors and enterprise buyers, benchmark globally.',                 cta: 'List Your Startup →',highlight: false },
  { slug: 'api-data-partners',   title: 'API & Data Partners',      desc: 'Embed our structured AI startup database — REST, GraphQL, webhooks.',                            cta: 'Request Access →',   highlight: false },
]

const MARQUEE_ITEMS = [
  '🤖 Generative AI','👁️ Computer Vision','💬 Natural Language Processing','🧠 Machine Learning',
  '🤖 Robotics & Automation','🔍 AI-Powered Search','💊 AI in Healthcare','💰 FinTech AI','🌍 Climate AI','🎨 Creative AI',
]

const STEPS = [
  { n: '01', title: 'Discover',  text: 'Search and filter 5+ AI startups across industries, geographies, and funding stages.' },
  { n: '02', title: 'Analyze',   text: 'Dive deep into profiles, funding history, tech stacks, team backgrounds, and market positioning.' },
  { n: '03', title: 'Connect',   text: 'Reach out directly to founders, request introductions, or engage our advisory team.' },
  { n: '04', title: 'Decide',    text: 'Make confident, data-backed decisions with our reports, benchmarks, and real-time signals.' },
]

// ── Sections ────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGrid} />
      <div className={styles.heroGlow} />
      <div className={styles.heroBadge}>🚀 Powering the Global AI Intelligence Economy</div>
      <h1 className={styles.heroTitle}>
        Where Data<br />
        <span className="grad">Meets Intelligence</span>
      </h1>
      <p className={styles.heroSub}>
        KDA Analytics is your gateway to the global AI ecosystem — curating, tracking, and
        connecting you with the most innovative AI startups transforming every industry.
      </p>
      <div className={styles.heroActions}>
        <Link to="/services" className="btn-primary">Explore Our Services</Link>
        <Link to="/features" className="btn-outline">See Features</Link>
      </div>
      <div className={styles.heroStats}>
        {[
          ['5+',   'AI Companies Tracked'],
          ['2+',   'Countries Covered'],
          ['18',   'AI Categories'],
          ['$1.1K','Market Cap Tracked'],
        ].map(([n, l]) => (
          <div key={l} className={styles.stat}>
            <div className={styles.statNum}>{n}</div>
            <div className={styles.statLabel}>{l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className={styles.marqueeWrap}>
      <div className={styles.marqueeTrack}>
        {items.map((item, i) => (
          <span key={i} className={styles.marqueeItem}>{item}</span>
        ))}
      </div>
    </div>
  )
}

function FeaturesSection() {
  const ref = useScrollReveal()
  return (
    <section id="features" className={styles.featuresSection}>
      <div ref={ref} className="reveal">
        <p className="section-label">Why KDA Analytics</p>
        <h2 className="section-title">Everything you need to<br />navigate the AI landscape</h2>
        <p className="section-sub">From real-time startup tracking to deep analytics — the definitive intelligence platform for the AI economy.</p>
      </div>
      <div className={styles.featGrid}>
        {FEATURES.map(f => (
          <Link key={f.title} to="/features" className={styles.featCard}>
            <div className={styles.featIcon} style={{ background: f.color }}>{f.icon}</div>
            <div className={styles.featTitle}>{f.title}</div>
            <div className={styles.featDesc}>{f.desc}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function ServicesSection() {
  const ref = useScrollReveal()
  return (
    <section id="services" className={styles.servicesSection}>
      <div ref={ref} className="reveal">
        <p className="section-label">Our Services</p>
        <h2 className="section-title">Intelligence-driven services<br />for the AI economy</h2>
        <p className="section-sub">End-to-end analytical and consulting services to help enterprises, investors, and startups succeed.</p>
      </div>
      <div className={styles.servicesGrid}>
        {SERVICES.map(s => (
          <Link key={s.slug} to={`/services/${s.slug}`} className={`${styles.serviceCard} ${s.num === '01' ? styles.featured : ''}`}>
            <div className={styles.serviceNum}>{s.num}</div>
            <div className={styles.serviceTitle}>{s.title}</div>
            <div className={styles.serviceDesc}>{s.desc}</div>
            <span className={styles.serviceArrow}>Learn more →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function ProcessSection() {
  const ref = useScrollReveal()
  return (
    <section className={styles.processSection}>
      <div ref={ref} className={`reveal ${styles.processHeader}`}>
        <p className="section-label" style={{ textAlign: 'center' }}>How It Works</p>
        <h2 className="section-title" style={{ textAlign: 'center' }}>From data to decisions in 4 steps</h2>
      </div>
      <div className={styles.processSteps}>
        {STEPS.map(s => (
          <div key={s.n} className={styles.step}>
            <div className={styles.stepNum}>{s.n}</div>
            <h4>{s.title}</h4>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function BusinessSection() {
  const ref = useScrollReveal()
  return (
    <section id="business" className={styles.businessSection}>
      <div ref={ref} className="reveal">
        <p className="section-label">For Business</p>
        <h2 className="section-title">Engagements built around your goals</h2>
        <p className="section-sub">Whether you're an enterprise, investor, founder, or data partner — we have a tailored engagement path for you.</p>
      </div>
      <div className={styles.businessGrid}>
        {BUSINESS_TILES.map(b => (
          <Link key={b.slug} to={`/for-business/${b.slug}`}
            className={`${styles.bizCard} ${b.highlight ? styles.bizHighlight : ''}`}>
            <h3>{b.title}</h3>
            <p>{b.desc}</p>
            <span className={styles.bizArrow}>{b.cta}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaInner}>
        <p className="section-label">Ready to start?</p>
        <h2 className={styles.ctaTitle}>Let's build something intelligent</h2>
        <p className={styles.ctaSub}>Join enterprises, investors, and AI founders who trust KDA Analytics for market intelligence.</p>
        <div className={styles.ctaActions}>
          <Link to="/contact" className="btn-primary">Get in Touch</Link>
          <Link to="/services" className="btn-outline">View Services</Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="page-enter">
      <HeroSection />
      <Marquee />
      <FeaturesSection />
      <ServicesSection />
      <ProcessSection />
      <BusinessSection />
      <CtaSection />
    </div>
  )
}
