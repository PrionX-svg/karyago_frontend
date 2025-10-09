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

    async getAllEditRequests(companyUuid?: string) {
        const query = new URLSearchParams({
            ...(companyUuid && { company_uuid: companyUuid }),
        }).toString()
        const res = await getAPI(`${API_URL.attendanceEditRequests}?${query}`)
        return {
            ...res,
            data: responseFormatter.formatAttendanceEditList(res.data),
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

    async rejectEditRequest(id: string) {
        const res = await postAPI({}, `${API_URL.attendanceEditRequests}/${id}/reject`)
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
