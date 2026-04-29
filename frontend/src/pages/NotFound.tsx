import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.code}>404</div>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div className={styles.actions}>
        <Link to="/" className="btn-primary">Back to Home</Link>
        <Link to="/contact" className="btn-outline">Contact Us</Link>
      </div>
    </div>
  )
}
