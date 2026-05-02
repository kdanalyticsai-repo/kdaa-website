import { Link } from 'react-router-dom'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './Home.module.css'

const SERVICES = [
  { num: '01', slug: 'ai-strategy-consulting', title: 'AI Strategy & Adoption Consulting',  desc: 'Identify the right AI use cases, build business cases, and execute adoption roadmaps with clear ROI frameworks — from autonomous agents to GenAI.' },
  { num: '02', slug: 'ai-implementation',      title: 'AI Implementation & Integration',    desc: 'Hands-on delivery of enterprise AI solutions across our top 10 use cases — seamlessly integrated with your existing systems and production-ready from day one.' },
  { num: '03', slug: 'market-research',        title: 'AI Market Research & Intelligence',  desc: 'Comprehensive research on any AI vertical — competitive landscapes, market sizing, use-case benchmarking, and actionable strategic insights.' },
  { num: '04', slug: 'api-data-licensing',     title: 'Data Infrastructure & API Solutions', desc: 'Enterprise-grade data pipelines, APIs, and domain datasets fueling your AI applications — clean, reliable, and built to scale.' },
]

const PRODUCTS = [
  { icon: '🤖', tag: 'Enterprise · Operations',       title: 'Autonomous AI Agents Platform',    desc: 'Goal-driven AI agents that execute multi-step business workflows end-to-end, reducing manual effort by 40–70%.' },
  { icon: '🧠', tag: 'Enterprise · Knowledge',        title: 'Enterprise Knowledge Copilot',     desc: 'RAG-powered assistant that answers questions from internal documents, policies, and data lakes instantly.' },
  { icon: '🛡️', tag: 'FinTech · Banking',             title: 'Fraud Detection & Risk Intelligence', desc: 'Real-time ML engine detecting fraudulent transactions, anomalies, and AML patterns across financial data streams.' },
  { icon: '🧾', tag: 'BFSI · Legal',                  title: 'Intelligent Document Processing',  desc: 'AI extracts, classifies, and validates data from invoices, contracts, and regulatory filings at enterprise scale.' },
  { icon: '📊', tag: 'Data · Analytics',              title: 'Data Product Builder',             desc: 'Autonomous agents that build end-to-end data pipelines, generate insights, and create BI dashboards automatically.' },
  { icon: '🚀', tag: 'HRTech · Career',               title: 'RoleScout AI',                     desc: 'Proactive AI job agent that autonomously discovers, matches, and applies to relevant opportunities on your behalf.' },
]

const WHY_US = [
  { icon: '🌍', title: 'Global AI Adoption Partner',  desc: 'We help enterprises across the globe adopt AI — from identifying the right use cases to deploying production-grade solutions with measurable business outcomes.' },
  { icon: '⚡',  title: 'Speed to Value',              desc: 'Agile delivery with rapid prototyping and iterative releases — most clients see working AI pilots within weeks, not months.' },
  { icon: '🎯',  title: 'Use-Case Depth',             desc: 'Deep expertise across the top 10 enterprise AI use cases: autonomous agents, fraud detection, knowledge copilots, IDP, and more.' },
]

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGrid} />
      <div className={styles.heroGlow} />
      <div className={styles.heroBadge}>⚡ AI Adoption Partner for the Global Enterprise</div>
      <h1 className={styles.heroTitle}>
        Accelerating AI<br />
        <span className="grad">Adoption Worldwide</span>
      </h1>
      <p className={styles.heroSub}>
        KDA Analytics helps enterprises across the globe adopt AI — from autonomous agents
        and fraud intelligence to knowledge copilots and generative AI — delivering measurable
        outcomes at speed and scale.
      </p>
      <div className={styles.heroActions}>
        <Link to="/services" className="btn-primary">Explore Our Services</Link>
        <Link to="/products" className="btn-outline">Our Products</Link>
      </div>
      <div className={styles.heroStats}>
        {[
          ['10',  'AI Use Cases'],
          ['4',   'Core Services'],
          ['10+', 'Industries Served'],
          ['24h', 'Response Time'],
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

function ServicesSection() {
  const ref = useScrollReveal()
  return (
    <section id="services" className={styles.servicesSection}>
      <div ref={ref} className="reveal">
        <p className="section-label">Our Services</p>
        <h2 className="section-title">End-to-end AI adoption services<br />for the global enterprise</h2>
        <p className="section-sub">From strategy and research to hands-on implementation and data infrastructure — everything you need to adopt AI with confidence.</p>
      </div>
      <div className={styles.servicesGrid}>
        {SERVICES.map(s => (
          <Link key={s.slug} to={`/services/${s.slug}`}
            className={`${styles.serviceCard} ${s.num === '01' ? styles.featured : ''}`}>
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

function ProductsSection() {
  const ref = useScrollReveal()
  return (
    <section id="products" className={styles.productsSection}>
      <div ref={ref} className="reveal">
        <p className="section-label">Our Products</p>
        <h2 className="section-title">Few high-impact AI use cases<br />for the modern enterprise</h2>
        <p className="section-sub">We build and deploy enterprise-grade AI across autonomous agents, fraud intelligence, knowledge copilots, document processing, and more — globally adopted use cases with proven ROI.</p>
      </div>
      <div className={styles.productsGrid}>
        {PRODUCTS.map(p => (
          <div key={p.title} className={styles.productCard}>
            <div className={styles.productTop}>
              <span className={styles.productIcon}>{p.icon}</span>
              <span className={styles.productStatus}>In Development</span>
            </div>
            <div className={styles.productTag}>{p.tag}</div>
            <h3 className={styles.productTitle}>{p.title}</h3>
            <p className={styles.productDesc}>{p.desc}</p>
          </div>
        ))}
      </div>
      <div className={styles.productsCta}>
        <Link to="/products" className="btn-outline">View All Products →</Link>
      </div>
    </section>
  )
}

function WhyUsSection() {
  const ref = useScrollReveal()
  return (
    <section className={styles.whySection}>
      <div ref={ref} className="reveal">
        <p className="section-label">Why KDA Analytics</p>
        <h2 className="section-title">Your AI adoption partner<br />built for speed and scale</h2>
      </div>
      <div className={styles.whyGrid}>
        {WHY_US.map(w => (
          <div key={w.title} className={styles.whyCard}>
            <div className={styles.whyIcon}>{w.icon}</div>
            <h3 className={styles.whyTitle}>{w.title}</h3>
            <p className={styles.whyDesc}>{w.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaInner}>
        <p className="section-label">Ready to adopt AI?</p>
        <h2 className={styles.ctaTitle}>Let's accelerate your AI journey</h2>
        <p className={styles.ctaSub}>Tell us about your business goals — we'll map the right AI use cases and get you to value fast. Our team responds within 24 business hours.</p>
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
      <ServicesSection />
      <ProductsSection />
      <WhyUsSection />
      <CtaSection />
    </div>
  )
}
