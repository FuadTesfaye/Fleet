import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusType = 
  | "active" | "maintenance" | "idle" | "out_of_service" | "transferred"
  | "pending" | "approved" | "rejected" | "in_progress" | "completed"
  | "minor" | "moderate" | "severe" | "total_loss"

interface StatusBadgeProps {
  status: StatusType | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (s: string) => {
    switch (s.toLowerCase()) {
      // Positive / Active
      case "active":
      case "approved":
      case "completed":
        return { label: s, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" }
      
      // Warning / In Progress
      case "maintenance":
      case "in_progress":
      case "moderate":
        return { label: s, color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800" }
      
      // Neutral / Pending
      case "idle":
      case "pending":
      case "minor":
        return { label: s, color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700" }
      
      // Destructive / Severe
      case "out_of_service":
      case "rejected":
      case "severe":
      case "total_loss":
        return { label: s, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" }
      
      // Default
      default:
        return { label: s, color: "bg-secondary text-secondary-foreground" }
    }
  }

  const config = getStatusConfig(status)
  // format label: replace underscores with spaces and capitalize words
  const formattedLabel = config.label
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <Badge variant="outline" className={cn("font-medium", config.color, className)}>
      {formattedLabel}
    </Badge>
  )
}
