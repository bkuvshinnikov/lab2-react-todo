import type { ObjectId } from 'mongodb'

export interface CategoryDocument { _id: ObjectId; userId: ObjectId; name: string; createdAt: Date }
