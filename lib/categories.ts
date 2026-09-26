import 'server-only'
import type { OptionalId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import type { CategoryDocument } from '@/types/category'

export async function getCategoriesCollection() {
  const collection = (await getDatabase()).collection<OptionalId<CategoryDocument>>('categories')
  await collection.createIndex({ userId: 1, name: 1 }, { unique: true, name: 'categories_user_name_unique' })
  return collection
}
