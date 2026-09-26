import 'server-only'
import { randomBytes, scrypt } from 'node:crypto'

// OWASP scrypt baseline. Store parameters with the hash for future verification.
const N = 2 ** 17
const r = 8
const p = 1

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const key = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, { N, r, p, maxmem: 256 * 1024 * 1024 }, (error, derivedKey) => {
      if (error) reject(error)
      else resolve(derivedKey)
    })
  })
  return `scrypt$${N}$${r}$${p}$${salt}$${key.toString('hex')}`
}
