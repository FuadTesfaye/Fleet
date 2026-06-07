"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { loginSchema } from "@/lib/schemas/auth.schema"
import { useAuthStore } from "@/store/auth.store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Settings, BarChart3, Truck } from "lucide-react"

type LoginFormValues = z.infer<typeof loginSchema>

const QUICK_LOGINS = [
  { label: "Super Admin", email: "superadmin@mill.gov.et" },
  { label: "Basic Manager", email: "manager@mill.gov.et" },
  { label: "Deployment Head", email: "deployhead@mill.gov.et" },
  { label: "Deployment Expert", email: "expert@mill.gov.et" },
  { label: "Maintenance", email: "mechanic@mill.gov.et" },
  { label: "Driver", email: "driver@mill.gov.et" },
]

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    const success = await login(data.email, data.password)
    setIsLoading(false)

    if (success) {
      router.push("/dashboard")
    }
  }

  const handleQuickLogin = async (email: string) => {
    setValue("email", email)
    setValue("password", "password123")
    setIsLoading(true)
    const success = await login(email, "password123")
    setIsLoading(false)

    if (success) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left 40% - Branding */}
      <div className="hidden lg:flex flex-col justify-between w-[40%] bg-primary text-primary-foreground p-12">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-primary-foreground text-primary p-2 rounded-lg">
              <Truck size={32} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Ministry of Irrigation</h1>
              <p className="text-sm font-medium text-primary-foreground/80">and Lowlands</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Fleet Management System
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-12 max-w-md">
            Enterprise-grade platform for tracking, maintaining, and optimizing the Ministry's vehicle fleet across all regions.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary-foreground/10 p-3 rounded-full">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Track & Monitor</h3>
                <p className="text-primary-foreground/70 text-sm">Real-time visibility into vehicle locations and active trips.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary-foreground/10 p-3 rounded-full">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Manage Maintenance</h3>
                <p className="text-primary-foreground/70 text-sm">Proactive scheduling and comprehensive service history.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary-foreground/10 p-3 rounded-full">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Optimize Resources</h3>
                <p className="text-primary-foreground/70 text-sm">Data-driven insights for fuel efficiency and deployment.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} Ministry of Irrigation and Lowlands.
        </div>
      </div>

      {/* Right 60% - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Truck size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary">MILL FMS</h1>
          </div>

          <Card className="border-0 shadow-xl shadow-black/5 ring-1 ring-black/5 dark:ring-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@mill.gov.et"
                    {...register("email")}
                    className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive font-medium">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive font-medium">{errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* Development Shortcuts */}
              <div className="mt-10">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-medium">
                      Quick Login (Dev Only)
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {QUICK_LOGINS.map((role) => (
                    <Button
                      key={role.email}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleQuickLogin(role.email)}
                      disabled={isLoading}
                    >
                      {role.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
