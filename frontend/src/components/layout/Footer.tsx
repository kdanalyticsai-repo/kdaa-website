import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const LINKS = {
  Company: [
    { label: 'Features',     to: '/features' },
    { label: 'Services',     to: '/services' },
    { label: 'For Business', to: '/for-business' },
    { label: 'Contact',      to: '/contact' },
  ],
  Services: [
    { label: 'Market Research',    to: '/services/market-research' },
    { label: 'Startup Scouting',   to: '/services/startup-scouting' },
    { label: 'AI Strategy',        to: '/services/ai-strategy-consulting' },
    { label: 'API & Data',         to: '/services/api-data-licensing' },
  ],
  Business: [
    { label: 'Enterprise',         to: '/for-business/enterprise-strategy' },
    { label: 'Investors & Funds',  to: '/for-business/investors-funds' },
    { label: 'Startups & Founders',to: '/for-business/startups-founders' },
    { label: 'API Partners',       to: '/for-business/api-data-partners' },
  ],
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.lb}>[</span>KDA<span className={styles.lb}>]</span>
            <span className={styles.sub}> Analytics</span>
          </div>
          <p className={styles.tagline}>Where Data Meets Intelligence</p>
          <p className={styles.desc}>
            Your gateway to the global AI startup ecosystem — curated intelligence
            for the agentic era.
          </p>
          <div className={styles.contact}>
            <a href="mailto:hello@kdaanalytics.ai">hello@kdaanalytics.ai</a>
            <span>New Delhi · Singapore</span>
          </div>
        </div>

        {Object.entries(LINKS).map(([section, items]) => (
          <div key={section} className={styles.col}>
            <h4 className={styles.colTitle}>{section}</h4>
            <ul>
              {items.map(i => (
                <li key={i.to}>
                  <Link to={i.to} className={styles.footLink}>{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} KDA Analytics. All rights reserved.</p>
        <div className={styles.legal}>
          <Link to="/contact">Privacy Policy</Link>
          <Link to="/contact">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
