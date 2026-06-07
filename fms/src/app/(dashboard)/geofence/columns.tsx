"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Geofence } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface GeofenceColumnsProps {
  onDelete: (id: string) => void
}

export const getColumns = ({
  onDelete,
}: GeofenceColumnsProps): ColumnDef<Geofence>[] => [
  {
    accessorKey: "name",
    header: "Geofence Zone Name",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "vehicleIds",
    header: "Assigned VehiclesCount",
    cell: ({ row }) => {
      const ids = row.getValue("vehicleIds") as string[]
      return <span>{ids.length} vehicle(s)</span>
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("isActive") as boolean
      return <StatusBadge status={active ? "active" : "out_of_service"} />
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const geofence = row.original
      return (
        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => onDelete(geofence.id)}>
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      )
    },
  },
]
