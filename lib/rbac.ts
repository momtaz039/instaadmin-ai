import type { Role } from './types'

/**
 * Role-based access control. Permissions are expressed as `resource:action`.
 * The matrix is the single source of truth for both UI gating and API guards.
 */

export type Permission =
  | 'dashboard:view'
  | 'content:view'
  | 'content:create'
  | 'content:publish'
  | 'content:approve'
  | 'media:manage'
  | 'inbox:view'
  | 'inbox:reply'
  | 'crm:view'
  | 'crm:manage'
  | 'commerce:view'
  | 'commerce:manage'
  | 'orders:manage'
  | 'analytics:view'
  | 'agents:view'
  | 'agents:configure'
  | 'reports:view'
  | 'team:manage'
  | 'billing:manage'
  | 'settings:manage'
  | 'audit:view'

const ALL: Permission[] = [
  'dashboard:view',
  'content:view',
  'content:create',
  'content:publish',
  'content:approve',
  'media:manage',
  'inbox:view',
  'inbox:reply',
  'crm:view',
  'crm:manage',
  'commerce:view',
  'commerce:manage',
  'orders:manage',
  'analytics:view',
  'agents:view',
  'agents:configure',
  'reports:view',
  'team:manage',
  'billing:manage',
  'settings:manage',
  'audit:view',
]

export const rolePermissions: Record<Role, Permission[]> = {
  owner: ALL,
  admin: ALL.filter((p) => p !== 'billing:manage'),
  manager: [
    'dashboard:view',
    'content:view',
    'content:create',
    'content:publish',
    'content:approve',
    'media:manage',
    'inbox:view',
    'inbox:reply',
    'crm:view',
    'crm:manage',
    'commerce:view',
    'commerce:manage',
    'orders:manage',
    'analytics:view',
    'agents:view',
    'agents:configure',
    'reports:view',
  ],
  editor: [
    'dashboard:view',
    'content:view',
    'content:create',
    'media:manage',
    'inbox:view',
    'inbox:reply',
    'analytics:view',
    'agents:view',
  ],
  analyst: ['dashboard:view', 'content:view', 'crm:view', 'commerce:view', 'analytics:view', 'reports:view', 'agents:view'],
  viewer: ['dashboard:view', 'content:view', 'analytics:view'],
}

export const roleLabels: Record<Role, string> = {
  owner: 'Owner',
  admin: 'Admin',
  manager: 'Manager',
  editor: 'Editor',
  analyst: 'Analyst',
  viewer: 'Viewer',
}

export function can(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function canAny(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => can(role, p))
}
