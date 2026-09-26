import 'server-only'
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

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

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [algorithm, nValue, rValue, pValue, salt, expectedHex] = encoded.split('$')
  const n = Number(nValue)
  const blockSize = Number(rValue)
  const parallelization = Number(pValue)
  if (algorithm !== 'scrypt' || !Number.isSafeInteger(n) || !Number.isSafeInteger(blockSize) || !Number.isSafeInteger(parallelization) || !salt || !/^[a-f0-9]+$/.test(expectedHex ?? '')) return false
  const expected = Buffer.from(expectedHex, 'hex')
  if (expected.length !== 64) return false
  const actual = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, expected.length, { N: n, r: blockSize, p: parallelization, maxmem: 256 * 1024 * 1024 }, (error, derivedKey) => error ? reject(error) : resolve(derivedKey))
  })
  return timingSafeEqual(actual, expected)
}
