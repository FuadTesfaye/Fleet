import { z } from "zod"

export const userSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  role: z.enum([
    "super_admin",
    "basic_service_manager",
    "transport_deployment_head",
    "transport_deployment_expert",
    "maintenance_expert",
    "driver",
    "ict_department",
  ], { required_error: "Role is required" }),
  department: z.string().min(1, "Department is required"),
  phone: z.string().regex(/^\+251[79]\d{8}$/, "Valid Ethiopian phone required (e.g., +251911234567)"),
})

export type UserFormValues = z.infer<typeof userSchema>
