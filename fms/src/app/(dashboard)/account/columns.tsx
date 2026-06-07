"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User, ROLE_LABELS } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2, Power } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserStore } from "@/store/user.store"
import { toast } from "sonner"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Full Name",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as keyof typeof ROLE_LABELS
      return <span>{ROLE_LABELS[role] || role}</span>
    },
  },
  {
    accessorKey: "department",
    header: "Department / Division",
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
      const user = row.original
      const { deleteUser, toggleUserStatus } = useUserStore.getState()

      const handleDelete = () => {
        deleteUser(user.id)
        toast.success("User deleted successfully")
      }

      const handleToggle = () => {
        toggleUserStatus(user.id)
        toast.success(`User access status updated`)
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
              <Power className="mr-2 h-4 w-4" /> Toggle Active Access
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
