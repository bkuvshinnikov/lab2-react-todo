const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const { ObjectId, MongoServerError } = require('mongodb')

function load(file, overrides) {
  const source = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const context = vm.createContext({ exports: {}, Request, Response, console, require(name) { if (name === 'server-only') return {}; if (Object.hasOwn(overrides, name)) return overrides[name]; return require(name) } })
  vm.runInContext(source, context); return context.exports
}

function request(body = {}, method = 'POST') { return new Request('http://localhost/api/test', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) }

test('tasks are scoped to the authenticated user and validate create input', async () => {
  const user = { _id: new ObjectId(), name: 'A', email: 'a@example.com' }
  const docs = []
  const collection = {
    async createIndex() {},
    find(query) { assert.equal(query.userId, user._id); return { sort: () => ({ toArray: async () => docs }) } },
    async insertOne(doc) { docs.push({ ...doc, _id: new ObjectId() }); return { insertedId: docs.at(-1)._id } },
  }
  const routes = load('app/api/tasks/route.ts', { '@/lib/auth': { getCurrentUser: async () => user }, '@/lib/tasks': { getTasksCollection: async () => collection } })
  assert.equal((await routes.POST(request({ text: '  task ', priority: 'high', category: 'custom', dueDate: '' }))).status, 201)
  assert.equal(docs[0].userId, user._id); assert.equal(docs[0].text, 'task'); assert.equal(docs[0].category, 'custom')
  assert.equal((await routes.POST(request({ text: '' }))).status, 400)
  const list = await routes.GET(); assert.equal(list.status, 200); assert.equal((await list.json()).tasks.length, 1)
})

test('unauthenticated task requests are rejected', async () => {
  const routes = load('app/api/tasks/route.ts', { '@/lib/auth': { getCurrentUser: async () => null }, '@/lib/tasks': { getTasksCollection: async () => { throw Error('must not connect') } } })
  assert.equal((await routes.GET()).status, 401); assert.equal((await routes.POST(request({ text: 'x' }))).status, 401)
})

test('categories support user-scoped creation and duplicate protection', async () => {
  const user = { _id: new ObjectId(), name: 'A', email: 'a@example.com' }; const docs = []
  const collection = { async createIndex() {}, async insertOne(doc) { if (docs.some(item => item.name === doc.name && String(item.userId) === String(user._id))) throw new MongoServerError({ code: 11000, message: 'duplicate' }); docs.push(doc) } }
  const routes = load('app/api/categories/route.ts', { '@/lib/auth': { getCurrentUser: async () => user }, '@/lib/categories': { getCategoriesCollection: async () => collection } })
  assert.equal((await routes.POST(request({ name: ' Work ' }))).status, 201)
  assert.equal((await routes.POST(request({ name: 'work' }))).status, 409)
})
