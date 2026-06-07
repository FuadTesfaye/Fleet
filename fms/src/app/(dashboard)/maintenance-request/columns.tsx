"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MaintenanceRequest } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useVehicleStore } from "@/store/vehicle.store"

interface MaintenanceRequestColumnsProps {
  onApprove: (request: MaintenanceRequest) => void
  onReject: (request: MaintenanceRequest) => void
}

export const getColumns = ({
  onApprove,
  onReject,
}: MaintenanceRequestColumnsProps): ColumnDef<MaintenanceRequest>[] => [
  {
    accessorKey: "id",
    header: "Request ID",
  },
  {
    accessorKey: "vehicleId",
    header: "Vehicle Plate",
    cell: ({ row }) => {
      const id = row.getValue("vehicleId") as string
      const vehicle = useVehicleStore.getState().getById(id)
      return <span className="font-semibold">{vehicle ? vehicle.plateNumber : "Unknown"}</span>
    },
  },
  {
    accessorKey: "description",
    header: "Issue Description",
    cell: ({ row }) => <div className="font-medium max-w-[200px] truncate" title={row.getValue("description")}>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "urgency",
    header: "Urgency",
    cell: ({ row }) => {
      const urgency = row.getValue("urgency") as string
      const color =
        urgency === "high" || urgency === "critical"
          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
          : urgency === "medium"
          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
          : "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
      return (
        <span className={`text-xs px-2 py-0.5 rounded font-semibold capitalize ${color}`}>
          {urgency}
        </span>
      )
    },
  },
  {
    accessorKey: "maintenanceCost",
    header: "Maintenance Cost",
    cell: ({ row }) => {
      const cost = row.getValue("maintenanceCost") as number
      return <span>{cost ? `ETB ${cost.toLocaleString()}` : "—"}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    header: "Decision Actions",
    cell: ({ row }) => {
      const request = row.original
      const isPending = request.status === "pending"

      if (!isPending) return <span className="text-xs text-muted-foreground italic">Processed</span>

      return (
        <div className="flex gap-2">
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onApprove(request)}>
            <Check className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10" onClick={() => onReject(request)}>
            <X className="w-4 h-4 mr-1" />
            Decline
          </Button>
        </div>
      )
    },
  },
]
