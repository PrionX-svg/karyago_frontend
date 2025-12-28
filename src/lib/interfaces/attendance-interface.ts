import { EmployeeType } from "../types/employee-type"
import { UserType } from "../types/user-type"

export interface AttendanceRecord {
  id: number
  uuid: string

  employee_id: number
  user_id: number
  company_id: number

  work_date: string // ISO date (YYYY-MM-DD)

  clock_in_at?: string | null
  clock_out_at?: string | null

  clock_in_lat?: number | null
  clock_in_lng?: number | null
  clock_out_lat?: number | null
  clock_out_lng?: number | null

  is_overtime: boolean
  overtime_hours?: number | null
  overtime_reason?: string | null

  total_work_hours?: number | null
  is_home_office: boolean

  notes?: string | null

  created_at: string
  updated_at: string

  employee?: EmployeeType
  user?: UserType
}
