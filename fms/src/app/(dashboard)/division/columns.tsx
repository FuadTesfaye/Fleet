"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Department } from "@/types"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDivisionStore } from "@/store/division.store"
import { toast } from "sonner"

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: "name",
    header: "Division Name",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "code",
    header: "Division Code",
    cell: ({ row }) => <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-sm">{row.getValue("code")}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const division = row.original
      const { deleteDivision } = useDivisionStore.getState()

      const handleDelete = () => {
        deleteDivision(division.id)
        toast.success("Division deleted successfully")
      }

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
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Division
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
