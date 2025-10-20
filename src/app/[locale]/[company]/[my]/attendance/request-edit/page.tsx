"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCompanyStore } from "@/stores/company-store"
import { employeeAPI } from "@/lib/api/employee-api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Send, CalendarDays } from "lucide-react"
import { formatInTimeZone } from "date-fns-tz"
import { useTranslations } from "next-intl"

export default function RequestEditAttendancePage() {
  const router = useRouter()
  const { currentCompany } = useCompanyStore()
  const attendanceEditPage = useTranslations("attendance");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [locationType, setLocationType] = useState("office")
  const [clockInChecked, setClockInChecked] = useState(false)
  const [clockOutChecked, setClockOutChecked] = useState(false)
  const [clockInTime, setClockInTime] = useState("")
  const [clockOutTime, setClockOutTime] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  /** 🧠 Helper: Tentukan request_type otomatis */
  const determineRequestType = () => {
    if (clockInChecked && clockOutChecked && locationType === "home")
      return "BOTH_PLUS_FLAG"
    if (clockInChecked && clockOutChecked)
      return "BOTH"
    if (locationType === "home" && !clockInChecked && !clockOutChecked)
      return "HOME_FLAG"
    if (clockInChecked)
      return "CLOCK_IN"
    if (clockOutChecked)
      return "CLOCK_OUT"
    return null
  }

  /** 🚀 Submit ke backend */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate) return toast.error("Please select a date")
    if (!reason.trim()) return toast.error("Please enter a reason")

    const requestType = determineRequestType()
    if (!requestType) {
      return toast.error("Select at least one edit option or change Home Office flag")
    }

    try {
      setIsSubmitting(true)
      const workDate = formatInTimeZone(selectedDate, "Asia/Jakarta", "yyyy-MM-dd")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        work_date: workDate,
        request_type: requestType,
        reason,
      }

      if (clockInChecked && clockInTime)
        payload.proposed_clock_in_at = `${workDate}T${clockInTime}:00+07:00`
      if (clockOutChecked && clockOutTime)
        payload.proposed_clock_out_at = `${workDate}T${clockOutTime}:00+07:00`
      if (locationType === "home")
        payload.proposed_is_home_office = true
      if (locationType != "home")
        payload.proposed_is_home_office = false

      // For debug
      // console.log("📤 Submitting payload:", payload)
      await employeeAPI.createEditRequest(payload)

      toast.success(attendanceEditPage("editRequestSent"))
      router.push(`/${currentCompany?.uuid}/my/attendance`)
    } catch (err) {
      console.error(attendanceEditPage("editRequestFailed"), err)
      toast.error(attendanceEditPage("editRequestFailed"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center sm:text-left sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          {/* Left Section (Icon + Title) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-3 space-y-2 sm:space-y-0">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
                {attendanceEditPage("editRequestTitle")}
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {attendanceEditPage("editRequestDesc")}
              </p>
            </div>
          </div>

          {/* Right Section (Button) */}
          <div className="w-full sm:w-auto">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl px-5 py-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? attendanceEditPage("processing") : attendanceEditPage("submitEditRequest")}
            </Button>
          </div>
        </div>


        {/* Card */}
        <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-xl rounded-3xl">
          <CardContent className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
            {/* Calendar Section */}
            <div className="flex flex-col space-y-6">
              <Label className="text-gray-700 font-semibold">{attendanceEditPage("editRequestSelectDate")}</Label>
              <div className="flex justify-center sm:justify-start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-2xl bg-white border border-gray-100 shadow-sm scale-95 sm:scale-100"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-semibold mb-2 block">{attendanceEditPage("editRequestSelectWorkType")}</Label>
                <RadioGroup
                  value={locationType}
                  onValueChange={setLocationType}
                  className="flex flex-col sm:flex-row sm:space-x-6 mt-2 space-y-2 sm:space-y-0"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="office" id="office" />
                    <Label htmlFor="office" className="text-gray-700 cursor-pointer">
                      {attendanceEditPage("inOffice")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home" className="text-gray-700 cursor-pointer">
                      {attendanceEditPage("homeOffice")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Clock In */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="clock-in"
                    checked={clockInChecked}
                    onCheckedChange={(checked) => setClockInChecked(checked as boolean)}
                  />
                  <Label htmlFor="clock-in" className="text-gray-700 font-medium cursor-pointer">
                    Clock In
                  </Label>
                </div>
                {clockInChecked && (
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{attendanceEditPage("editClockIn")}</Label>
                    <Input
                      type="time"
                      value={clockInTime}
                      onChange={(e) => setClockInTime(e.target.value)}
                      className="border-gray-200 rounded-xl h-11 sm:h-12"
                    />
                  </div>
                )}
              </div>

              {/* Clock Out */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="clock-out"
                    checked={clockOutChecked}
                    onCheckedChange={(checked) => setClockOutChecked(checked as boolean)}
                  />
                  <Label htmlFor="clock-out" className="text-gray-700 font-medium cursor-pointer">
                    Clock Out
                  </Label>
                </div>
                {clockOutChecked && (
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{attendanceEditPage("editClockOut")}</Label>
                    <Input
                      type="time"
                      value={clockOutTime}
                      onChange={(e) => setClockOutTime(e.target.value)}
                      className="border-gray-200 rounded-xl h-11 sm:h-12"
                    />
                  </div>
                )}
              </div>

              {/* Reason */}
              <div className="space-y-3">
                <Label className="text-gray-700 font-medium">{attendanceEditPage("editReasonLabel")}</Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={attendanceEditPage("editReasonPlaceholder")}
                  className="border-gray-200 rounded-xl min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base"
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>

  )
}
