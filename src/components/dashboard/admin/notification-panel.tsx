import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "urgent",
    title: "System Maintenance",
    message: "Scheduled maintenance tonight from 11 PM to 2 AM",
    time: "2 hours ago",
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "from-red-500/10 to-orange-500/10",
  },
  {
    id: 2,
    type: "info",
    title: "New Policy Update",
    message: "Remote work policy has been updated. Please review the changes.",
    time: "4 hours ago",
    icon: Info,
    color: "text-blue-500",
    bgColor: "from-blue-500/10 to-indigo-500/10",
  },
  {
    id: 3,
    type: "success",
    title: "Payroll Processed",
    message: "Monthly payroll has been successfully processed for all employees.",
    time: "1 day ago",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "from-green-500/10 to-emerald-500/10",
  },
  {
    id: 4,
    type: "info",
    title: "Training Session",
    message: "Mandatory cybersecurity training scheduled for next week.",
    time: "2 days ago",
    icon: Info,
    color: "text-blue-500",
    bgColor: "from-blue-500/10 to-indigo-500/10",
  },
]

export function NotificationPanel() {
  return (
    <Card className="backdrop-blur-xl bg-white/60 border-white/20 shadow-xl shadow-black/5 rounded-3xl hover:bg-white/70 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-gray-800">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          Notifications
          <Badge className="ml-auto bg-gradient-to-r from-red-500 to-orange-600 text-white border-0 rounded-xl shadow-lg shadow-red-500/25">
            {notifications.filter((n) => n.type === "urgent").length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification) => {
          const IconComponent = notification.icon
          return (
            <div
              key={notification.id}
              className="flex gap-4 p-4 rounded-2xl bg-white/40 border border-white/30 hover:bg-white/60 transition-all duration-200"
            >
              <div
                className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${notification.bgColor} flex items-center justify-center flex-shrink-0`}
              >
                <IconComponent className={`w-5 h-5 ${notification.color}`} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-sm text-gray-800">{notification.title}</h4>
                  <span className="text-xs text-gray-500 font-medium">{notification.time}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                {notification.type === "urgent" && (
                  <Button
                    size="sm"
                    className="mt-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white border-0 rounded-xl shadow-lg shadow-red-500/25 transition-all duration-200"
                  >
                    View Details
                  </Button>
                )}
              </div>
            </div>
          )
        })}

        <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-200">
          View All Notifications
        </Button>
      </CardContent>
    </Card>
  )
}
