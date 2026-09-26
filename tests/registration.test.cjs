const test = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const { scryptSync } = require('node:crypto')
const { MongoServerError, ObjectId } = require('mongodb')

// Compile the actual TypeScript modules; replace only external persistence.
// No Next.js server, credentials, or database is needed for these tests.
function loadModule(path, overrides = {}) {
  const source = ts.transpileModule(readFileSync(resolve(__dirname, '..', path), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const context = vm.createContext({
    exports: {}, Buffer, Request, Response,
    require(name) {
      if (name === 'server-only') return {}
      if (Object.hasOwn(overrides, name)) return overrides[name]
      return require(name)
    },
  })
  vm.runInContext(source, context)
  return context.exports
}

function setup({ dbFailure = false, hashFailure = false } = {}) {
  const documents = new Map()
  const passwords = []
  const { POST } = loadModule('app/api/auth/register/route.ts', {
    '@/lib/users': {
      async getUsersCollection() {
        if (dbFailure) throw new Error('private database URI')
        return {
          async insertOne(doc) {
            if (documents.has(doc.email)) throw new MongoServerError({ message: 'duplicate private data', code: 11000 })
            documents.set(doc.email, doc)
            return { insertedId: new ObjectId() }
          },
        }
      },
    },
    '@/lib/passwords': {
      async hashPassword(password) {
        passwords.push(password)
        if (hashFailure) throw new Error('private password details')
        return 'test-password-hash'
      },
    },
  })
  function request(body, contentType = 'application/json') {
    return POST(new Request('http://localhost/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': contentType },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }))
  }
  return { request, documents, passwords }
}
const valid = { name: '  Boris  ', email: '  BORIS@example.com  ', password: ' a long passphrase ' }

test('registration stores only allowed fields, normalizes email, and returns no secrets or session', async () => {
  const { request, documents, passwords } = setup()
  const response = await request({ ...valid, role: 'admin', passwordHash: 'attacker supplied' })
  assert.equal(response.status, 201)
  assert.equal(response.headers.get('set-cookie'), null)
  const body = await response.json()
  assert.deepEqual(Object.keys(body.user).sort(), ['createdAt', 'email', 'id', 'name'])
  assert.equal(body.user.name, 'Boris')
  assert.equal(body.user.email, 'boris@example.com')
  assert.match(body.user.id, /^[a-f0-9]{24}$/)
  assert.ok(Number.isFinite(Date.parse(body.user.createdAt)))
  const stored = documents.get('boris@example.com')
  assert.deepEqual(Object.keys(stored).sort(), ['createdAt', 'email', 'name', 'passwordHash'])
  assert.equal(stored.passwordHash, 'test-password-hash')
  assert.equal(passwords[0], valid.password)
})

test('invalid payloads are rejected before hashing or database writes', async () => {
  const { request, documents, passwords } = setup()
  for (const body of [null, [], 12, {}, '{bad', { ...valid, name: ' ' },
    { ...valid, name: 'a'.repeat(101) }, { ...valid, email: 'invalid' },
    { ...valid, email: { $ne: null } }, { ...valid, password: 123 },
    { ...valid, password: 'a'.repeat(8) }, { ...valid, password: 'a'.repeat(129) },
    { ...valid, email: 'a'.repeat(255) + '@example.com' }]) {
    assert.equal((await request(body)).status, 400)
  }
  assert.equal((await request(valid, 'text/plain')).status, 415)
  assert.equal((await request(' '.repeat(8193))).status, 413)
  assert.equal(documents.size, 0)
  assert.equal(passwords.length, 0)
})

test('password boundaries and Unicode are accepted without truncation', async () => {
  for (const password of ['a'.repeat(9), 'a'.repeat(128), '🔑'.repeat(9)]) {
    const { request, passwords } = setup()
    assert.equal((await request({ ...valid, password })).status, 201)
    assert.equal(passwords[0], password)
  }
})

test('concurrent registrations with equivalent emails create only one user', async () => {
  const { request, documents } = setup()
  const responses = await Promise.all([request(valid), request({ ...valid, email: 'boris@example.com' })])
  assert.deepEqual(responses.map(r => r.status).sort(), [201, 409])
  assert.equal(documents.size, 1)
})

test('database and hashing failures return generic errors', async () => {
  for (const options of [{ dbFailure: true }, { hashFailure: true }]) {
    const { request, documents } = setup(options)
    const response = await request(valid)
    assert.equal(response.status, 500)
    assert.deepEqual(await response.json(), { error: 'Unable to register. Please try again later.' })
    assert.equal(documents.size, 0)
  }
})

test('real scrypt hashes use independent salts and can be verified', async () => {
  const { hashPassword } = loadModule('lib/passwords.ts')
  const first = await hashPassword(valid.password)
  const second = await hashPassword(valid.password)
  assert.notEqual(first, second)
  const [algorithm, N, r, p, salt, key] = first.split('$')
  assert.equal(algorithm, 'scrypt')
  assert.equal(N, '131072')
  assert.equal(r, '8')
  assert.equal(p, '1')
  assert.match(salt, /^[a-f0-9]{32}$/)
  assert.match(key, /^[a-f0-9]{128}$/)
  const derived = scryptSync(valid.password, salt, 64, { N: +N, r: +r, p: +p, maxmem: 256 * 1024 * 1024 })
  assert.equal(derived.toString('hex'), key)
})
