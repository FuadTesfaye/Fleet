import { create } from "zustand"
import { FuelLog } from "@/types"
import { mockFuelLogs } from "@/lib/mock-data"
import { startOfMonth, isAfter } from "date-fns"

interface FuelState {
  fuelLogs: FuelLog[]
  addFuelLog: (log: Omit<FuelLog, "id" | "status">) => void
  approveFuelRequest: (id: string, approverId: string) => void
  rejectFuelRequest: (id: string) => void
  totalCostThisMonth: () => number
  avgConsumption: () => number // simple average L/100km
}

export const useFuelStore = create<FuelState>((set, get) => ({
  fuelLogs: mockFuelLogs,

  addFuelLog: (logData) => {
    const newLog: FuelLog = {
      ...logData,
      id: `fuel-${Date.now()}`,
      status: "pending",
    }
    set((state) => ({ fuelLogs: [newLog, ...state.fuelLogs] }))
  },

  approveFuelRequest: (id, approverId) => {
    set((state) => ({
      fuelLogs: state.fuelLogs.map((log) =>
        log.id === id ? { ...log, status: "approved", approvedById: approverId } : log
      ),
    }))
  },

  rejectFuelRequest: (id) => {
    set((state) => ({
      fuelLogs: state.fuelLogs.map((log) =>
        log.id === id ? { ...log, status: "rejected" } : log
      ),
    }))
  },

  totalCostThisMonth: () => {
    const startOfCurrentMonth = startOfMonth(new Date())
    return get()
      .fuelLogs.filter(
        (log) =>
          log.status === "completed" && isAfter(new Date(log.date), startOfCurrentMonth)
      )
      .reduce((sum, log) => sum + log.totalCost, 0)
  },

  avgConsumption: () => {
    // simplified: just average out all completed logs that have a reasonable L/100km assumption based on our mock data
    const completed = get().fuelLogs.filter((log) => log.status === "completed")
    if (completed.length === 0) return 0
    // L/100km = (liters / distance) * 100.
    // Our mock data doesn't perfectly link fills to distance, so we'll do a mock average
    // typical SUV/truck is 10-15L/100km. Let's base it on fuel type
    const totalLiters = completed.reduce((sum, log) => sum + log.liters, 0)
    // Assume each fill was for roughly 500km
    const estimatedDistance = completed.length * 500
    return (totalLiters / estimatedDistance) * 100
  },
}))
