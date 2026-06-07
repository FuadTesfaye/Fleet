"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Trip } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { format } from "date-fns"
import { useVehicleStore } from "@/store/vehicle.store"
import { useDriverStore } from "@/store/driver.store"

export const columns: ColumnDef<Trip>[] = [
  {
    accessorKey: "id",
    header: "Trip ID",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "vehicleId",
    header: "Vehicle",
    cell: ({ row }) => {
      // Use the store hook directly here since columns can be a React component
      // However, it's usually better to map this data before passing to DataTable.
      // For simplicity in this demo, we'll fetch from the store inside the cell.
      const getVehicle = useVehicleStore((s) => s.getById)
      const vehicle = getVehicle(row.getValue("vehicleId"))
      return (
        <div>
          <span className="font-medium">{vehicle?.plateNumber || row.getValue("vehicleId")}</span>
          <span className="text-xs text-muted-foreground block">{vehicle?.make} {vehicle?.model}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "driverId",
    header: "Driver",
    cell: ({ row }) => {
      const getDriver = useDriverStore((s) => s.getById)
      const driver = getDriver(row.getValue("driverId"))
      return (
        <div>
          <span className="font-medium">{driver?.name || row.getValue("driverId")}</span>
          <span className="text-xs text-muted-foreground block">{driver?.phone}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
    cell: ({ row }) => <div className="max-w-[200px] truncate" title={row.getValue("purpose")}>{row.getValue("purpose")}</div>,
  },
  {
    accessorFn: (row) => `${row.startLocation} to ${row.endLocation}`,
    id: "route",
    header: "Route",
    cell: ({ row }) => {
      const trip = row.original
      return (
        <div className="text-sm">
          <span className="block truncate max-w-[150px]">{trip.startLocation}</span>
          <span className="text-muted-foreground block text-xs">to {trip.endLocation}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "startTime",
    header: "Departure",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startTime"))
      return (
        <div className="text-sm">
          {format(date, "MMM dd, yyyy")}
          <span className="text-muted-foreground block text-xs">{format(date, "h:mm a")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
]
