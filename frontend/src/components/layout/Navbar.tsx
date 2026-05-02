import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'About',    to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Products', to: '/products' },
  { label: 'Contact',  to: '/contact' },
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
        <img src="/logo.png" alt="KDA Analytics" className={styles.logoImg} />
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
