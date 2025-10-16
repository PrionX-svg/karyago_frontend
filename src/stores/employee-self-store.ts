import { create } from "zustand"
import { persist } from "zustand/middleware"
import { employeeAPI } from "@/lib/api/employee-api"
import { toast } from "sonner"
import { formatInTimeZone } from "date-fns-tz"

/* ---------- TYPE DEFINITIONS ---------- */
type Attendance = {
  id?: number
  uuid?: string
  work_date?: string
  clock_in_at?: string | null
  clock_out_at?: string | null
  is_home_office?: boolean
  notes?: string | null
  status?: "OPEN" | "PRESENT" | "ABSENT"
  is_overtime: boolean
  overtime_hours?: number | null
  overtime_reason?: string | null
  total_work_hours?: number | null
}

type EditRequest = {
  id: number
  work_date: string
  edit_type: string
  status: string
  reason: string
  requested_time?: string
}

type SelfProfile = {
  name?: string
  email?: string
  phone?: string
  gender?: string
  birth_date?: string | null
  company?: string | null
  employee_id?: string | null
  department?: string | null
}

/* ---------- STORE INTERFACE ---------- */
interface EmployeeSelfStore {
  attendanceToday: Attendance | null
  attendanceList: Attendance[]
  myEditRequests: EditRequest[]
  isHomeOffice: boolean
  notes: string
  selfProfile: SelfProfile | null

  fetchAttendanceToday: (companyUUID: string) => Promise<void>
  fetchAttendanceRange: (from: Date, to: Date, companyUUID: string) => Promise<void>
  fetchMyEditRequests: (companyUUID: string) => Promise<void>
  clockIn: (workDate: Date, companyUUID?: string, at?: string) => Promise<void>
  clockOut: (workDate: Date, companyUUID?: string, at?: string) => Promise<void>
  toggleHomeOffice: (isHome: boolean, companyUUID?: string) => Promise<void>
  saveNotes: (note: string, companyUUID?: string) => Promise<void>
  resetForNewDay: () => void

  fetchSelfProfile: () => Promise<void>
  updateSelfProfile: (payload: Partial<SelfProfile>) => Promise<void>
}

/* ---------- STORE IMPLEMENTATION ---------- */
export const useEmployeeSelfStore = create<EmployeeSelfStore>()(
  persist(
    (set, get) => ({
      attendanceToday: null,
      attendanceList: [],
      myEditRequests: [],
      isHomeOffice: false,
      notes: "",
      selfProfile: null,

      /** Fetch attendance today */
      async fetchAttendanceToday(companyUUID: string) {
        try {
          const res = await employeeAPI.getByDate(new Date(), companyUUID)
          // Karena employeeAPI.getByDate() sudah return { data: attendanceObj }
          set({ attendanceToday: res.data || null })
          // console.log("✅ Attendance Today:", res.data)
        } catch (err) {
          console.error("❌ fetchAttendanceToday error:", err)
          set({ attendanceToday: null })
        }
      },


      /** Fetch attendance range */
      async fetchAttendanceRange(from: Date, to: Date, companyUUID: string) {
        try {
          const res = await employeeAPI.listRange(from, to, companyUUID)
          set({ attendanceList: res.data || [] })
          return res
        } catch (err) {
          console.error("❌ fetchAttendanceRange error:", err)
          set({ attendanceList: [] })
          return null
        }
      },

      /** Fetch my edit requests */
      async fetchMyEditRequests(companyUUID: string) {
        try {
          const res = await employeeAPI.getMyEditRequests(companyUUID)
          set({ myEditRequests: res.data || [] })
        } catch (err) {
          console.error("❌ fetchMyEditRequests error:", err)
          set({ myEditRequests: [] })
        }
      },

      /** Clock In */
      async clockIn(workDate, companyUUID) {
        try {
          // 🕒 Ambil waktu saat ini dan ubah ke WIB
          const now = new Date()
          const jakartaTime = formatInTimeZone(now, "Asia/Jakarta", "yyyy-MM-dd'T'HH:mm:ssXXX")

          const res = await employeeAPI.clockIn(workDate, companyUUID, jakartaTime)
          set({ attendanceToday: res ?? null })
          toast.success("Clocked in successfully!")
        } catch (err) {
          console.error("❌ clockIn error:", err)
          toast.error("Failed to clock in.")
        }
      },

      async clockOut(workDate, companyUUID) {
        try {
          // 🕒 Ambil waktu saat ini dan ubah ke WIB
          const now = new Date()
          const jakartaTime = formatInTimeZone(now, "Asia/Jakarta", "yyyy-MM-dd'T'HH:mm:ssXXX")

          const res = await employeeAPI.clockOut(workDate, companyUUID, jakartaTime)
          set({ attendanceToday: res ?? null })
          toast.success("Clocked out successfully!")
        } catch (err) {
          console.error("❌ clockOut error:", err)
          toast.error("Failed to clock out.")
        }
      },

      async toggleHomeOffice(isHome: boolean, companyUUID?: string) {
        try {
          const today = new Date()
          set((state) => ({
            isHomeOffice: isHome,
            attendanceToday: state.attendanceToday
              ? { ...state.attendanceToday, is_home_office: isHome }
              : state.attendanceToday,
          }))

          const res = await employeeAPI.toggleHomeOffice(today, isHome, companyUUID)
          set({
            attendanceToday: res ?? null,
            isHomeOffice: res?.is_home_office ?? isHome,
          })
          toast.success(isHome ? "Home Office enabled" : "Office mode enabled")
        } catch (err) {
          set((state) => ({
            isHomeOffice: !isHome,
            attendanceToday: state.attendanceToday
              ? { ...state.attendanceToday, is_home_office: !isHome }
              : state.attendanceToday,
          }))
          toast.error("Failed to toggle work mode")
          console.error("toggleHomeOffice error:", err)
        }
      },

      /** Save Notes */
      async saveNotes(notes: string, companyUUID?: string) {
        try {
          const today = new Date()
          set((state) => ({
            notes,
            attendanceToday: state.attendanceToday
              ? { ...state.attendanceToday, notes }
              : state.attendanceToday,
          }))

          const res = await employeeAPI.saveNotes(today, notes, companyUUID)
          set({
            notes: res?.notes ?? notes,
            attendanceToday: res ?? null,
          })
          toast.success("Notes saved")
        } catch (err) {
          toast.error("Failed to save notes")
          console.error("saveNotes error:", err)
        }
      },

      resetForNewDay() {
        set({
          attendanceToday: null,
          isHomeOffice: false,
          notes: "",
        })
      },

      async fetchSelfProfile() {
        try {
          const res = await employeeAPI.getSelfProfile()
          set({ selfProfile: res })
        } catch (e) {
          console.error("fetchSelfProfile error:", e)
        }
      },

      async updateSelfProfile(payload) {
        const prev = get().selfProfile
        try {
          // Optimistic update
          set({ selfProfile: { ...prev, ...payload } as SelfProfile })
          const res = await employeeAPI.updateSelfProfile(payload)
          set({ selfProfile: res.data as SelfProfile })
          toast.success("Profile updated successfully!")
        } catch (e) {
          // Rollback if failed
          set({ selfProfile: prev ?? null })
          toast.error("Failed to update profile.")
          console.error("❌ updateSelfProfile error:", e)
        }
      },
    }),
    {
      name: "employee-self-store",
      partialize: (s) => ({
        attendanceToday: s.attendanceToday,
        attendanceList: s.attendanceList,
        myEditRequests: s.myEditRequests,
        isHomeOffice: s.isHomeOffice,
        notes: s.notes,
        selfProfile: s.selfProfile,
      }),
    }
  )
)
