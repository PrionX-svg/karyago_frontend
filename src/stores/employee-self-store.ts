import { create } from "zustand"
import { persist } from "zustand/middleware"
import { employeeAPI } from "@/lib/api/employee-api"
import { toast } from "sonner"

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
  address?: string
  birth_date?: string | null
  join_date?: string | null
  position_name?: string | null
  department_name?: string | null
  employee_id?: string | null
  manager_name?: string | null
  bio?: string | null
  avatar_url?: string | null
  work_schedule?: string | null
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
          console.log("✅ Attendance Today:", res.data)
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
        } catch (err) {
          console.error("❌ fetchAttendanceRange error:", err)
          set({ attendanceList: [] })
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
      async clockIn(workDate, companyUUID, at) {
        try {
          const res = await employeeAPI.clockIn(workDate, companyUUID, at)
          set({ attendanceToday: res ?? null })
          toast.success("Clocked in successfully!")
        } catch (err) {
          console.error("❌ clockIn error:", err)
          toast.error("Failed to clock in.")
        }
      },

      /** Clock Out */
      async clockOut(workDate, companyUUID, at) {
        try {
          const res = await employeeAPI.clockOut(workDate, companyUUID, at)
          set({ attendanceToday: res ?? null })
          toast.success("Clocked out successfully!")
        } catch (err) {
          console.error("❌ clockOut error:", err)
          toast.error("Failed to clock out.")
        }
      },

      /** Fetch current user's profile */
      async fetchSelfProfile() {
        try {
          const res = await employeeAPI.getSelfProfile()
          set({ selfProfile: res.data as SelfProfile })
        } catch (e) {
          console.error("❌ fetchSelfProfile error:", e)
        }
      },

      /** Update current user's profile */
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
