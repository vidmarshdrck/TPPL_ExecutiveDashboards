import test from 'node:test'
import assert from 'node:assert/strict'
import { DEMO_USERS, authenticateDemoUser, getDemoUserById } from './demoAuth.js'

test('ships four named demo users with the requested roles', () => {
  assert.equal(DEMO_USERS.length, 4)
  assert.deepEqual(DEMO_USERS.map((user) => user.role), [
    'Management viewer',
    'Data manager',
    'Administrator',
    'Administrator',
  ])
})

test('authenticates a valid demo user without exposing a password in the session user', () => {
  const user = authenticateDemoUser('manager@tazama.demo', 'TazamaViewer2026!')
  assert.equal(user.role, 'Management viewer')
  assert.equal(user.password, undefined)
})

test('rejects invalid demo credentials', () => {
  assert.equal(authenticateDemoUser('manager@tazama.demo', 'wrong-password'), null)
  assert.equal(authenticateDemoUser('unknown@tazama.demo', 'TazamaViewer2026!'), null)
})

test('returns a safe user record by id for session restoration', () => {
  const user = getDemoUserById('tazama-admin')
  assert.deepEqual(user, {
    id: 'tazama-admin',
    name: 'Admin demo',
    email: 'admin@tazama.demo',
    role: 'Administrator',
  })
})
