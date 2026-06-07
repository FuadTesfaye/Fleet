import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { RoleGuard } from "@/components/layout/role-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col w-full overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
          <div className="w-full">
            <RoleGuard>
              {children}
            </RoleGuard>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
