import { create } from "zustand"
import { employeeAPI } from "@/lib/api/employee-api"
import { toast } from "sonner"

export type AttendanceEdit = {
  id: number
  uuid: string
  work_date: string
  edit_type: string
  proposed_clock_in_at?: string | null
  proposed_clock_out_at?: string | null
  proposed_is_home_office?: boolean | null
  reason: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  employee_name?: string
  reviewed_by?: string | null
  reviewed_at?: string | null
  created_at?: string | null
}

type AttendanceEditStore = {
  myEditRequests: AttendanceEdit[]
  allEditRequests: AttendanceEdit[]
  isLoading: boolean

  // Derived selectors
  pendingRequests: AttendanceEdit[]
  approvedRequests: AttendanceEdit[]
  rejectedRequests: AttendanceEdit[]

  fetchMyEditRequests: (companyUuid?: string) => Promise<void>
  fetchAllEditRequests: (companyUuid?: string) => Promise<void>
  createEditRequest: (payload: {
    work_date: string
    edit_type: string
    original_time?: string
    requested_time?: string
    reason: string
    company_uuid?: string
  }) => Promise<void>
  approveEditRequest: (id: string) => Promise<void>
  rejectEditRequest: (id: string, note: string) => Promise<void>
}

export const useAttendanceEditStore = create<AttendanceEditStore>((set, get) => ({
  myEditRequests: [],
  allEditRequests: [],
  isLoading: false,

  // Selectors for filtered lists
  get pendingRequests() {
    return get().allEditRequests.filter((r) => r.status === "PENDING")
  },
  get approvedRequests() {
    return get().allEditRequests.filter((r) => r.status === "APPROVED")
  },
  get rejectedRequests() {
    return get().allEditRequests.filter((r) => r.status === "REJECTED")
  },

  fetchMyEditRequests: async (companyUuid) => {
    try {
      set({ isLoading: true })
      const res = await employeeAPI.getMyEditRequests(companyUuid)
      // console.log("📦 fetchMyEditRequests response:", res.data)
      set({ myEditRequests: res.data || [] })
    } catch (error) {
      console.error(error)
      toast.error("Fail to fetch my attendance edit requests")
    } finally {
      set({ isLoading: false })
    }
  },


  fetchAllEditRequests: async (companyUuid) => {
    try {
      set({ isLoading: true })
      const res = await employeeAPI.getAllEditRequests(companyUuid)
      set({ allEditRequests: res.data || [] })
    } catch (error) {
      console.error(error)
      toast.error("Fail to fetch all attendance edit requests")
    } finally {
      set({ isLoading: false })
    }
  },

  /** Buat edit request baru */
  createEditRequest: async (payload) => {
    try {
      const res = await employeeAPI.createEditRequest(payload)
      if (res?.data) {
        const newItem = res.data as AttendanceEdit
        set((state) => ({
          myEditRequests: [newItem, ...state.myEditRequests],
        }))
        toast.success("Edit request succesfully created")
      } else {
        toast.error("There's no response data from server")
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.message || "Fail to create edit request")
    }
  },

  /** Approve edit request (untuk HR/Admin) */
  approveEditRequest: async (id) => {
    try {
      const res = await employeeAPI.approveEditRequest(id)
      if (res?.data) {
        const updated = res.data as AttendanceEdit
        set((state) => ({
          allEditRequests: state.allEditRequests.map((req) =>
            req.id === updated.id ? updated : req
          ),
        }))
        toast.success("Request approved")
      }
    } catch (error) {
      console.error(error)
      toast.error("Fail to approve request")
    }
  },

  /** Reject edit request (untuk HR/Admin) */
  rejectEditRequest: async (id, note) => {
    try {
      const res = await employeeAPI.rejectEditRequest(id, note)
      if (res?.data) {
        const updated = res.data as AttendanceEdit
        set((state) => ({
          allEditRequests: state.allEditRequests.map((req) =>
            req.id === updated.id ? updated : req
          ),
        }))
        toast.success("Request rejected")
      }
    } catch (error) {
      console.error(error)
      toast.error("Fail to reject request")
    }
  },
}))
