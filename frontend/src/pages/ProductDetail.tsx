import { useParams, Link, Navigate } from 'react-router-dom'
import styles from './ServiceDetail.module.css'

export const FOOTER_PRODUCTS = [
  {
    slug: 'proaicv',
    icon: '🚀',
    title: 'ProAICV',
    tagline: 'Hire smarter. Get hired faster.',
    color: 'rgba(99,102,241,0.12)',
    desc: 'ProAICV is a live, dual-sided AI career platform serving both job seekers and job providers. Job seekers get smart job matching, AI resume coaching, interview prep, and application tracking. Job providers can post listings, manage applicants, and hire qualified candidates — all from one mobile app, available now on Android and iOS.',
    bullets: [
      'Smart job matching — AI surfaces the best-fit roles based on your resume and skills daily',
      'Resume upload & ATS score — instantly see how your resume ranks against any job',
      'AI Career Coach — chat with an AI coach anytime for personalised career guidance',
      'Interview prep — AI-generated questions and model answers tailored to your target role',
      'Cover letter generator — unique, personalised cover letters for every application',
      'Resume tailoring — automatically adapt your resume to match specific job descriptions',
      'Application tracker — manage and track every application in one organised place',
      'Job Provider portal — post listings with full specs, review applicants, and manage hiring',
    ],
    industries: ['Job Seekers', 'Job Providers', 'HRTech', 'EdTech', 'Staffing'],
  },
  {
    slug: 'dharmaai',
    icon: '🪔',
    title: 'DharmaAI',
    tagline: 'Your companion on the path of wisdom.',
    color: 'rgba(204,85,0,0.12)',
    appUrl: 'https://dharma.kdaanalytics.com/welcome',
    desc: 'DharmaAI is a live, multilingual spiritual companion that brings the timeless wisdom of the Bhagavad Gita, the Vedas, and the Upanishads to everyday life through AI. Seekers read scripture with translations and commentary, ask an AI Guru for personalised guidance, track their daily sadhana, listen to audio wisdom, and connect with a community of fellow seekers — available on web and Android in English, Hindi, Tamil, Bengali, Gujarati, and Odia.',
    bullets: [
      'AI Guru — a compassionate AI guide offering personalised spiritual counsel',
      'Scripture Scholar — verse-grounded answers with citations from the Gita and beyond',
      'Full reader for the Bhagavad Gita, Vedas, and Upanishads with translations & commentary',
      'Daily Reflection and Daily Audio Wisdom — a fresh verse and chapter reading each day',
      'Sadhana tracker — build and sustain your daily spiritual practice and streak',
      'Sangha community — share reflections, celebrate milestones, and draw inspiration',
      'Available on web and Android — sign in with Google or email on any device',
      'Fully multilingual — English, Hindi, Tamil, Bengali, Gujarati, and Odia, with transliterated names',
      'Premium membership with gifting, secure Razorpay payments, and account management',
    ],
    industries: ['Spirituality', 'Wellness', 'Consumer Apps', 'EdTech', 'Devotional'],
  },
  {
    slug: 'enterprise-chatbot',
    icon: '💬',
    title: 'Enterprise Chatbot',
    tagline: 'Intelligent Conversational AI for Business',
    color: 'rgba(0,212,255,0.12)',
    desc: 'A production-ready enterprise chatbot platform powered by large language models, designed to automate customer support, internal helpdesks, and complex business workflows. Handles multi-turn conversations, integrates with enterprise systems, and continuously improves through reinforcement learning from human feedback.',
    bullets: [
      'Multi-channel deployment — web, mobile, WhatsApp, Microsoft Teams',
      'LLM-powered contextual understanding with intent and entity detection',
      'Seamless CRM, ERP, and ticketing system integrations',
      'Live agent handoff with full conversation context preservation',
      'Analytics dashboard tracking engagement, resolution rates, and CSAT',
      'Custom fine-tuning on your proprietary knowledge base and internal documents',
    ],
    industries: ['Banking & Insurance', 'E-Commerce', 'Healthcare', 'Telecom', 'HR & IT Helpdesk'],
  },
  {
    slug: 'fraud-detection',
    icon: '🔍',
    title: 'Fraud Detection',
    tagline: 'Real-Time AI-Powered Fraud Intelligence',
    color: 'rgba(239,68,68,0.12)',
    desc: 'An advanced fraud detection system leveraging machine learning and behavioural analytics to identify and block suspicious patterns in real time. Protects financial transactions, digital onboarding flows, and payment gateways with adaptive models that evolve continuously to stay ahead of emerging fraud tactics.',
    bullets: [
      'Real-time transaction scoring and risk flagging with sub-100ms latency',
      'Behavioural biometrics and device fingerprinting for account takeover prevention',
      'Network graph analysis to detect organised fraud rings and mule accounts',
      'Adaptive ML models with automated retraining on new fraud signals',
      'Low false-positive tuning to protect genuine customer experience',
      'Integration with core banking, UPI, and payment gateway systems',
    ],
    industries: ['Banking', 'FinTech', 'Insurance', 'E-Commerce', 'NBFCs'],
  },
  {
    slug: 'agentic-ai-platform',
    icon: '🤖',
    title: 'Agentic AI Platform',
    tagline: 'Autonomous Multi-Agent Business Automation',
    color: 'rgba(124,58,237,0.12)',
    desc: 'Deploy autonomous, goal-driven AI agents that execute complex multi-step business workflows with minimal human intervention. Agents plan, reason, use external tools, and coordinate with each other to complete finance, procurement, HR, and operational tasks — consistently reducing manual effort by 40–70%.',
    bullets: [
      'Multi-agent orchestration with task delegation and result aggregation',
      'Tool use: APIs, SQL databases, web search, ERPs, and document stores',
      'Human-in-the-loop approval checkpoints for high-stakes decisions',
      'Full audit trail, agent observability, and explainability reports',
      'Custom agent design for any domain — finance, legal, operations, procurement',
      'Secure enterprise deployment with role-based access control and data isolation',
    ],
    industries: ['Finance', 'Operations', 'HR', 'Legal', 'Procurement'],
  },
  {
    slug: 'aml-solution',
    icon: '🏦',
    title: 'AML Solution',
    tagline: 'AI-Driven Anti-Money Laundering Compliance',
    color: 'rgba(16,185,129,0.12)',
    desc: 'A comprehensive Anti-Money Laundering (AML) platform combining AI-powered transaction monitoring, customer due diligence, and regulatory reporting. Built to meet RBI, FATF, and PMLA compliance requirements, enabling financial institutions to significantly reduce compliance costs while dramatically improving detection accuracy.',
    bullets: [
      'Real-time transaction monitoring with adaptive ML risk scoring',
      'Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD) automation',
      'Automated Suspicious Activity Report (SAR) generation and submission workflows',
      'Integration with CIBIL, UIDAI Aadhaar verification, and PAN systems',
      'Full regulatory compliance: RBI, SEBI, FATF, and PMLA 2002 frameworks',
      'Case management with investigator dashboards and escalation routing',
    ],
    industries: ['Banking', 'NBFCs', 'Insurance', 'FinTech', 'Cooperative Banks'],
  },
]

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = FOOTER_PRODUCTS.find(p => p.slug === slug)

  if (!product) return <Navigate to="/products" replace />

  const others = FOOTER_PRODUCTS.filter(p => p.slug !== slug)

  return (
    <div className={`${styles.page} page-enter`}>

      <div className={styles.breadcrumb}>
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.title}</span>
      </div>

      <div className={styles.hero} style={{ '--color': product.color } as React.CSSProperties}>
        <div className={styles.heroGlow} />
        <div className={styles.badge}>
          <span className={styles.badgeIcon}>{product.icon}</span>
          AI Product
        </div>
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.tagline}>{product.tagline}</p>
        <div className={styles.heroActions}>
          {'appUrl' in product && product.appUrl
            ? <a href={product.appUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">Open the App →</a>
            : product.slug === 'proaicv'
              ? <Link to="/contact" className="btn-primary">Download the App →</Link>
              : <Link to="/contact" className="btn-primary">Request a Demo →</Link>
          }
          <Link to="/products" className="btn-outline">← All Products</Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.main}>
          <h2>Overview</h2>
          <p className={styles.overview}>{product.desc}</p>

          <h2>Key Capabilities</h2>
          <ul className={styles.bullets}>
            {product.bullets.map(b => (
              <li key={b}>
                <span className={styles.check}>✓</span>
                {b}
              </li>
            ))}
          </ul>

          <div className={styles.cta}>
            <h3>Interested in this product?</h3>
            {'appUrl' in product && product.appUrl ? (
              <>
                <p>Visit {product.title} to explore it yourself, or get in touch with any questions.</p>
                <div className={styles.heroActions}>
                  <a href={product.appUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">Visit {product.title} →</a>
                  <Link to="/contact" className="btn-outline">Contact Us →</Link>
                </div>
              </>
            ) : (
              <>
                <p>Get in touch to discuss your requirements and schedule a personalised demo.</p>
                <Link to="/contact" className="btn-primary">Contact Us →</Link>
              </>
            )}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideIcon} style={{ background: product.color }}>{product.icon}</div>
            <h3>{product.title}</h3>
            <div className={styles.sidePills}>
              {product.industries.map(ind => (
                <span key={ind} className={styles.pill}>{ind}</span>
              ))}
            </div>
          </div>

          <div className={styles.sideCard}>
            <h4>Other Products</h4>
            {others.map(o => (
              <Link key={o.slug} to={`/products/${o.slug}`} className={styles.otherLink}>
                <span>{o.icon}</span>
                <span>{o.title}</span>
                <span className={styles.arrow}>→</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
