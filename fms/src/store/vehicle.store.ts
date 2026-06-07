import { create } from "zustand"
import { Vehicle, VehicleStatus } from "@/types"
import { mockVehicles } from "@/lib/mock-data"

interface VehicleState {
  vehicles: Vehicle[]
  addVehicle: (vehicle: Omit<Vehicle, "id" | "createdAt">) => void
  updateVehicle: (id: string, data: Partial<Vehicle>) => void
  deleteVehicle: (id: string) => void
  updateStatus: (id: string, status: VehicleStatus) => void
  getByStatus: (status: VehicleStatus) => Vehicle[]
  getById: (id: string) => Vehicle | undefined
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: mockVehicles,

  addVehicle: (vehicleData) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`,
      createdAt: new Date(),
    }
    set((state) => ({ vehicles: [...state.vehicles, newVehicle] }))
  },

  updateVehicle: (id, data) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...data } : v)),
    }))
  },

  deleteVehicle: (id) => {
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== id),
    }))
  },

  updateStatus: (id, status) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, status } : v)),
    }))
  },

  getByStatus: (status) => {
    return get().vehicles.filter((v) => v.status === status)
  },

  getById: (id) => {
    return get().vehicles.find((v) => v.id === id)
  },
}))
