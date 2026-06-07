import { create } from "zustand"
import { TransportRequest } from "@/types"
import { mockTransportRequests } from "@/lib/mock-data"
import { useVehicleStore } from "./vehicle.store"
import { useDriverStore } from "./driver.store"

interface RequestState {
  requests: TransportRequest[]
  addRequest: (req: Omit<TransportRequest, "id" | "requestDate" | "status">) => void
  updateRequest: (id: string, data: Partial<TransportRequest>) => void
  approveRequestByManager: (id: string, managerId: string) => void
  approveRequestByHead: (id: string, headId: string) => void
  rejectRequest: (id: string, managerId: string) => void
  assignVehicleAndDriver: (id: string, vehicleId: string, driverId: string) => void
  getById: (id: string) => TransportRequest | undefined
}

export const useRequestStore = create<RequestState>()((set, get) => ({
  requests: mockTransportRequests,

  addRequest: (reqData) => {
    const newRequest: TransportRequest = {
      ...reqData,
      id: `tr-${String(get().requests.length + 1).padStart(3, "0")}`,
      requestDate: new Date(),
      status: "pending",
    }
    set((state) => ({ requests: [newRequest, ...state.requests] }))
  },

  updateRequest: (id, data) => {
    set((state) => ({
      requests: state.requests.map((r) => (r.id === id ? { ...r, ...data } : r)),
    }))
  },

  approveRequestByManager: (id, managerId) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id ? { ...r, status: "approved", approvedByManagerId: managerId } : r
      ),
    }))
  },

  approveRequestByHead: (id, headId) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "approved",
              approvedByHeadId: headId,
            }
          : r
      ),
    }))
  },

  rejectRequest: (id, managerId) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "rejected",
              approvedByManagerId: managerId,
            }
          : r
      ),
    }))
  },

  assignVehicleAndDriver: (id, vehicleId, driverId) => {
    // Update request state
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "in_progress",
              assignedVehicleId: vehicleId,
              assignedDriverId: driverId,
            }
          : r
      ),
    }))

    // Update vehicle assignment and status
    useVehicleStore.getState().updateVehicle(vehicleId, {
      assignedDriverId: driverId,
      status: "active",
    })

    // Update driver assignment
    useDriverStore.getState().updateDriver(driverId, {
      assignedVehicleId: vehicleId,
    })
  },

  getById: (id) => get().requests.find((r) => r.id === id),
}))
