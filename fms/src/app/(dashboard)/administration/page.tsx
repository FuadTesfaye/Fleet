"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { useRoleStore } from "@/store/role.store"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ROLE_LABELS, UserRole } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RotateCcw } from "lucide-react"
import { toast } from "sonner"

interface PermissionDefinition {
  key: string
  label: string
  category: string
  description: string
}

const permissionsList: PermissionDefinition[] = [
  // Vehicles
  { key: "vehicles.view", label: "View Vehicles", category: "Fleet Vehicles", description: "Read-only access to all registered fleet vehicles." },
  { key: "vehicles.create", label: "Create Vehicles", category: "Fleet Vehicles", description: "Register new vehicles in the registry." },
  { key: "vehicles.edit", label: "Edit Vehicles", category: "Fleet Vehicles", description: "Update technical properties, license dates, and location details." },
  // Drivers
  { key: "drivers.view", label: "View Drivers", category: "Drivers Registry", description: "Read-only access to the list of active/inactive drivers." },
  { key: "drivers.create", label: "Create Drivers", category: "Drivers Registry", description: "Register new drivers and assign licensing detail classes." },
  // Assignments
  { key: "assignments.manage", label: "Manage Assignments", category: "Assignments", description: "Allocate vehicles to divisions or pair drivers with vehicles." },
  // Trips
  { key: "dispatch.manage", label: "Manage Dispatch", category: "Operations", description: "Authorise dispatches and monitor active routes." },
  { key: "trips.manage", label: "Manage Trips", category: "Operations", description: "Register and control fleet trip schedules." },
  { key: "trips.view_own", label: "View Own Trips", category: "Operations", description: "Restricted to viewing trips explicitly assigned to current user." },
  // Maintenance
  { key: "maintenance.view", label: "View Maintenance", category: "Maintenance", description: "Read-only access to requests and work orders." },
  { key: "maintenance.approve", label: "Approve Maintenance", category: "Maintenance", description: "Authorize maintenance requests and trigger work orders." },
  { key: "maintenance.request", label: "Request Maintenance", category: "Maintenance", description: "Submit repair requests for broken or malfunctioning components." },
  { key: "work_orders.manage", label: "Manage Work Orders", category: "Maintenance", description: "Create and update parts, mechanics, and completion dates." },
  // Fuel
  { key: "fuel.view", label: "View Fuel Logs", category: "Fuel", description: "View monthly consumption metrics and station fill records." },
  { key: "fuel.approve", label: "Approve Refills", category: "Fuel", description: "Approve requests for fuel purchases." },
  { key: "fuel.request", label: "Request Fuel", category: "Fuel", description: "Submit fuel refill slip requests." },
  // Transport Requests
  { key: "transport_requests.view", label: "View Transport Requests", category: "Requests", description: "View all user field trips and pool requests." },
  { key: "transport_requests.create", label: "Create Requests", category: "Requests", description: "Submit field trip requests for approvals." },
  { key: "transport_requests.approve", label: "Approve Requests", category: "Requests", description: "Authorize regional field trips and lowlands projects requests." },
  // Incidents
  { key: "incidents.view", label: "View Incidents", category: "Incidents", description: "Track reports, damage claims, and insurance processing." },
  { key: "incidents.create", label: "Report Incidents", category: "Incidents", description: "File new traffic accidents or vehicle defect reports." },
  // Reports
  { key: "reports.view", label: "View Reports", category: "Analytics", description: "Access analytics dashboard metrics." },
  { key: "reports.generate", label: "Generate Reports", category: "Analytics", description: "Download CSV, Excel, and PDF reports." },
  // Users
  { key: "users.view", label: "View User Registry", category: "System", description: "View system account listing." },
  { key: "system.monitor", label: "System Monitor", category: "System", description: "Access system health checks." },
]

export default function AdministrationPage() {
  const { rolePermissions, togglePermission, resetPermissions } = useRoleStore()

  const handleToggle = (role: UserRole, permission: string) => {
    if (role === "super_admin") return // superadmin always has all permissions
    togglePermission(role, permission)
    toast.success("Permission policy updated")
  }

  const handleReset = () => {
    resetPermissions()
    toast.success("All permission policies reset to system defaults")
  }

  // Group permissions by category
  const categories = Array.from(new Set(permissionsList.map((p) => p.category)))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role Management & Access Policies"
        description="Configure granular system permissions, feature access rights, and security policies."
        action={
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Defaults
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Permissions Matrix</CardTitle>
          <CardDescription>
            Map capabilities across active system user roles. Super Admin policies are wildcarded and cannot be disabled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Capability Name</TableHead>
                  {Object.entries(ROLE_LABELS).map(([key, label]) => (
                    <TableHead key={key} className="text-center min-w-[120px]">
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <React.Fragment key={category}>
                    <TableRow className="bg-muted/40 font-semibold text-muted-foreground">
                      <TableCell colSpan={Object.keys(ROLE_LABELS).length + 1} className="py-2">
                        {category}
                      </TableCell>
                    </TableRow>
                    {permissionsList
                      .filter((p) => p.category === category)
                      .map((perm) => (
                        <TableRow key={perm.key} className="hover:bg-accent/30 transition-colors">
                          <TableCell className="py-3">
                            <div className="font-medium">{perm.label}</div>
                            <div className="text-xs text-muted-foreground max-w-[280px]">
                              {perm.description}
                            </div>
                          </TableCell>
                          {Object.keys(ROLE_LABELS).map((roleKey) => {
                            const role = roleKey as UserRole
                            const isSuperAdmin = role === "super_admin"
                            const perms = rolePermissions[role] || []
                            const hasPerm = isSuperAdmin || perms.includes("*") || perms.includes(perm.key)

                            return (
                              <TableCell key={roleKey} className="text-center py-3">
                                <div className="flex justify-center items-center">
                                  <Checkbox
                                    checked={hasPerm}
                                    disabled={isSuperAdmin}
                                    onCheckedChange={() => handleToggle(role, perm.key)}
                                    aria-label={`Toggle ${perm.label} for ${ROLE_LABELS[role]}`}
                                  />
                                </div>
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
