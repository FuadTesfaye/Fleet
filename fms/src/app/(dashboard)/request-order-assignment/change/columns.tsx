"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TransportRequest } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"
import { useUserStore } from "@/store/user.store"
import { useVehicleStore } from "@/store/vehicle.store"
import { useDriverStore } from "@/store/driver.store"

interface ChangeColumnsProps {
  onChange: (request: TransportRequest) => void
}

export const getColumns = ({
  onChange,
}: ChangeColumnsProps): ColumnDef<TransportRequest>[] => [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "requestedById",
    header: "Requested By",
    cell: ({ row }) => {
      const userId = row.getValue("requestedById") as string
      const user = useUserStore.getState().getById(userId)
      return (
        <div>
          <div className="font-semibold">{user ? user.name : "Unknown Employee"}</div>
          {user && <div className="text-xs text-muted-foreground">{user.department}</div>}
        </div>
      )
    },
  },
  {
    accessorKey: "destination",
    header: "Destination",
  },
  {
    accessorKey: "assignedVehicleId",
    header: "Current Vehicle",
    cell: ({ row }) => {
      const vehicleId = row.getValue("assignedVehicleId") as string
      if (!vehicleId) return <span className="text-muted-foreground italic text-xs">None</span>
      const vehicle = useVehicleStore.getState().getById(vehicleId)
      return vehicle ? `${vehicle.plateNumber} (${vehicle.make})` : "Unknown Vehicle"
    },
  },
  {
    accessorKey: "assignedDriverId",
    header: "Current Driver",
    cell: ({ row }) => {
      const driverId = row.getValue("assignedDriverId") as string
      if (!driverId) return <span className="text-muted-foreground italic text-xs">None</span>
      const driver = useDriverStore.getState().getById(driverId)
      return driver ? driver.name : "Unknown Driver"
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const request = row.original

      return (
        <Button variant="outline" size="sm" onClick={() => onChange(request)}>
          <Edit2 className="w-4 h-4 mr-1.5" />
          Change Assignment
        </Button>
      )
    },
  },
]
