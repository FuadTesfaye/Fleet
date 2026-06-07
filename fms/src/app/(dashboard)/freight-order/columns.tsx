"use client"

import { ColumnDef } from "@tanstack/react-table"
import { FreightOrder } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Truck, CheckCircle } from "lucide-react"
import { useFreightStore } from "@/store/freight.store"
import { useVehicleStore } from "@/store/vehicle.store"

interface FreightOrderColumnsProps {
  onAssign: (order: FreightOrder) => void
  onComplete: (order: FreightOrder) => void
}

export const getColumns = ({
  onAssign,
  onComplete,
}: FreightOrderColumnsProps): ColumnDef<FreightOrder>[] => [
  {
    accessorKey: "orderNumber",
    header: "Order Number",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("orderNumber")}</div>,
  },
  {
    accessorKey: "shipperId",
    header: "Shipper",
    cell: ({ row }) => {
      const id = row.getValue("shipperId") as string
      const shipper = useFreightStore.getState().shippers.find((s) => s.id === id)
      return <span>{shipper ? shipper.name : "Unknown"}</span>
    },
  },
  {
    accessorKey: "consigneeId",
    header: "Consignee",
    cell: ({ row }) => {
      const id = row.getValue("consigneeId") as string
      const consignee = useFreightStore.getState().consignees.find((c) => c.id === id)
      return <span>{consignee ? consignee.name : "Unknown"}</span>
    },
  },
  {
    accessorKey: "commodityId",
    header: "Cargo Type",
    cell: ({ row }) => {
      const id = row.getValue("commodityId") as string
      const comm = useFreightStore.getState().commodities.find((c) => c.id === id)
      return <span className="font-mono text-xs">{comm ? comm.name : "Unknown"}</span>
    },
  },
  {
    accessorKey: "weightTons",
    header: "Weight",
    cell: ({ row }) => <span>{row.getValue("weightTons")} Tons</span>,
  },
  {
    accessorKey: "destination",
    header: "Route Corridor",
    cell: ({ row }) => (
      <div className="text-sm">
        <div>From: {row.original.origin}</div>
        <div className="text-xs text-muted-foreground">To: {row.original.destination}</div>
      </div>
    ),
  },
  {
    accessorKey: "assignedVehicleId",
    header: "Assigned Truck",
    cell: ({ row }) => {
      const id = row.getValue("assignedVehicleId") as string
      if (!id) return <span className="text-muted-foreground italic text-xs">Unassigned</span>
      const vehicle = useVehicleStore.getState().getById(id)
      return vehicle ? `${vehicle.plateNumber} (${vehicle.make})` : "Unknown Truck"
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
      const order = row.original

      if (order.status === "pending") {
        return (
          <Button size="sm" onClick={() => onAssign(order)}>
            <Truck className="w-4 h-4 mr-1.5" />
            Assign Truck
          </Button>
        )
      }

      if (order.status === "dispatched") {
        return (
          <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600/10" onClick={() => onComplete(order)}>
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Confirm Delivery
          </Button>
        )
      }

      return <span className="text-xs text-muted-foreground">Completed</span>
    },
  },
]
