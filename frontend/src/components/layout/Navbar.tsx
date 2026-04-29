import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Features',    to: '/features' },
  { label: 'Services',    to: '/services' },
  { label: 'For Business',to: '/for-business' },
  { label: 'Contact',     to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoBracket}>[</span>
        <span className={styles.logoKDA}>KDA</span>
        <span className={styles.logoBracket}>]</span>
        <span className={styles.logoSub}>Analytics</span>
      </Link>

      <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        {NAV_LINKS.map(l => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              {l.label}
            </NavLink>
          </li>
        ))}
        <li className={styles.mobileCtaWrap}>
          <Link to="/contact" className={styles.cta}>Get in Touch</Link>
        </li>
      </ul>

      <Link to="/contact" className={styles.cta}>Get in Touch</Link>

      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span className={menuOpen ? styles.barOpen : ''} />
        <span className={menuOpen ? styles.barOpen : ''} />
        <span className={menuOpen ? styles.barOpen : ''} />
      </button>
    </nav>
  )
}
