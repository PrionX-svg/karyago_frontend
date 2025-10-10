import getAPI from "./getAPI"
import postAPI from "./postAPI"
import patchAPI from "./patchAPI"
import { API_URL } from "./constants"
import { responseFormatter } from "./responseFormatter"
import { useUserStore } from "@/stores/user-store"

// Format tanggal "YYYY-MM-DD"
const formatDate = (date: Date) => date.toISOString().split("T")[0]

export const employeeAPI = {
    async clockIn(workDate: Date, companyUuid?: string, at?: string) {
        const payload = { work_date: formatDate(workDate), company_uuid: companyUuid, at }
        const res = await postAPI(payload, API_URL.attendanceClockIn)
        if (res.status >= 400 || res.data?.status === "error") {
            throw new Error(res.data?.message || "Clock-in failed")
        }
        return responseFormatter.formatAttendance(res.data?.data)
    },

    async clockOut(workDate: Date, companyUuid?: string, at?: string) {
        const payload = { work_date: formatDate(workDate), company_uuid: companyUuid, at }
        const res = await postAPI(payload, API_URL.attendanceClockOut)
        if (res.status >= 400 || res.data?.status === "error") {
            throw new Error(res.data?.message || "Clock-out failed")
        }
        return responseFormatter.formatAttendance(res.data?.data)
    },

    async toggleHomeOffice(workDate: Date, isHomeOffice: boolean, companyUuid?: string) {
        const payload = { work_date: formatDate(workDate), company_uuid: companyUuid, is_home_office: isHomeOffice }
        const res = await patchAPI(payload, API_URL.attendanceToggleHomeOffice)
        if (res.status >= 400 || res.data?.status === "error") {
            throw new Error(res.data?.message || "Toggle failed")
        }
        // backend balikin Attendance; formatkan biar konsisten
        return responseFormatter.formatAttendance(res.data?.data)
    },

    async saveNotes(workDate: Date, notes: string, companyUuid?: string) {
        const payload = { work_date: formatDate(workDate), company_uuid: companyUuid, notes }
        const res = await patchAPI(payload, API_URL.attendanceSaveNotes)
        if (res.status >= 400 || res.data?.status === "error") {
            throw new Error(res.data?.message || "Save notes failed")
        }
        return responseFormatter.formatAttendance(res.data?.data)
    },


    async getByDate(workDate: Date, companyUuid?: string) {
        const query = new URLSearchParams({
            work_date: formatDate(workDate),
            ...(companyUuid && { company_uuid: companyUuid }),
        }).toString()

        const res = await getAPI(`${API_URL.attendanceGetByDate}?${query}`)

        // 🔧 FIX: pastikan konsisten return data langsung (bukan nested)
        const attendance = res.data?.data ?? res.data
        return { ...res, data: responseFormatter.formatAttendance(attendance) }
    },

    async listAllAttendance(from: Date, to: Date, companyUuid: string) {
        const query = new URLSearchParams({
            from: from.toISOString().split("T")[0],
            to: to.toISOString().split("T")[0],
            company_uuid: companyUuid,
        }).toString()

        const res = await getAPI(`${API_URL.attendanceListAll}?${query}`)

        // Handle hybrid backend response
        const list = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
                ? res.data.data
                : []

        console.log("✅ Admin Attendance List (raw):", res.data)
        console.log("📊 Extracted list length:", list.length)

        return {
            ...res,
            data: responseFormatter.formatAttendanceList(list),
        }
    },


    async listRange(from: Date, to: Date, companyUuid?: string) {
        const query = new URLSearchParams({
            from: formatDate(from),
            to: formatDate(to),
            ...(companyUuid && { company_uuid: companyUuid }),
        }).toString()

        const res = await getAPI(`${API_URL.attendanceListRange}?${query}`)

        // 🔥 Hybrid handling: backend bisa return { data: [...] } atau langsung array
        const list = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
                ? res.data.data
                : []

        console.log("✅ Attendance range raw:", res.data)
        console.log("✅ Extracted attendance list:", list)

        return {
            ...res,
            data: responseFormatter.formatAttendanceList(list),
        }
    },

    async listCalendar(from: Date, to: Date, companyUuid?: string) {
        const query = new URLSearchParams({
            from: formatDate(from),
            to: formatDate(to),
            ...(companyUuid && { company_uuid: companyUuid }),
        }).toString()

        const res = await getAPI(`${API_URL.attendanceListCalendar}?${query}`)
        return {
            ...res,
            data: responseFormatter.formatAttendanceList(res.data),
        }
    },

    async getMyEditRequests(companyUuid?: string) {
        const query = new URLSearchParams({
            ...(companyUuid && { company_uuid: companyUuid }),
        }).toString()
        const res = await getAPI(`${API_URL.attendanceEditRequestsMy}?${query}`)
        return {
            ...res,
            data: responseFormatter.formatAttendanceEditList(res.data),
        }
    },

    async getAllEditRequests(companyUuid: string) {
        const res = await getAPI(`${API_URL.attendanceEditRequests}?company_uuid=${companyUuid}`)

        // handle both { items: [] } or { data: [] } backend formats
        const list = res.data?.items ?? res.data?.data ?? res.data ?? []

        console.log("🧩 Raw edit requests:", JSON.stringify(list, null, 2))
        if (Array.isArray(list) && list.length > 0) {
            console.log("🧾 One record:", list[0])
        }

        // return {
        //     ...res,
        //     data: list.map((r: any) => ({
        //         id: r.id,
        //         work_date: r.work_date?.split("T")[0] ?? "-",
        //         edit_type: r.request_type?.replace(/_/g, " ") ?? "-",
        //         reason: r.reason ?? "-",
        //         status: r.status ?? "-",
        //         proposed_clock_in_at: r.proposed_clock_in_at ?? null,
        //         proposed_clock_out_at: r.proposed_clock_out_at ?? null,
        //         proposed_is_home_office: r.proposed_is_home_office ?? null,
        //         user_name: r.employee?.user
        //             ? `${r.employee.user.first_name ?? ""} ${r.employee.user.last_name ?? ""}`.trim() || "Unknown"
        //             : "Unknown",

        //         department_name: r.employee?.user?.department?.name ?? "-",
        //     })),
        // }

        return {
            ...res,
            data: responseFormatter.formatAttendanceEditList(list),
        }
    },



    async createEditRequest(payload: {
        work_date: string
        edit_type: string
        original_time?: string
        requested_time?: string
        reason: string
        company_uuid?: string
    }) {
        const res = await postAPI(payload, API_URL.attendanceEditRequests)
        return {
            ...res,
            data: responseFormatter.formatAttendanceEdit(res.data?.data),
        }
    },

    async approveEditRequest(id: string) {
        const res = await postAPI({}, `${API_URL.attendanceEditRequests}/${id}/approve`)
        return {
            ...res,
            data: responseFormatter.formatAttendanceEdit(res.data?.data),
        }
    },

    async rejectEditRequest(id: string, note: string) {
        const res = await postAPI({ note }, `${API_URL.attendanceEditRequests}/${id}/reject`)
        return {
            ...res,
            data: responseFormatter.formatAttendanceEdit(res.data?.data),
        }
    },

    async getSelfProfile() {
        const res = await getAPI("/employee/me")
        return res.data
    },


    async updateSelfProfile(payload: any) {
        const res = await postAPI(payload, API_URL.updateUser ?? "/employee/me")
        return { ...res, data: res.data?.data ?? res.data }
    },

    async getDepartments(companyUuid: string) {
        const res = await getAPI(`/departments?company_uuid=${companyUuid}`)
        return { ...res, data: res.data?.data ?? res.data }
    },


}
