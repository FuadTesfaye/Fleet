import { create } from "zustand"
import { MaintenanceRequest, WorkOrder, SparePart } from "@/types"
import { mockMaintenanceRequests, mockWorkOrders, mockSpareParts } from "@/lib/mock-data"

interface MaintenanceState {
  maintenanceRequests: MaintenanceRequest[]
  workOrders: WorkOrder[]
  spareParts: SparePart[]
  replacedItems: SparePart[] // those with isReplaced = true

  addRequest: (req: Omit<MaintenanceRequest, "id" | "status">) => void
  approveRequest: (id: string) => void
  rejectRequest: (id: string) => void
  createWorkOrder: (wo: Omit<WorkOrder, "id" | "status" | "createdAt">) => void
  closeWorkOrder: (id: string, actualCompletionDate: Date) => void
  addSparePart: (part: Omit<SparePart, "id">) => void
}

export const useMaintenanceStore = create<MaintenanceState>((set, get) => ({
  maintenanceRequests: mockMaintenanceRequests,
  workOrders: mockWorkOrders,
  spareParts: mockSpareParts,
  replacedItems: mockSpareParts.filter((p) => p.isReplaced),

  addSparePart: (partData) => {
    const newPart: SparePart = {
      ...partData,
      id: `sp-${Date.now()}`,
    }
    set((state) => ({ spareParts: [newPart, ...state.spareParts] }))
  },

  addRequest: (reqData) => {
    const newReq: MaintenanceRequest = {
      ...reqData,
      id: `mr-${Date.now()}`,
      status: "pending",
    }
    set((state) => ({ maintenanceRequests: [newReq, ...state.maintenanceRequests] }))
  },

  approveRequest: (id) => {
    set((state) => ({
      maintenanceRequests: state.maintenanceRequests.map((r) =>
        r.id === id ? { ...r, status: "approved" } : r
      ),
    }))
  },

  rejectRequest: (id) => {
    set((state) => ({
      maintenanceRequests: state.maintenanceRequests.map((r) =>
        r.id === id ? { ...r, status: "rejected" } : r
      ),
    }))
  },

  createWorkOrder: (woData) => {
    const newWo: WorkOrder = {
      ...woData,
      id: `wo-${Date.now()}`,
      status: "in_progress",
      createdAt: new Date(),
    }
    set((state) => ({
      workOrders: [newWo, ...state.workOrders],
      maintenanceRequests: state.maintenanceRequests.map((r) =>
        r.id === woData.maintenanceRequestId
          ? { ...r, status: "in_progress", workOrderId: newWo.id }
          : r
      ),
      spareParts: [...woData.spareParts, ...state.spareParts],
    }))
  },

  closeWorkOrder: (id, actualCompletionDate) => {
    set((state) => {
      const wo = state.workOrders.find((w) => w.id === id)
      if (!wo) return state

      return {
        workOrders: state.workOrders.map((w) =>
          w.id === id ? { ...w, status: "completed", actualCompletionDate } : w
        ),
        maintenanceRequests: state.maintenanceRequests.map((r) =>
          r.id === wo.maintenanceRequestId
            ? { ...r, status: "completed", completedDate: actualCompletionDate, maintenanceCost: wo.totalCost }
            : r
        ),
      }
    })
  },
}))
