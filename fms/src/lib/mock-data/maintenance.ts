import { MaintenanceRequest, WorkOrder, SparePart } from "@/types"
import { createRNG } from "./rng"

const rng = createRNG(104)

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + rng() * (end.getTime() - start.getTime()))
}

const issues = [
  "Engine overheating during long-distance travel on rough terrain",
  "Brake pads worn out, vehicle pulling to the left during braking",
  "Transmission fluid leaking from the gearbox area",
  "Air conditioning system not cooling effectively in cabin",
  "Front suspension making clunking noise over bumps",
  "Oil pressure warning light intermittently illuminating on dashboard",
  "Windshield wiper motor failure, wipers not functioning",
  "Battery not holding charge, difficulty starting in the morning",
  "Exhaust system has visible rust and a small leak",
  "Power steering pump making whining noise during turns",
  "Clutch slipping under load during uphill drives",
  "Fuel injector clogged causing rough idle and poor mileage",
  "Radiator fan not engaging at operating temperature",
  "Alternator failing, dimming headlights observed at night",
  "Wheel alignment needed after hitting a deep pothole on field trip",
  "Rear differential making grinding sound at high speed",
  "Water pump leaking coolant causing temperature spikes",
  "Door lock mechanism jammed on driver side",
  "Speedometer reading inaccurate, odometer discrepancy noted",
  "Tail light assembly cracked from minor parking incident",
]

const urgencies: ("low" | "medium" | "high" | "critical")[] = [
  "medium", "high", "critical", "low", "medium",
  "high", "low", "critical", "medium", "high",
  "medium", "low", "high", "critical", "medium",
  "low", "high", "medium", "low", "critical",
]

const mrStatuses: ("pending" | "approved" | "in_progress" | "completed" | "rejected")[] = [
  "pending", "pending", "pending", "pending",
  "approved", "approved", "approved",
  "in_progress", "in_progress", "in_progress",
  "completed", "completed", "completed", "completed", "completed",
  "rejected", "rejected",
  "approved", "in_progress", "completed",
]

export const mockMaintenanceRequests: MaintenanceRequest[] = Array.from({ length: 20 }, (_, i) => {
  const requestDate = randomDate(new Date("2025-09-01"), new Date("2026-06-01"))
  const status = mrStatuses[i % mrStatuses.length]
  const isCompleted = status === "completed"

  return {
    id: `mr-${String(i + 1).padStart(3, "0")}`,
    vehicleId: `veh-${String((i % 15) + 1).padStart(3, "0")}`,
    driverId: `drv-${String((i % 15) + 1).padStart(3, "0")}`,
    requestDate,
    issueDescription: issues[i % issues.length],
    urgency: urgencies[i],
    status,
    workOrderId: (status === "in_progress" || status === "completed") ? `wo-${String(i + 1).padStart(3, "0")}` : undefined,
    maintenanceCost: isCompleted ? Math.floor(5000 + rng() * 45000) : undefined,
    completedDate: isCompleted ? new Date(requestDate.getTime() + rng() * 14 * 24 * 60 * 60 * 1000) : undefined,
  }
})

const sparePartsData: { name: string; partNumber: string; unitCost: number }[] = [
  { name: "Brake Pad Set (Front)", partNumber: "BP-FRT-2024", unitCost: 3500 },
  { name: "Brake Pad Set (Rear)", partNumber: "BP-RR-2024", unitCost: 3200 },
  { name: "Oil Filter", partNumber: "OF-TY-1001", unitCost: 850 },
  { name: "Air Filter", partNumber: "AF-TY-2002", unitCost: 1200 },
  { name: "Fuel Filter", partNumber: "FF-TY-3003", unitCost: 1800 },
  { name: "Timing Belt", partNumber: "TB-TY-4004", unitCost: 4500 },
  { name: "Alternator Assembly", partNumber: "ALT-TY-5005", unitCost: 12000 },
  { name: "Water Pump", partNumber: "WP-TY-6006", unitCost: 8500 },
  { name: "Radiator Cap", partNumber: "RC-TY-7007", unitCost: 350 },
  { name: "Spark Plug Set", partNumber: "SP-TY-8008", unitCost: 2400 },
  { name: "Battery 12V 80Ah", partNumber: "BAT-80-001", unitCost: 6500 },
  { name: "Wiper Blade (Pair)", partNumber: "WB-PR-9009", unitCost: 800 },
  { name: "Transmission Fluid 4L", partNumber: "TF-4L-1010", unitCost: 3200 },
  { name: "Engine Oil 5W-30 5L", partNumber: "EO-530-1111", unitCost: 4800 },
  { name: "Coolant 5L", partNumber: "CL-5L-1212", unitCost: 1500 },
]

function generateSpareParts(count: number, woIdx: number): SparePart[] {
  const parts: SparePart[] = []
  const used = new Set<number>()
  for (let i = 0; i < count; i++) {
    let idx: number
    do { idx = Math.floor(rng() * sparePartsData.length) } while (used.has(idx))
    used.add(idx)
    const sp = sparePartsData[idx]
    const qty = 1 + Math.floor(rng() * 4)
    parts.push({
      id: `sp-${woIdx}-${i}-${idx}`,
      name: sp.name,
      partNumber: sp.partNumber,
      quantity: qty,
      unitCost: sp.unitCost,
      totalCost: qty * sp.unitCost,
      isReplaced: rng() > 0.3,
    })
  }
  return parts
}

const woStatuses: ("pending" | "approved" | "in_progress" | "completed")[] = [
  "pending", "pending",
  "in_progress", "in_progress", "in_progress",
  "completed", "completed", "completed", "completed", "completed",
  "approved", "in_progress", "completed", "completed", "completed",
]

export const mockWorkOrders: WorkOrder[] = Array.from({ length: 15 }, (_, i) => {
  const createdAt = randomDate(new Date("2025-10-01"), new Date("2026-05-15"))
  const status = woStatuses[i % woStatuses.length]
  const parts = generateSpareParts(1 + Math.floor(rng() * 4), i)
  const totalCost = parts.reduce((sum, p) => sum + p.totalCost, 0) + Math.floor(rng() * 5000)

  return {
    id: `wo-${String(i + 1).padStart(3, "0")}`,
    maintenanceRequestId: `mr-${String(i + 1).padStart(3, "0")}`,
    vehicleId: `veh-${String((i % 15) + 1).padStart(3, "0")}`,
    assignedMechanicId: "usr-005",
    description: `Work order for: ${issues[i % issues.length]}`,
    createdAt,
    estimatedCompletionDate: new Date(createdAt.getTime() + (3 + rng() * 12) * 24 * 60 * 60 * 1000),
    actualCompletionDate: status === "completed"
      ? new Date(createdAt.getTime() + (5 + rng() * 15) * 24 * 60 * 60 * 1000)
      : undefined,
    status,
    spareParts: parts,
    totalCost,
  }
})

export const mockSpareParts: SparePart[] = mockWorkOrders.flatMap((wo) => wo.spareParts)
