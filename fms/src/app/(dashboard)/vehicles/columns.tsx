"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Vehicle } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("plateNumber")}</div>,
  },
  {
    accessorFn: (row) => `${row.make} ${row.model}`,
    id: "vehicle",
    header: "Vehicle",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "fuelType",
    header: "Fuel Type",
    cell: ({ row }) => <div className="capitalize">{row.getValue("fuelType")}</div>,
  },
  {
    accessorKey: "odometerKm",
    header: "Odometer (km)",
    cell: ({ row }) => <div>{Number(row.getValue("odometerKm")).toLocaleString()} km</div>,
  },
  {
    accessorKey: "location",
    header: "Current Location",
    cell: ({ row }) => {
      const location = row.original.location
      return <div className="max-w-[200px] truncate" title={location.address}>{location.address}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vehicle = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(vehicle.id)}>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit Vehicle
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
