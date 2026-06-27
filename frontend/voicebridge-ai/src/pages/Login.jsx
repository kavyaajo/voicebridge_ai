import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'
import Alert from '../components/Alert'
import styles from './Auth.module.css'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Username is required.'
    if (!form.password) e.password = 'Password is required.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    setServerError('')
    setLoading(true)
    try {
      await signIn(form)
      navigate('/dashboard')
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0]
      setServerError(detail || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logoMark}>◉</span>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.sub}>Sign in to your VoiceBridge account</p>
        </div>

        <Alert type="error" message={serverError} />

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            label="Username"
            type="text"
            placeholder="your_username"
            value={form.username}
            onChange={set('username')}
            error={errors.username}
            autoComplete="username"
            autoFocus
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            autoComplete="current-password"
          />
          <Button type="submit" loading={loading} fullWidth>
            Sign in
          </Button>
        </form>

        <p className={styles.switchLink}>
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
