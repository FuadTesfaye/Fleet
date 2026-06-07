"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Company } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2, ShieldAlert } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCompanyStore } from "@/store/company.store"
import { toast } from "sonner"

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: "Company Name",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "type",
    header: "Node Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return <span className="capitalize">{type.replace("_", " ")}</span>
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("isActive") as boolean
      return <StatusBadge status={active ? "active" : "out_of_service"} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const company = row.original
      const { deleteCompany, toggleCompanyStatus } = useCompanyStore.getState()

      const handleDelete = () => {
        deleteCompany(company.id)
        toast.success("Company node deleted successfully")
      }

      const handleToggle = () => {
        toggleCompanyStatus(company.id)
        toast.success(`Company status updated`)
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
            <DropdownMenuItem onClick={handleToggle}>
              <ShieldAlert className="mr-2 h-4 w-4" /> Toggle Status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Node
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
