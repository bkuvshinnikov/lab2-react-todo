import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  if (!await getCurrentUser()) redirect('/login')
  redirect('/')
}
