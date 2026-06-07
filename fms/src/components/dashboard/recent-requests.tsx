"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMaintenanceStore } from "@/store/maintenance.store"
import { format } from "date-fns"
import { StatusBadge } from "@/components/shared/status-badge"
import { useVehicleStore } from "@/store/vehicle.store"

export function RecentRequests() {
  const maintenanceRequests = useMaintenanceStore((s) => s.maintenanceRequests)
  const getVehicle = useVehicleStore((s) => s.getById)

  const recent = maintenanceRequests.slice(0, 5)

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Recent Maintenance</CardTitle>
        <CardDescription>Latest service requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recent.map((req) => {
            const vehicle = getVehicle(req.vehicleId)
            return (
              <div key={req.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="font-medium text-sm">
                    {vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})` : "Unknown Vehicle"}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{req.issueDescription}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(req.requestDate), "MMM dd, yyyy")}</p>
                </div>
                <StatusBadge status={req.status} />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
