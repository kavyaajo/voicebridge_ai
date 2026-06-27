import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.brand}>◉ VoiceBridge AI</span>
      </div>
    </footer>
  )
}
