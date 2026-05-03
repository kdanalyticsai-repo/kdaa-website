import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const LINKS = {
  Company: [
    { label: 'Home',     to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Products', to: '/products' },
    { label: 'Contact',  to: '/contact' },
  ],
  Services: [
    { label: 'AI Market Research',      to: '/services/market-research' },
    { label: 'AI Strategy Consulting',  to: '/services/ai-strategy-consulting' },
    { label: 'API & Data Solutions',    to: '/services/api-data-licensing' },
  ],
  Products: [
    { label: 'Enterprise Chatbot',  to: '/products/enterprise-chatbot' },
    { label: 'Fraud Detection',     to: '/products/fraud-detection' },
    { label: 'Agentic AI Platform', to: '/products/agentic-ai-platform' },
    { label: 'AML Solution',        to: '/products/aml-solution' },
  ],
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="KDA Analytics" className={styles.logoImg} />
          </div>
          <p className={styles.tagline}>Where Data Meets Intelligence</p>
          <p className={styles.desc}>
            Building AI-powered products and delivering data intelligence services
            to enterprises worldwide.
          </p>
          <div className={styles.contact}>
            <a href="mailto:info@kdaanalytics.com">info@kdaanalytics.com</a>
            <span>Delhi NCR Region, India</span>
          </div>
        </div>

        {Object.entries(LINKS).map(([section, items]) => (
          <div key={section} className={styles.col}>
            <h4 className={styles.colTitle}>{section}</h4>
            <ul>
              {items.map(i => (
                <li key={i.label}>
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
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
