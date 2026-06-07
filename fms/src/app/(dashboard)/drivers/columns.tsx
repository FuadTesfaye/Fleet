"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Driver } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"

export const columns: ColumnDef<Driver>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "licenseNumber",
    header: "License Number",
  },
  {
    accessorKey: "licenseClass",
    header: "Class",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("licenseClass")}</div>,
  },
  {
    accessorKey: "licenseExpiryDate",
    header: "License Expiry",
    cell: ({ row }) => {
      const date = new Date(row.getValue("licenseExpiryDate"))
      const isExpired = date < new Date()
      return (
        <div className={isExpired ? "text-destructive font-medium" : ""}>
          {format(date, "MMM dd, yyyy")}
        </div>
      )
    },
  },
  {
    accessorKey: "performance",
    header: "Performance Score",
    cell: ({ row }) => {
      const score = Number(row.getValue("performance"))
      return (
        <div className={
          score >= 90 ? "text-emerald-600 font-semibold" :
          score >= 75 ? "text-amber-600 font-semibold" : "text-destructive font-semibold"
        }>
          {score}%
        </div>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("isActive") ? "active" : "out_of_service"} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit Driver
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
