import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

export default function DashboardPage({
  params,
}: {
  params: { locale: string; company: string }
}) {
  return (
    <div className="w-full max-w-full space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-foreground">28</div>
              <p className="text-sm text-muted-foreground">Active Employee</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-foreground">2</div>
              <p className="text-sm text-muted-foreground">New Employee</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-foreground">5</div>
              <p className="text-sm text-muted-foreground">Department Group</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-foreground">5</div>
              <p className="text-sm text-muted-foreground">Department</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Department Group A</span>
              <span className="font-medium">75%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gray-600 rounded-full" style={{ width: "75%" }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Department Group B</span>
              <span className="font-medium">90%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gray-600 rounded-full" style={{ width: "90%" }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-6xl font-bold text-foreground">90%</div>
              <p className="text-sm text-muted-foreground">Today</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Requested Edit Attendance</CardTitle>
            <Link
              href={`/${params.locale}/${params.company}/employees/attendance-requests`}
              className="text-sm text-primary hover:underline"
            >
              See more
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">User Name</p>
                  <p className="text-xs text-muted-foreground">Role</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-muted rounded-md">Pending</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">User Name</p>
                  <p className="text-xs text-muted-foreground">Role</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-muted rounded-md">Pending</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
