import { User } from "@/types"
import { useAuthStore } from "@/store/auth.store"
import { useRoleStore } from "@/store/role.store"

export function hasPermission(
  user: User, 
  permission: string
): boolean {
  const perms = useRoleStore.getState().rolePermissions[user.role] || []
  return perms.includes("*") || perms.includes(permission)
}

export function usePermission(permission: string): boolean {
  const user = useAuthStore((s) => s.user)
  const rolePermissions = useRoleStore((s) => s.rolePermissions)
  if (!user) return false
  const perms = rolePermissions[user.role] || []
  return perms.includes("*") || perms.includes(permission)
}
