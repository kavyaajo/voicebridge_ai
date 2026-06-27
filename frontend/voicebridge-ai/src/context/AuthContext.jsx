import { createContext, useContext, useState, useCallback } from 'react'
import { login as apiLogin, register as apiRegister } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const signIn = useCallback(async (credentials) => {
    const { data } = await apiLogin(credentials)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    const userData = { username: credentials.username }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return data
  }, [])

  const signUp = useCallback(async (credentials) => {
    const { data } = await apiRegister(credentials)
    return data
  }, [])

  const signOut = useCallback(() => {
    localStorage.clear()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
