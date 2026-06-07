import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User, UserRole } from "@/types"
import { mockUsers } from "@/lib/mock-data"
import { toast } from "sonner"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  switchRole: (role: UserRole) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (password !== "password123") {
          toast.error("Invalid email or password")
          return false
        }

        const user = mockUsers.find((u) => u.email === email)

        if (!user) {
          toast.error("Invalid email or password")
          return false
        }

        if (!user.isActive) {
          toast.error("Your account has been deactivated")
          return false
        }

        set({ user, isAuthenticated: true })
        if (typeof document !== "undefined") {
          document.cookie = `fms-authenticated=true; path=/`
          document.cookie = `fms-role=${user.role}; path=/`
        }
        toast.success(`Welcome back, ${user.name}`)
        return true
      },

      logout: () => {
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
