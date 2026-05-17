import { Link } from 'react-router-dom'
import styles from './Products.module.css'

const PRODUCTS = [
  {
    icon: '🤖',
    title: 'Autonomous AI Agents Platform',
    subtitle: 'Agentic Business Automation',
    tags: ['Enterprise', 'Operations', 'Automation'],
    status: 'In Development',
    desc: 'Deploy autonomous, goal-driven AI agents that execute multi-step business workflows — finance ops, procurement, HR, and beyond — with minimal human input. Agents integrate with enterprise systems to plan, decide, and act, reducing manual effort by 40–70%.',
    capabilities: [
      'Multi-agent coordination and task delegation',
      'Tool use: web search, APIs, databases, ERPs',
      'Human-in-the-loop approval workflows',
      'Full audit trail and agent observability',
    ],
    industries: ['Finance', 'Operations', 'HR', 'Legal'],
    color: 'rgba(124,58,237,0.12)',
  },
  {
    icon: '🧠',
    title: 'Enterprise Knowledge Copilot',
    subtitle: 'RAG-Powered AI Assistant',
    tags: ['Enterprise', 'Knowledge Management', 'Productivity'],
    status: 'In Development',
    desc: 'GenAI-powered assistants that answer questions from internal documents, policies, and data lakes using retrieval-augmented generation (RAG). Drastically reduces knowledge search time and improves employee productivity across all functions.',
    capabilities: [
      'Document ingestion from SharePoint, Confluence, S3',
      'Semantic search with citation and source linking',
      'Role-based access control for sensitive data',
      'Continuous knowledge base refresh pipeline',
    ],
    industries: ['BFSI', 'Consulting', 'Healthcare', 'Legal'],
    color: 'rgba(0,212,255,0.12)',
  },
  {
    icon: '📈',
    title: 'Decision Intelligence Platform',
    subtitle: 'AI Analytics & Scenario Modeling',
    tags: ['Enterprise', 'Analytics', 'Executive'],
    status: 'In Development',
    desc: 'Enable natural language querying, predictive analytics, and scenario simulation for business decisions. Executives use AI copilots to derive insights, forecasts, and strategic recommendations instantly — no SQL or data science skills required.',
    capabilities: [
      'Natural language to SQL / BI query engine',
      'Time-series forecasting (demand, churn, risk)',
      'Scenario simulation and what-if analysis',
      'REST API and BI tool integrations (Power BI, Tableau)',
    ],
    industries: ['Retail', 'BFSI', 'Manufacturing', 'Telecom'],
    color: 'rgba(16,185,129,0.12)',
  },
  {
    icon: '🧾',
    title: 'Intelligent Document Processing',
    subtitle: 'AI Document Extraction & Validation',
    tags: ['BFSI', 'Legal', 'Compliance'],
    status: 'In Development',
    desc: 'AI extracts, classifies, and validates data from invoices, contracts, regulatory filings, and PDFs with high accuracy. Widely adopted in BFSI and legal to automate document-heavy workflows, cut processing time, and reduce human error.',
    capabilities: [
      'Multi-format ingestion: PDF, scanned docs, emails',
      'Named entity recognition and field extraction',
      'Automated validation and exception flagging',
      'Integration with ERP, core banking, and CRM systems',
    ],
    industries: ['Banking', 'Insurance', 'Legal', 'Healthcare'],
    color: 'rgba(245,158,11,0.12)',
  },
  {
    icon: '📊',
    title: 'Data Product Builder',
    subtitle: 'Autonomous Data Pipeline Agent',
    tags: ['Data', 'Analytics', 'Cross-Industry'],
    status: 'In Development',
    desc: 'AI agents build end-to-end data products — ingesting raw data, transforming it, generating insights, and creating dashboards automatically. Enables faster creation of analytics-ready pipelines and business intelligence products with minimal manual coding.',
    capabilities: [
      'Automated data ingestion, cleaning, and enrichment',
      'AI-generated dashboards and insight summaries',
      'Data lineage, versioning, and documentation',
      'API access and bulk data export (JSON/CSV/Parquet)',
    ],
    industries: ['Finance', 'Healthcare', 'Retail', 'SaaS'],
    color: 'rgba(59,130,246,0.12)',
  },
  {
    icon: '🎨',
    title: 'Marketing GenAI Suite',
    subtitle: 'Content Generation & Personalization',
    tags: ['Marketing', 'Content', 'Personalization'],
    status: 'In Development',
    desc: 'GenAI creates ads, campaigns, emails, and personalized content tailored to individual customer segments at scale. Enterprises achieve mass personalization while significantly reducing content production costs and time-to-market.',
    capabilities: [
      'Segment-level content personalization at scale',
      'Multi-channel campaign generation (email, social, web)',
      'Brand voice enforcement and compliance guardrails',
      'A/B testing integration and performance analytics',
    ],
    industries: ['E-Commerce', 'Retail', 'Media', 'Consumer Brands'],
    color: 'rgba(236,72,153,0.12)',
  },
  {
    icon: '📞',
    title: 'Customer Support Copilot',
    subtitle: 'Conversational AI & Agent Assist',
    tags: ['Customer Service', 'CX', 'Automation'],
    status: 'In Development',
    desc: 'AI chatbots and voice assistants handle customer queries, resolve tickets, and assist human agents in real time. Improves response times, reduces support costs by up to 60%, and enhances customer experience across web, mobile, and voice channels.',
    capabilities: [
      'Multi-channel deployment (web, WhatsApp, voice)',
      'LLM-powered contextual intent understanding',
      'Live agent handoff with full conversation context',
      'Analytics dashboard with CSAT and resolution metrics',
    ],
    industries: ['Retail', 'BFSI', 'Telecom', 'Healthcare'],
    color: 'rgba(20,184,166,0.12)',
  },
  {
    icon: '🚀',
    title: 'JobSearchAI',
    subtitle: 'AI Powered Job Search',
    tags: ['HRTech', 'Recruitment', 'Career'],
    status: 'Live',
    slug: 'cvpilot',
    desc: 'An AI-powered proactive job agent that autonomously discovers, matches, and applies to relevant opportunities on behalf of job seekers. Continuously monitors markets, surfaces high-fit roles, and personalizes applications — transforming passive job searching into active career intelligence.',
    capabilities: [
      'Autonomous role discovery across job boards and networks',
      'AI-driven fit scoring and match explanation',
      'Personalized resume and cover letter generation',
      'Application tracking and follow-up automation',
    ],
    industries: ['HRTech', 'Staffing', 'EdTech', 'Professional Services'],
    color: 'rgba(99,102,241,0.12)',
  },
]

export default function ProductsPage() {
  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <p className="section-label">Our Products</p>
        <h1 className={styles.heroTitle}>
          Few high-impact AI use cases<br />for the modern enterprise
        </h1>
        <p className={styles.heroSub}>
          We are building a focused portfolio of production-ready AI solutions targeting
          the highest-impact domains — from autonomous agents and fraud intelligence to
          knowledge copilots and revenue AI — helping enterprises worldwide adopt AI at scale.
        </p>
      </div>

      <section className={styles.grid}>
        {PRODUCTS.map((p, i) => {
          const cardInner = (
            <>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap} style={{ background: p.color }}>
                  <span className={styles.icon}>{p.icon}</span>
                </div>
                <span className={p.status === 'Live' ? styles.statusLive : styles.status}>{p.status}</span>
              </div>

              <div className={styles.tags}>
                {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>

              <h2 className={styles.title}>{p.title}</h2>
              <p className={styles.subtitle}>{p.subtitle}</p>
              <p className={styles.desc}>{p.desc}</p>

              <div className={styles.capabilities}>
                <div className={styles.capLabel}>Key Capabilities</div>
                <ul>
                  {p.capabilities.map(c => (
                    <li key={c} className={styles.cap}>
                      <span className={styles.check}>✓</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.industries}>
                <div className={styles.indLabel}>Industries</div>
                <div className={styles.indList}>
                  {p.industries.map(ind => (
                    <span key={ind} className={styles.ind}>{ind}</span>
                  ))}
                </div>
              </div>

              {'slug' in p && <div className={styles.viewLink}>View Product →</div>}
            </>
          )

          return 'slug' in p ? (
            <Link
              key={p.title}
              to={`/products/${p.slug}`}
              className={`${styles.card} ${styles.cardClickable}`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {cardInner}
            </Link>
          ) : (
            <div key={p.title} className={styles.card} style={{ animationDelay: `${i * 0.07}s` }}>
              {cardInner}
            </div>
          )
        })}
      </section>

      <section className={styles.ctaBanner}>
        <h2>Ready to adopt AI in your enterprise?</h2>
        <p>
          We partner with enterprises globally to implement, deploy, and scale these AI
          capabilities. Get in touch to explore which use cases fit your goals.
        </p>
        <Link to="/contact" className="btn-primary">Talk to Our Team</Link>
      </section>
    </div>
  )
}
