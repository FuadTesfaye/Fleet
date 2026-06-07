import { z } from "zod"

export const maintenanceRequestSchema = z.object({
  vehicleId: z.string().uuid("Invalid vehicle ID format").or(z.string().min(1, "Vehicle is required")),
  driverId: z.string().min(1, "Driver is required"),
  issueDescription: z.string().min(20, "Describe the issue in detail (at least 20 characters)"),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  requestDate: z.date(),
})

export type MaintenanceRequestFormValues = z.infer<typeof maintenanceRequestSchema>

export const sparePartSchema = z.object({
  name: z.string().min(1, "Part name is required"),
  partNumber: z.string().min(1, "Part number is required"),
  quantity: z.number().int("Quantity must be an integer").positive("Quantity must be positive"),
  unitCost: z.number().positive("Unit cost must be positive"),
})

export const workOrderSchema = z.object({
  maintenanceRequestId: z.string().min(1, "Maintenance request ID is required"),
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  assignedMechanicId: z.string().min(1, "Mechanic is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  estimatedCompletionDate: z.date().min(new Date(), "Date must be in the future"),
  spareParts: z.array(sparePartSchema),
})

export type WorkOrderFormValues = z.infer<typeof workOrderSchema>
