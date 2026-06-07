import { create } from "zustand"
import { UserRole } from "@/types"

const defaultRolePermissions: Record<UserRole, string[]> = {
  super_admin: ["*"],
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

interface RoleState {
  rolePermissions: Record<UserRole, string[]>
  togglePermission: (role: UserRole, permission: string) => void
  resetPermissions: () => void
}

export const useRoleStore = create<RoleState>()((set) => ({
  rolePermissions: { ...defaultRolePermissions },

  togglePermission: (role, permission) => {
    set((state) => {
      const perms = state.rolePermissions[role] || []
      const updatedPerms = perms.includes(permission)
        ? perms.filter((p) => p !== permission)
        : [...perms, permission]

      return {
        rolePermissions: {
          ...state.rolePermissions,
          [role]: updatedPerms,
        },
      }
    })
  },

  resetPermissions: () => {
    set({ rolePermissions: JSON.parse(JSON.stringify(defaultRolePermissions)) })
  },
}))
