"use client"

import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { columns } from "./columns"
import { useVehicles } from "@/hooks/use-vehicles"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { usePermission } from "@/lib/permissions"

export default function VehiclesPage() {
  const { data: vehicles = [], isLoading } = useVehicles()
  const canCreate = usePermission("vehicles.create")

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

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
