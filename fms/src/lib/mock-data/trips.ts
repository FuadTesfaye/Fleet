import { Trip } from "@/types"

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const locations = [
  "Addis Ababa HQ",
  "Adama Office",
  "Hawassa Branch",
  "Bahir Dar Office",
  "Mekelle Branch",
  "Dire Dawa Office",
  "Jimma Field Station",
  "Gondar Office",
  "Gambella Field Station",
  "Arba Minch Branch",
  "Semera Field Office",
  "Jijiga Branch",
]

const purposes = [
  "Irrigation project site inspection",
  "Lowlands development assessment",
  "Field equipment delivery",
  "Staff transfer to regional office",
  "Water management survey",
  "Community stakeholder meeting",
  "Emergency flood response",
  "Equipment maintenance delivery",
  "Agricultural extension visit",
  "Dam construction progress review",
  "Official ministry meeting",
  "Training workshop transport",
  "Supply chain delivery run",
  "Environmental impact assessment",
  "River basin monitoring",
  "Seedling distribution trip",
  "Soil testing sample collection",
  "Pipeline installation support",
  "Drought assessment mission",
  "Budget consultation trip",
]

const tripStatuses: ("active" | "completed" | "cancelled")[] = [
  "completed", "completed", "completed", "completed", "completed",
  "completed", "completed", "completed", "completed", "completed",
  "completed", "completed", "completed", "completed", "completed",
  "active", "active", "active",
  "cancelled", "cancelled",
]

export const mockTrips: Trip[] = Array.from({ length: 20 }, (_, i) => {
  const startTime = randomDate(new Date("2025-09-01"), new Date("2026-06-01"))
  const status = tripStatuses[i]
  const startOdometer = 30000 + i * 2500
  const distanceKm = status === "completed" ? 50 + Math.floor(Math.random() * 400) : undefined
  const endOdometer = distanceKm ? startOdometer + distanceKm : undefined
  const fuelUsed = distanceKm ? Math.round(distanceKm * (0.1 + Math.random() * 0.05) * 10) / 10 : undefined
  const startLoc = locations[i % locations.length]
  let endLoc: string
  do {
    endLoc = locations[Math.floor(Math.random() * locations.length)]
  } while (endLoc === startLoc)

  return {
    id: `trip-${String(i + 1).padStart(3, "0")}`,
    vehicleId: `veh-${String((i % 15) + 1).padStart(3, "0")}`,
    driverId: `drv-${String((i % 15) + 1).padStart(3, "0")}`,
    transportRequestId: i < 10 ? `tr-${String(i + 1).padStart(3, "0")}` : undefined,
    startLocation: startLoc,
    endLocation: endLoc,
    startTime,
    endTime: status === "completed"
      ? new Date(startTime.getTime() + (2 + Math.random() * 10) * 60 * 60 * 1000)
      : undefined,
    startOdometer,
    endOdometer,
    distanceKm,
    fuelUsed,
    status,
    purpose: purposes[i % purposes.length],
  }
})
