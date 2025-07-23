import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: LucideIcon
  variant?: "default" | "primary"
}

export function MetricCard({ title, value, change, trend, icon: Icon, variant = "default" }: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-emerald-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-emerald-600 dark:text-emerald-400"
      case "down":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden backdrop-blur-xl border-border/20 shadow-xl rounded-3xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
        variant === "primary"
          ? "bg-primary/90 text-primary-foreground border-primary/50"
          : "bg-card/60 hover:bg-card/70",
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <p
              className={cn(
                "text-sm font-medium",
                variant === "primary" ? "text-primary-foreground/70" : "text-muted-foreground",
              )}
            >
              {title}
            </p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className={cn("text-sm font-medium", getTrendColor())}>{change}</span>
            </div>
          </div>
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200",
              variant === "primary"
                ? "bg-primary-foreground/10 hover:bg-primary-foreground/20"
                : "bg-primary/10 hover:bg-primary/20",
            )}
          >
            <Icon className={cn("w-6 h-6", variant === "primary" ? "text-primary-foreground" : "text-primary")} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
