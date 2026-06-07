import { User, UserRole } from "@/types"
import { useAuthStore } from "@/store/auth.store"

const rolePermissions: Record<UserRole, string[]> = {
  super_admin: ["*"],  // wildcard — all permissions
  basic_service_manager: [
    "vehicles.view", "vehicles.create", "vehicles.edit",
    "drivers.view", "maintenance.view", "maintenance.approve",
    "fuel.view", "fuel.approve", "transport_requests.approve",
    "reports.view", "alerts.view", "incidents.view",
  ],
  transport_deployment_head: [
    "vehicles.view", "drivers.view", "assignments.manage",
    "transport_requests.view", "transport_requests.approve",
    "dispatch.manage", "reports.view", "alerts.view",
  ],
  transport_deployment_expert: [
    "vehicles.view", "vehicles.create", "vehicles.edit",
    "drivers.view", "drivers.create",
    "dispatch.manage", "trips.manage", "fuel.approve",
    "incidents.create", "incidents.view", "reports.generate",
  ],
  maintenance_expert: [
    "maintenance.view", "maintenance.approve", "work_orders.manage",
    "spare_parts.manage", "replaced_items.manage", "vehicles.view",
  ],
  driver: [
    "transport_requests.create", "fuel.request", 
    "maintenance.request", "incidents.create",
    "trips.view_own",
  ],
  ict_department: ["users.view", "system.monitor"],
}

export function hasPermission(
  user: User, 
  permission: string
): boolean {
  const perms = rolePermissions[user.role]
  return perms.includes("*") || perms.includes(permission)
}

export function usePermission(permission: string): boolean {
  const user = useAuthStore((s) => s.user)
  if (!user) return false
  return hasPermission(user, permission)
}
