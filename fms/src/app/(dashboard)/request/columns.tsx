"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TransportRequest } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useRequestStore } from "@/store/request.store"
import { toast } from "sonner"

export const columns: ColumnDef<TransportRequest>[] = [
  {
    accessorKey: "id",
    header: "Request ID",
  },
  {
    accessorKey: "purpose",
    header: "Purpose / Mission",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("purpose")}</div>,
  },
  {
    accessorKey: "destination",
    header: "Destination",
  },
  {
    accessorKey: "departureDate",
    header: "Departure",
    cell: ({ row }) => new Date(row.getValue("departureDate")).toLocaleDateString(),
  },
  {
    accessorKey: "returnDate",
    header: "Return Date",
    cell: ({ row }) => new Date(row.getValue("returnDate")).toLocaleDateString(),
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const request = row.original
      if (request.status !== "in_progress") return null

      return (
        <CompleteButton requestId={request.id} />
      )
    },
  },
]

function CompleteButton({ requestId }: { requestId: string }) {
  const completeRequest = useRequestStore((s) => s.completeRequest)

  return (
    <Button 
      size="sm" 
      variant="outline" 
      className="text-green-600 border-green-600 hover:bg-green-50"
      onClick={() => {
        completeRequest(requestId)
        toast.success("Trip marked as completed")
      }}
    >
      <CheckCircle className="w-4 h-4 mr-2" />
      Complete Trip
    </Button>
  )
}
