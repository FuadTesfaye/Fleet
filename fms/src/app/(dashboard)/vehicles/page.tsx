"use client"

import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { columns } from "./columns"
import { useVehicleStore } from "@/store/vehicle.store"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { usePermission } from "@/lib/permissions"

export default function VehiclesPage() {
  const vehicles = useVehicleStore((s) => s.vehicles)
  const canCreate = usePermission("vehicles.create")

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Fleet Vehicles" 
        description="Manage all registered vehicles, status, and assignments."
        action={
          canCreate ? (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          ) : null
        }
      />

      <DataTable 
        columns={columns} 
        data={vehicles} 
        searchKey="plateNumber" 
        searchPlaceholder="Search by plate number..." 
      />
    </div>
  )
}
