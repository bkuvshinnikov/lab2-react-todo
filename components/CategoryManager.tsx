'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CategoryManager() {
  const [categories, setCategories] = useState<string[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const load = () => fetch('/api/categories', { cache: 'no-store' }).then(response => response.json()).then(data => setCategories(data.categories || [])).catch(() => setMessage('Could not load categories.'))
  useEffect(() => { void load() }, [])

  async function add() {
    const response = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
    const data = await response.json()
    if (!response.ok) return setMessage(data.error || 'Could not create category.')
    setCategories(current => [...current, data.category]); setName(''); setMessage('Category added.')
  }

  async function remove(item: string) {
    const response = await fetch(`/api/categories/${encodeURIComponent(item)}`, { method: 'DELETE' })
    if (response.ok) setCategories(current => current.filter(category => category !== item))
    else setMessage('Could not delete category.')
  }

  return <main className="category-page"><section className="category-card">
    <div className="brand-icon">✓</div><span className="eyebrow">TASK MANAGER</span>
    <h1>Manage categories</h1><p className="subtitle">Create categories for your personal workspace.</p>
    <div className="category-create"><input value={name} maxLength={40} placeholder="Category name" onChange={event => setName(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') add() }} /><button onClick={add}>Add</button></div>
    {message && <p className="category-message" role="status">{message}</p>}
    <ul className="category-items">{categories.map(item => <li key={item}><span>{item}</span><button onClick={() => remove(item)} aria-label={`Delete ${item} category`}>Delete</button></li>)}</ul>
    <Link className="auth-home" href="/">Back to tasks</Link>
  </section></main>
}
