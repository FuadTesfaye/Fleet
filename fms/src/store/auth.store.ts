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
        toast.success(`Welcome back, ${user.name}`)
        return true
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      switchRole: (role: UserRole) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, role } })
          toast.success(`Switched role to ${role}`)
        }
      },
    }),
    {
      name: "fms-auth",
    }
  )
)
