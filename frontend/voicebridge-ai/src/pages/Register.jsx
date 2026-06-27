import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'
import Alert from '../components/Alert'
import styles from './Auth.module.css'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Username is required.'
    else if (form.username.length < 3) e.username = 'At least 3 characters.'
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.password) e.password = 'Password is required.'
    else if (form.password.length < 8) e.password = 'At least 8 characters.'
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match.'
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
      await signUp({ username: form.username, email: form.email, password: form.password })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        const first = Object.values(data).flat()[0]
        setServerError(typeof first === 'string' ? first : 'Registration failed.')
      } else {
        setServerError('Something went wrong. Please try again.')
      }
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
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.sub}>Free to use — no card required</p>
        </div>

        <Alert type="error" message={serverError} />

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            label="Username"
            type="text"
            placeholder="kavya_dev"
            value={form.username}
            onChange={set('username')}
            error={errors.username}
            autoComplete="username"
            autoFocus
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="min. 8 characters"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            autoComplete="new-password"
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            value={form.confirm}
            onChange={set('confirm')}
            error={errors.confirm}
            autoComplete="new-password"
          />
          <Button type="submit" loading={loading} fullWidth>
            Create account
          </Button>
        </form>

        <p className={styles.switchLink}>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
