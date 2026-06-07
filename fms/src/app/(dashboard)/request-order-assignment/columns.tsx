"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TransportRequest } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Link, CheckCircle2 } from "lucide-react"
import { useUserStore } from "@/store/user.store"
import { useVehicleStore } from "@/store/vehicle.store"
import { useDriverStore } from "@/store/driver.store"

interface RequestAssignmentColumnProps {
  onAssign: (request: TransportRequest) => void
}

export const getColumns = ({
  onAssign,
}: RequestAssignmentColumnProps): ColumnDef<TransportRequest>[] => [
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
    accessorKey: "purpose",
    header: "Purpose / Mission",
    cell: ({ row }) => <div className="max-w-[200px] truncate" title={row.getValue("purpose")}>{row.getValue("purpose")}</div>,
  },
  {
    accessorKey: "destination",
    header: "Destination",
  },
  {
    accessorKey: "departureDate",
    header: "Dates",
    cell: ({ row }) => {
      const depDate = new Date(row.original.departureDate)
      const retDate = new Date(row.original.returnDate)
      return `${depDate.toLocaleDateString()} - ${retDate.toLocaleDateString()}`
    },
  },
  {
    accessorKey: "assignedVehicleId",
    header: "Vehicle",
    cell: ({ row }) => {
      const vehicleId = row.getValue("assignedVehicleId") as string
      if (!vehicleId) return <span className="text-muted-foreground italic text-xs">Unassigned</span>
      
      const vehicle = useVehicleStore.getState().getById(vehicleId)
      return (
        <div className="text-sm font-medium">
          {vehicle ? `${vehicle.plateNumber} (${vehicle.make})` : "Unknown Vehicle"}
        </div>
      )
    },
  },
  {
    accessorKey: "assignedDriverId",
    header: "Driver",
    cell: ({ row }) => {
      const driverId = row.getValue("assignedDriverId") as string
      if (!driverId) return <span className="text-muted-foreground italic text-xs">Unassigned</span>

      const driver = useDriverStore.getState().getById(driverId)
      return (
        <div className="text-sm">
          {driver ? driver.name : "Unknown Driver"}
        </div>
      )
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
      const needsAssignment = request.status === "approved" && !request.assignedVehicleId

      return needsAssignment ? (
        <Button size="sm" onClick={() => onAssign(request)}>
          <Link className="w-4 h-4 mr-1.5" />
          Assign
        </Button>
      ) : (
        <div className="flex items-center text-muted-foreground text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" />
          Ready
        </div>
      )
    },
  },
]
