"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TransportRequest } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { useUserStore } from "@/store/user.store"

export const columns: ColumnDef<TransportRequest>[] = [
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
    cell: ({ row }) => <div className="font-medium max-w-[200px] truncate" title={row.getValue("purpose")}>{row.getValue("purpose")}</div>,
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
    accessorKey: "requestType",
    header: "Type",
    cell: ({ row }) => <span className="capitalize">{row.getValue("requestType")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
]
