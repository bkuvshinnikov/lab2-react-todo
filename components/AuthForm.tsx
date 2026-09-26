'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import type { Theme } from '@/types/task'

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const register = mode === 'register'
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const saved = localStorage.getItem('theme')
    if (saved === 'light') setTheme('light')
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch(`/api/auth/${register ? 'register' : 'login'}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(register ? { name, email, password } : { email, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Request failed.')
      if (!register) { router.push('/') ; return }
      setMessage('Account created. You can now log in.')
      if (register) { setName(''); setEmail(''); setPassword('') }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Request failed.') }
    finally { setBusy(false) }
  }

  return <main className={`auth-page ${theme}`}><section className="auth-card">
    <button className="auth-theme-button" type="button" onClick={toggleTheme}><span>{theme === 'light' ? '☾' : '☀'}</span> {theme === 'light' ? 'Dark' : 'Light'}</button>
    <div className="brand-icon">✓</div>
    <span className="eyebrow">TASK MANAGER</span>
    <h1>{register ? 'Create your account' : 'Welcome back'}</h1>
    <p className="subtitle">{register ? 'Start organizing what matters.' : 'Sign in to continue.'}</p>
    <form className="auth-form" onSubmit={submit}>
      {register && <label>Name<input value={name} onChange={event => setName(event.target.value)} required maxLength={100} autoComplete="name" /></label>}
      <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="email" /></label>
      <label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} required minLength={9} maxLength={128} autoComplete={register ? 'new-password' : 'current-password'} /></label>
      <button type="submit" disabled={busy}>{busy ? 'Please wait…' : register ? 'Create account' : 'Log in'}</button>
    </form>
    {message && <p className="auth-message" role="status">{message}</p>}
    <p className="auth-switch">{register ? 'Already have an account?' : 'No account yet?'}{' '}<Link href={register ? '/login' : '/register'}>{register ? 'Log in' : 'Register'}</Link></p>
  </section></main>
}
