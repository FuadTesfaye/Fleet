import { Incident } from "@/types"

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const incidentLocations = [
  "Bole Road, Addis Ababa",
  "Adama-Hawassa Highway Km 32",
  "Bahir Dar Ring Road",
  "Dire Dawa Industrial Zone",
  "Mekelle-Adwa Road",
  "Jimma Junction",
  "Gambella Bridge Crossing",
  "Semera Main Road",
  "Gondar-Debark Highway",
  "Awash River Bridge",
]

const descriptions = [
  "Vehicle hit a stray animal crossing the road during a night field trip. Minor front bumper damage and headlight crack. No injuries.",
  "Rear-ended by a commercial truck at a traffic light on Bole Road. Moderate trunk and bumper damage. Driver reported minor whiplash.",
  "Tire blowout on unpaved road near Afar region caused vehicle to skid and hit a roadside barrier. Underbody scraping damage.",
  "Windshield cracked by flying gravel from a construction site on the highway. No injuries but visibility compromised.",
  "Minor parking lot incident — side mirror clipped by another vehicle in the ministry compound. Cosmetic damage only.",
  "Vehicle rolled into a ditch during heavy rain near Gambella. Significant suspension and axle damage. Driver evacuated safely.",
  "Collision with a motorcycle at an unmarked intersection in Hawassa. Front fender dented, motorcycle rider treated on site.",
  "Engine fire caused by electrical short circuit during long-distance trip. Vehicle sustained severe engine compartment damage.",
  "Side-swiped by a bus on narrow road near Gondar. Paint damage and passenger door dented. No injuries reported.",
  "Flood water damage during seasonal rains. Vehicle submerged in water near Awash River. Total electrical system failure.",
]

const severities: ("minor" | "moderate" | "severe" | "total_loss")[] = [
  "minor", "moderate", "minor", "minor", "minor",
  "severe", "moderate", "severe", "moderate", "total_loss",
]

const incidentStatuses: ("pending" | "approved" | "in_progress" | "completed")[] = [
  "pending", "pending",
  "in_progress", "in_progress",
  "approved", "approved",
  "completed", "completed", "completed", "completed",
]

export const mockIncidents: Incident[] = Array.from({ length: 10 }, (_, i) => {
  const severity = severities[i]
  const insuranceClaimed = severity !== "minor"
  const claimAmounts: Record<string, number> = {
    minor: 0,
    moderate: 15000 + Math.floor(Math.random() * 35000),
    severe: 80000 + Math.floor(Math.random() * 120000),
    total_loss: 500000 + Math.floor(Math.random() * 1500000),
  }

  return {
    id: `inc-${String(i + 1).padStart(3, "0")}`,
    vehicleId: `veh-${String((i % 15) + 1).padStart(3, "0")}`,
    driverId: `drv-${String((i % 15) + 1).padStart(3, "0")}`,
    incidentDate: randomDate(new Date("2025-06-01"), new Date("2026-05-30")),
    location: incidentLocations[i],
    description: descriptions[i],
    severity,
    reportedById: `usr-${String((i % 5) + 4).padStart(3, "0")}`,
    insuranceClaimed,
    insuranceClaimAmount: insuranceClaimed ? claimAmounts[severity] : undefined,
    status: incidentStatuses[i],
    attachments: [],
  }
})
