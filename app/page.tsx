import TaskManager from '@/components/TaskManager'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return <TaskManager user={{ name: user.name, email: user.email }} />
}
