import { useParams, Link, Navigate } from 'react-router-dom'
import { SERVICES_DATA } from './Services'
import styles from './ServiceDetail.module.css'

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const service = SERVICES_DATA.find(s => s.slug === slug)

  if (!service) return <Navigate to="/services" replace />

  const others = SERVICES_DATA.filter(s => s.slug !== slug)

  return (
    <div className={`${styles.page} page-enter`}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/services">Services</Link>
        <span>/</span>
        <span>{service.title}</span>
      </div>

      {/* Hero */}
      <div className={styles.hero} style={{ '--color': service.color } as React.CSSProperties}>
        <div className={styles.heroGlow} />
        <div className={styles.badge}>
          <span className={styles.badgeIcon}>{service.icon}</span>
          Service {service.num}
        </div>
        <h1 className={styles.title}>{service.title}</h1>
        <p className={styles.tagline}>{service.tagline}</p>
        <div className={styles.heroActions}>
          <Link to="/contact" className="btn-primary">Get Started →</Link>
          <Link to="/services" className="btn-outline">← All Services</Link>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.main}>
          <h2>Overview</h2>
          <p className={styles.overview}>{service.desc}</p>

          <h2>What's Included</h2>
          <ul className={styles.bullets}>
            {service.bullets.map(b => (
              <li key={b}>
                <span className={styles.check}>✓</span>
                {b}
              </li>
            ))}
          </ul>

          <div className={styles.cta}>
            <h3>Ready to get started?</h3>
            <p>Tell us about your goals and we'll scope a tailored engagement.</p>
            <Link to="/contact" className="btn-primary">Contact Us →</Link>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideIcon} style={{ background: service.color }}>{service.icon}</div>
            <h3>{service.title}</h3>
            <div className={styles.sidePills}>
              {service.bullets.map(b => <span key={b} className={styles.pill}>{b}</span>)}
            </div>
          </div>

          <div className={styles.sideCard}>
            <h4>Other Services</h4>
            {others.map(o => (
              <Link key={o.slug} to={`/services/${o.slug}`} className={styles.otherLink}>
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
