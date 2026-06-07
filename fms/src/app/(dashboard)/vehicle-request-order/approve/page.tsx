"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/shared/data-table"
import { getColumns } from "./columns"
import { useRequestStore } from "@/store/request.store"
import { useAuthStore } from "@/store/auth.store"
import { toast } from "sonner"

export default function RequestApprovalPage() {
  const requests = useRequestStore((s) => s.requests)
  const approveRequest = useRequestStore((s) => s.approveRequestByManager)
  const rejectRequest = useRequestStore((s) => s.rejectRequest)
  const user = useAuthStore((s) => s.user)

  const pendingRequests = React.useMemo(() => {
    return requests.filter((r) => r.status === "pending")
  }, [requests])

  const handleApprove = (req: any) => {
    if (!user) return
    approveRequest(req.id, user.id)
    toast.success(`Request ${req.id} approved successfully`)
  }

  const handleReject = (req: any) => {
    if (!user) return
    rejectRequest(req.id, user.id)
    toast.success(`Request ${req.id} declined`)
  }

  const columns = getColumns({
    onApprove: handleApprove,
    onReject: handleReject,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Request Approval"
        description="Verify, sign off, or decline pending vehicle request orders for department travel."
      />

      <DataTable
        columns={columns}
        data={pendingRequests}
        searchKey="destination"
        searchPlaceholder="Search by destination..."
      />
    </div>
  )
}
