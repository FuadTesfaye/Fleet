import { TransportRequest } from "@/types"
import { createRNG } from "./rng"

const rng = createRNG(105)

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + rng() * (end.getTime() - start.getTime()))
}

const purposes = [
  "Field visit to Koga Irrigation Dam site for progress inspection",
  "Staff transport to Tendaho Sugar Factory for coordination meeting",
  "Equipment delivery to Awash River Basin monitoring station",
  "Official meeting at Regional Water Bureau in Bahir Dar",
  "Site assessment for new irrigation canal in Afar Region",
  "Training workshop transport for agricultural extension workers",
  "Emergency response vehicle for flood-affected area in Gambella",
  "Supply delivery to Omo-Kuraz Sugar Development Project",
  "Stakeholder consultation meeting in Dire Dawa",
  "Environmental impact assessment field visit near Lake Tana",
  "Transport for international donor delegation site visit",
  "Seedling distribution to lowland farming communities",
  "Soil and water sample collection from Wabi Shebelle Basin",
  "Construction supervision trip to Genale Dawa Dam",
  "Ministry coordination meeting at Federal Government Office",
  "Community engagement session in pastoral lowland area",
  "Infrastructure inspection for micro-irrigation projects",
  "Cross-regional transport for policy briefing in Hawassa",
  "Vehicle pool request for staff commute to satellite office",
  "Field photography and documentation trip for annual report",
  "Training material delivery to regional capacity building center",
  "Monitoring and evaluation field visit to completed projects",
  "Budget review meeting transport to Ministry of Finance",
  "Emergency parts delivery for broken-down field vehicle",
  "Official transport for visiting government officials",
]

const destinations = [
  "Koga Dam, Amhara Region",
  "Tendaho, Afar Region",
  "Awash Station, Afar",
  "Bahir Dar, Amhara",
  "Dubti, Afar Region",
  "Adama Training Center",
  "Gambella Town",
  "Omo-Kuraz, SNNPR",
  "Dire Dawa",
  "Lake Tana Area",
  "Addis Ababa (Bole)",
  "Jinka, SNNPR",
  "Gode, Somali Region",
  "Genale Dawa, Oromia",
  "Addis Ababa (Arat Kilo)",
  "Jijiga, Somali Region",
  "Mekelle, Tigray",
  "Hawassa, Sidama",
  "Addis Ababa (Mexico)",
  "Dessie, Amhara",
  "Arba Minch, SNNPR",
  "Nekemte, Oromia",
  "Addis Ababa (Kazanchis)",
  "Adama, Oromia",
  "Semera, Afar",
]

const trStatuses: ("pending" | "approved" | "rejected" | "completed" | "in_progress")[] = [
  "pending", "pending", "pending", "pending", "pending",
  "approved", "approved", "approved", "approved", "approved",
  "rejected", "rejected",
  "completed", "completed", "completed", "completed", "completed",
  "in_progress", "in_progress", "in_progress",
  "approved", "pending", "completed", "approved", "rejected",
]

export const mockTransportRequests: TransportRequest[] = Array.from({ length: 25 }, (_, i) => {
  const requestDate = randomDate(new Date("2025-10-01"), new Date("2026-06-01"))
  const departureDate = new Date(requestDate.getTime() + (1 + rng() * 7) * 24 * 60 * 60 * 1000)
  const returnDate = new Date(departureDate.getTime() + (1 + rng() * 5) * 24 * 60 * 60 * 1000)
  const status = trStatuses[i]
  const isAssigned = status === "approved" || status === "in_progress" || status === "completed"

  return {
    id: `tr-${String(i + 1).padStart(3, "0")}`,
    requestedById: `usr-${String((i % 8) + 1).padStart(3, "0")}`,
    requestDate,
    purpose: purposes[i % purposes.length],
    destination: destinations[i % destinations.length],
    departureDate,
    returnDate,
    requestType: i % 3 === 0 ? "pool" as const : "field" as const,
    status,
    approvedByManagerId: status !== "pending" ? "usr-002" : undefined,
    approvedByHeadId: (status === "approved" || status === "completed") ? "usr-003" : undefined,
    assignedVehicleId: isAssigned ? `veh-${String((i % 15) + 1).padStart(3, "0")}` : undefined,
    assignedDriverId: isAssigned ? `drv-${String((i % 15) + 1).padStart(3, "0")}` : undefined,
  }
})
