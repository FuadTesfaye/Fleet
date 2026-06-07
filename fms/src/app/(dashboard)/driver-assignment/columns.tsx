"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Vehicle } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus } from "lucide-react"
import { useDriverStore } from "@/store/driver.store"

interface DriverAssignmentColumnProps {
  onAssign: (vehicle: Vehicle) => void
  onUnassign: (vehicle: Vehicle) => void
}

export const getColumns = ({
  onAssign,
  onUnassign,
}: DriverAssignmentColumnProps): ColumnDef<Vehicle>[] => [
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("plateNumber")}</div>,
  },
  {
    accessorFn: (row) => `${row.make} ${row.model}`,
    id: "vehicle",
    header: "Vehicle Details",
  },
  {
    accessorKey: "assignedDriverId",
    header: "Assigned Driver",
    cell: ({ row }) => {
      const driverId = row.getValue("assignedDriverId") as string
      if (!driverId) return <span className="text-muted-foreground italic text-sm">No Driver Assigned</span>

      const driver = useDriverStore.getState().getById(driverId)
      return (
        <div>
          <div className="font-medium">{driver ? driver.name : "Unknown Driver"}</div>
          {driver && <div className="text-xs text-muted-foreground">{driver.phone}</div>}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Vehicle Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    header: "Assign Actions",
    cell: ({ row }) => {
      const vehicle = row.original
      const isAssigned = !!vehicle.assignedDriverId

      return isAssigned ? (
        <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10" onClick={() => onUnassign(vehicle)}>
          <UserMinus className="w-4 h-4 mr-1.5" />
          Unassign
        </Button>
      ) : (
        <Button size="sm" onClick={() => onAssign(vehicle)}>
          <UserPlus className="w-4 h-4 mr-1.5" />
          Assign Driver
        </Button>
      )
    },
  },
]
