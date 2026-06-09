"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { loginSchema } from "@/lib/schemas/auth.schema"
import { useAuthStore } from "@/store/auth.store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, ShieldCheck, Activity } from "lucide-react"

type LoginFormValues = z.infer<typeof loginSchema>

const QUICK_LOGINS = [
  { label: "Super Admin", email: "superadmin@fleet.com" },
  { label: "Basic Manager", email: "manager@fleet.com" },
  { label: "Deployment Head", email: "deployhead@fleet.com" },
  { label: "Deployment Expert", email: "expert@fleet.com" },
  { label: "Maintenance", email: "mechanic@fleet.com" },
  { label: "Driver", email: "driver@fleet.com" },
  { label: "ICT Dept", email: "kidist.a@fleet.com" },
  { label: "Normal User", email: "user@fleet.com" },
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
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Enterprise Showcase */}
      <div className="hidden lg:flex flex-col w-[45%] bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="flex flex-col h-full p-16">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-16">
              <div>
                <Image src="/logo.png" alt="FleetOS Logo" width={40} height={40} className="object-contain" priority />
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-sidebar-foreground">FleetOS</h1>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-4 text-sidebar-foreground">
              Enterprise Fleet Management
            </h2>
            <p className="text-lg text-sidebar-foreground/80 mb-16 max-w-md leading-relaxed">
              Secure, scalable platform for global asset tracking, predictive maintenance, and route optimization.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <MapPin className="w-5 h-5 text-sidebar-foreground/60" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-sidebar-foreground mb-1">Global Asset Tracking</h3>
                  <p className="text-sidebar-foreground/70 text-sm leading-relaxed max-w-sm">
                    Real-time telematics and visibility into vehicle locations across your entire supply chain.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Activity className="w-5 h-5 text-sidebar-foreground/60" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-sidebar-foreground mb-1">Predictive Analytics</h3>
                  <p className="text-sidebar-foreground/70 text-sm leading-relaxed max-w-sm">
                    Data-driven insights for fuel efficiency, dynamic deployment, and utilization forecasting.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <ShieldCheck className="w-5 h-5 text-sidebar-foreground/60" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-sidebar-foreground mb-1">Automated Maintenance</h3>
                  <p className="text-sidebar-foreground/70 text-sm leading-relaxed max-w-sm">
                    Proactive scheduling and comprehensive service history to minimize vehicle downtime.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-sidebar-foreground/60">
            <span>&copy; {new Date().getFullYear()} FleetOS Platform</span>
            <div className="flex gap-6">
              <span className="hover:text-sidebar-foreground cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-sidebar-foreground cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-[400px]">
          
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div>
              <Image src="/logo.png" alt="FleetOS Logo" width={40} height={40} className="object-contain" priority />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">FleetOS</h1>
          </div>

          <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Sign In</h2>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access your workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@fleet.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                  <span className="text-xs text-primary font-medium cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full font-medium" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Development Shortcuts */}
            <div className="mt-10 pt-6 border-t border-border">
              <div className="mb-4 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Developer Login Shortcuts
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_LOGINS.map((role) => (
                  <Button
                    key={role.email}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 text-muted-foreground border-border hover:text-foreground"
                    onClick={() => handleQuickLogin(role.email)}
                    disabled={isLoading}
                  >
                    {role.label}
                  </Button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

