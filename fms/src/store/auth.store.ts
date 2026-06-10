import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User, UserRole } from "@/types"
import { mockUsers } from "@/lib/mock-data"
import { apiFetch, clearAuthTokens, isApiEnabled, storeAuthTokens } from "@/lib/api-client"
import { toast } from "sonner"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  switchRole: (role: UserRole) => void
}

type AuthLoginResponse = {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    phoneNumber?: string | null
    status: string
    roles: string[]
  }
  tokens: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
}

function mapBackendRole(roles: string[]): UserRole {
  const normalized = roles.map((r) => r.toLowerCase().replace(/\s+/g, "_"))
  if (normalized.some((r) => r.includes("super_admin"))) return UserRole.SUPER_ADMIN
  if (normalized.some((r) => r.includes("admin"))) return UserRole.SUPER_ADMIN
  if (normalized.some((r) => r.includes("dispatcher"))) return UserRole.TRANSPORT_DEPLOYMENT_EXPERT
  if (normalized.some((r) => r.includes("driver"))) return UserRole.DRIVER
  if (normalized.some((r) => r.includes("viewer"))) return UserRole.USER
  return UserRole.USER
}

function mapApiUser(dto: AuthLoginResponse["user"]): User {
  return {
    id: dto.id,
    name: `${dto.firstName} ${dto.lastName}`.trim(),
    email: dto.email,
    role: mapBackendRole(dto.roles ?? []),
    department: "Fleet Operations",
    phone: dto.phoneNumber ?? "",
    createdAt: new Date(),
    isActive: dto.status === "ACTIVE",
  }
}

async function loginViaApi(email: string, password: string): Promise<User | null> {
  const data = await apiFetch<AuthLoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
  storeAuthTokens(data.tokens.accessToken, data.tokens.refreshToken)
  return mapApiUser(data.user)
}

async function loginViaMock(email: string, password: string): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (password !== "password123") {
    return null
  }

  const user = mockUsers.find((u) => u.email === email)
  if (!user || !user.isActive) {
    return null
  }

  return user
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const user = isApiEnabled()
            ? await loginViaApi(email, password)
            : await loginViaMock(email, password)

          if (!user) {
            toast.error("Invalid email or password")
            return false
          }

          set({ user, isAuthenticated: true })
          if (typeof document !== "undefined") {
            document.cookie = `fms-authenticated=true; path=/`
            document.cookie = `fms-role=${user.role}; path=/`
          }
          toast.success(`Welcome back, ${user.name}`)
          return true
        } catch {
          toast.error("Invalid email or password")
          return false
        }
      },

      logout: () => {
        clearAuthTokens()
        set({ user: null, isAuthenticated: false })
        if (typeof document !== "undefined") {
          document.cookie = `fms-authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          document.cookie = `fms-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
      },

      switchRole: (role: UserRole) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, role } })
          if (typeof document !== "undefined") {
            document.cookie = `fms-role=${role}; path=/`
          }
          toast.success(`Switched role to ${role}`)
        }
      },
    }),
    {
      name: "fms-auth",
    }
  )
)
