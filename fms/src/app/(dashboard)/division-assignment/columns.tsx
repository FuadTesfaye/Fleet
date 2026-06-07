"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Vehicle } from "@/types"
import { Button } from "@/components/ui/button"
import { Building } from "lucide-react"
import { useDivisionStore } from "@/store/division.store"

interface DivisionAssignmentColumnProps {
  onReallocate: (vehicle: Vehicle) => void
}

export const getColumns = ({
  onReallocate,
}: DivisionAssignmentColumnProps): ColumnDef<Vehicle>[] => [
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("plateNumber")}</div>,
  },
  {
    accessorFn: (row) => `${row.make} ${row.model}`,
    id: "vehicle",
    header: "Vehicle Details",
  },
  {
    accessorKey: "departmentId",
    header: "Allocated Division",
    cell: ({ row }) => {
      const deptId = row.getValue("departmentId") as string
      const division = useDivisionStore.getState().getById(deptId)

      return (
        <div>
          <span className="font-medium">{division ? division.name : "Unassigned Division"}</span>
          {division && <span className="text-xs text-muted-foreground ml-2 font-mono">({division.code})</span>}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Allocation Actions",
    cell: ({ row }) => {
      const vehicle = row.original

      return (
        <Button variant="outline" size="sm" onClick={() => onReallocate(vehicle)}>
          <Building className="w-4 h-4 mr-1.5" />
          Reallocate Division
        </Button>
      )
    },
  },
]
