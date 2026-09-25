export const DEMO_USERS = [
  { id: 'tazama-manager', name: 'Management demo', email: 'manager@tazama.demo', password: 'TazamaViewer2026!', role: 'Management viewer' },
  { id: 'tazama-data-manager', name: 'Data manager demo', email: 'data@tazama.demo', password: 'TazamaData2026!', role: 'Data manager' },
  { id: 'tazama-admin', name: 'Admin demo', email: 'admin@tazama.demo', password: 'TazamaAdmin2026!', role: 'Administrator' },
  { id: 'shadrick-bilali', name: 'Shadrick Bilali', email: 'shadrick.bilali@tazama.demo', password: 'TazamaExec2026!', role: 'Administrator' },
]

function toSafeUser({ id, name, email, role }) {
  return { id, name, email, role }
}

export function authenticateDemoUser(email, password) {
  const user = DEMO_USERS.find((candidate) => candidate.email === email.trim().toLowerCase() && candidate.password === password)
  return user ? toSafeUser(user) : null
}

export function getDemoUserById(id) {
  const user = DEMO_USERS.find((candidate) => candidate.id === id)
  return user ? toSafeUser(user) : null
}
