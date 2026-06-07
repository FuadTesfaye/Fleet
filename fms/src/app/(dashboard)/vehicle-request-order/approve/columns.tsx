"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TransportRequest } from "@/types"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useUserStore } from "@/store/user.store"

interface ApproveColumnsProps {
  onApprove: (request: TransportRequest) => void
  onReject: (request: TransportRequest) => void
}

export const getColumns = ({
  onApprove,
  onReject,
}: ApproveColumnsProps): ColumnDef<TransportRequest>[] => [
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
    header: "Travel Dates",
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
    id: "actions",
    header: "Review Decision",
    cell: ({ row }) => {
      const request = row.original

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
