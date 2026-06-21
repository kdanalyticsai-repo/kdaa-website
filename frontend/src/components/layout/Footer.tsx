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

        <div className={styles.social}>
          <span className={styles.socialLabel}>Follow us at</span>
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com/share/1CN63MgWj6/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/share/1CN63MgWj6/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://x.com/KDAAAnalytics" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/kdaa-analytics-pvt-ltd/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="https://whatsapp.com/channel/0029Vb7s4ZV0LKZ7UweRBn26" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className={styles.legal}>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
