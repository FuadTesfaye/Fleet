"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TransportRequest } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"

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
]
