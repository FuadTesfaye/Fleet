import { create } from "zustand"
import { Driver } from "@/types"
import { mockDrivers } from "@/lib/mock-data"

interface DriverState {
  drivers: Driver[]
  addDriver: (driver: Omit<Driver, "id" | "totalTrips" | "totalKm" | "violations" | "performance" | "isActive">) => void
  updateDriver: (id: string, data: Partial<Driver>) => void
  getById: (id: string) => Driver | undefined
  getAvailable: () => Driver[]
}

export const useDriverStore = create<DriverState>((set, get) => ({
  drivers: mockDrivers,

  addDriver: (driverData) => {
    const newDriver: Driver = {
      ...driverData,
      id: `drv-${Date.now()}`,
      totalTrips: 0,
      totalKm: 0,
      violations: 0,
      performance: 100,
      isActive: true,
    }
    set((state) => ({ drivers: [...state.drivers, newDriver] }))
  },

  updateDriver: (id, data) => {
    set((state) => ({
      drivers: state.drivers.map((d) => (d.id === id ? { ...d, ...data } : d)),
    }))
  },

  getById: (id) => {
    return get().drivers.find((d) => d.id === id)
  },

  getAvailable: () => {
    return get().drivers.filter((d) => !d.assignedVehicleId && d.isActive)
  },
}))
