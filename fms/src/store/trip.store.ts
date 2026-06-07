import { create } from "zustand"
import { Trip } from "@/types"
import { mockTrips } from "@/lib/mock-data/trips"

interface TripState {
  trips: Trip[]
  getById: (id: string) => Trip | undefined
  getByVehicle: (vehicleId: string) => Trip[]
  getByDriver: (driverId: string) => Trip[]
}

export const useTripStore = create<TripState>()((set, get) => ({
  trips: mockTrips,
  
  getById: (id) => get().trips.find((t) => t.id === id),
  
  getByVehicle: (vehicleId) => get().trips.filter((t) => t.vehicleId === vehicleId),
  
  getByDriver: (driverId) => get().trips.filter((t) => t.driverId === driverId),
}))
