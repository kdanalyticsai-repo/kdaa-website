import { useParams, Link, Navigate } from 'react-router-dom'
import { BUSINESS_DATA } from './ForBusiness'
import styles from './BusinessDetail.module.css'

export default function BusinessDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const item = BUSINESS_DATA.find(b => b.slug === slug)

  if (!item) return <Navigate to="/for-business" replace />

  const others = BUSINESS_DATA.filter(b => b.slug !== slug)

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.breadcrumb}>
        <Link to="/">Home</Link><span>/</span>
        <Link to="/for-business">For Business</Link><span>/</span>
        <span>{item.title}</span>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.badge}>
          <span>{item.icon}</span> For Business
        </div>
        <h1 className={styles.title}>{item.title}</h1>
        <p className={styles.tagline}>{item.tagline}</p>
        <div className={styles.actions}>
          <Link to="/contact" className="btn-primary">{item.cta} →</Link>
          <Link to="/for-business" className="btn-outline">← All Engagements</Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.main}>
          <h2>About this Engagement</h2>
          <p className={styles.overview}>{item.desc}</p>

          <h2>What You Get</h2>
          <ul className={styles.list}>
            {item.highlights.map(h => (
              <li key={h}><span className={styles.check}>✓</span>{h}</li>
            ))}
          </ul>

          <div className={styles.ctaBox}>
            <h3>Let's talk about your goals</h3>
            <p>Our team will follow up within 24 business hours.</p>
            <Link to="/contact" className="btn-primary">Get in Touch →</Link>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideIcon} style={{ background: item.color }}>{item.icon}</div>
            <h3>{item.title}</h3>
            <ul className={styles.sideList}>
              {item.highlights.map(h => (
                <li key={h}><span>✓</span>{h}</li>
              ))}
            </ul>
          </div>

          <div className={styles.sideCard}>
            <h4>Other Engagements</h4>
            {others.map(o => (
              <Link key={o.slug} to={`/for-business/${o.slug}`} className={styles.otherLink}>
                <span>{o.icon}</span>
                <span className={styles.otherTitle}>{o.title}</span>
                <span>→</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
