import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>◉</span>
          VoiceBridge
        </Link>

        <div className={styles.links}>
          {user ? (
            <>
              <Link to="/dashboard" className={`${styles.link} ${isActive('/dashboard') ? styles.active : ''}`}>
                Workspace
              </Link>
              <Link to="/history" className={`${styles.link} ${isActive('/history') ? styles.active : ''}`}>
                History
              </Link>
              <span className={styles.username}>@{user.username}</span>
              <button onClick={handleSignOut} className={styles.signOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.link}>Sign in</Link>
              <Link to="/register" className={styles.cta}>Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
