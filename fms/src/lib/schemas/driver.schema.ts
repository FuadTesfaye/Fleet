import { z } from "zod"

export const driverSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  licenseNumber: z.string().min(6, "License number must be at least 6 characters"),
  licenseClass: z.enum(["B", "C", "D", "E", "F"]),
  licenseExpiryDate: z.date().min(new Date(), "License must not be expired"),
  phone: z.string().regex(/^\+251[79]\d{8}$/, "Valid Ethiopian phone required (e.g., +251911234567)"),
  dateOfBirth: z.date().max(
    new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000),
    "Driver must be at least 18 years old"
  ),
  hireDate: z.date(),
  userId: z.string().min(1, "Linked user account is required"),
})

export type DriverFormValues = z.infer<typeof driverSchema>
