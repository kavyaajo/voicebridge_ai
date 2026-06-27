import styles from './Button.module.css'

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        styles.btn,
        styles[variant],
        fullWidth ? styles.full : '',
        loading ? styles.loading : '',
      ].join(' ')}
    >
      {loading ? <span className={styles.spinner} /> : null}
      <span className={loading ? styles.hidden : ''}>{children}</span>
    </button>
  )
}
