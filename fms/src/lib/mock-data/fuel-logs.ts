import { FuelLog } from "@/types"

const stations = [
  "NOC Bole Station",
  "YBT Fuel Megenagna",
  "Total Energies CMC",
  "Oilibya Kality",
  "National Oil Mexico",
  "YBT Fuel Piazza",
  "Total Energies Sarbet",
  "NOC Gotera Station",
  "Oilibya Gerji",
  "National Oil Lideta",
]

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const statuses: ("approved" | "pending" | "completed")[] = [
  "approved", "approved", "approved", "approved", "completed",
  "completed", "completed", "pending", "approved", "completed",
]

export const mockFuelLogs: FuelLog[] = Array.from({ length: 60 }, (_, i) => {
  const vehicleIdx = i % 15
  const driverIdx = i % 15
  const fuelType = vehicleIdx < 10 ? "diesel" as const : "petrol" as const
  const liters = Math.floor(20 + Math.random() * 80)
  const costPerLiter = fuelType === "diesel"
    ? 65 + Math.random() * 8
    : 70 + Math.random() * 10
  const roundedCostPerLiter = Math.round(costPerLiter * 100) / 100

  return {
    id: `fuel-${String(i + 1).padStart(3, "0")}`,
    vehicleId: `veh-${String(vehicleIdx + 1).padStart(3, "0")}`,
    driverId: `drv-${String(driverIdx + 1).padStart(3, "0")}`,
    date: randomDate(new Date("2026-03-01"), new Date("2026-06-07")),
    liters,
    costPerLiter: roundedCostPerLiter,
    totalCost: Math.round(liters * roundedCostPerLiter * 100) / 100,
    odometerAtFill: 30000 + (i * 450) + Math.floor(Math.random() * 200),
    fuelType,
    station: stations[i % stations.length],
    requestedById: `usr-${String(6 + driverIdx).padStart(3, "0")}`,
    approvedById: statuses[i % statuses.length] !== "pending" ? "usr-004" : undefined,
    status: statuses[i % statuses.length],
  }
})
