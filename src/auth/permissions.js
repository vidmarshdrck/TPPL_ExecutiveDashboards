// Role/permission architecture for the TPPL dashboard.
//
// This is a real authorization layer, not a UI convenience: routes are
// guarded by `hasPermission`, not just hidden nav buttons (see
// App.jsx `RequirePermission`). Today it runs entirely client-side against
// the session user produced by demoAuth.js — there is no backend yet to
// issue/verify a signed role claim, so this must be re-implemented against
// real server-issued roles before this is treated as a security boundary.

export const ROLES = {
  ADMINISTRATOR: 'Administrator',
  DATA_MANAGER: 'Data manager',
  MANAGEMENT_VIEWER: 'Management viewer',
}

// Permission -> roles allowed to hold it.
const PERMISSION_ROLES = {
  'users.manage': [ROLES.ADMINISTRATOR],
  'roles.manage': [ROLES.ADMINISTRATOR],
  'system.configure': [ROLES.ADMINISTRATOR],
  'integrations.configure': [ROLES.ADMINISTRATOR],
  'audit.view': [ROLES.ADMINISTRATOR],
  'kpi.administer': [ROLES.ADMINISTRATOR, ROLES.DATA_MANAGER],
  'kpi.import': [ROLES.ADMINISTRATOR, ROLES.DATA_MANAGER],
  'dashboard.view': [ROLES.ADMINISTRATOR, ROLES.DATA_MANAGER, ROLES.MANAGEMENT_VIEWER],
  'profile.edit': [ROLES.ADMINISTRATOR, ROLES.DATA_MANAGER, ROLES.MANAGEMENT_VIEWER],
}

// Used both by `RequirePermission` (route guards in App.jsx) and by
// components that conditionally render admin-only controls. An unknown
// `permission` string (typo, or not yet added to PERMISSION_ROLES above)
// fails closed — returns false rather than throwing or allowing access.
export function hasPermission(user, permission) {
  if (!user?.role) return false
  const allowed = PERMISSION_ROLES[permission]
  if (!allowed) return false
  return allowed.includes(user.role)
}

export function isAdministrator(user) {
  return user?.role === ROLES.ADMINISTRATOR
}
