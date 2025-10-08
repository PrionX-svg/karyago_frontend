import {
  CreateDivisionResponse,
  CreateSubDivisionResponse,
  GetBranchesByCompanyUuidResponse,
  GetBranchResponse,
  GetCompaniesByUserUuidResponse,
  GetCompanyByUserUuidResponse,
  getDivisionsByCompanyUuidResponse,
  getSubDivisionsByCompanyUuidResponse,
  UpdateDivisionResponse,
  UpdateSubDivisionResponse,
} from "../interfaces/company-interface";
import { GetMeResponse, UpdateUserResponse } from "../interfaces/user-interface";
import {
  CompanyBranchType,
  CompanyType,
  DivisionType,
  SubDivisionType,
} from "../types/company-type";
import { UserType } from "../types/user-type";
import { EmployeeHistoryType, EmployeeType } from "../types/employee-type";
import {
  CreateEmployeeHistoryResponse,
  CreateEmployeeResponse,
  GetEmployeeByCompanyUuidResponse,
  ImportEmployeeResponse,
  UpdateEmployeeResponse,
} from "../interfaces/employee-interface";
import { RoleType } from "../types/role-type";
import { GetRoleByCompanyUuidResponse } from "../interfaces/role-interface";

function formatDate(dateString?: string | null): string | null {
  if (!dateString) return null
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return null
  return date.toISOString().split("T")[0] // YYYY-MM-DD
}

function formatTime(dateString?: string | null): string | null {
  if (!dateString) return null
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return null
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export const responseFormatter = {
  formatUserData(response: GetMeResponse): UserType {
    return {
      userUuid: response.data.user_uuid,
      employeeUuid: response.data.employee_uuid,
      name: {
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        fullName: response.data.full_name,
      },
      email: response.data.email,
      phone: response.data.phone,
      gender: response.data.gender,
      dob: response.data.dob,
      isFreelance: response.data.is_freelance,
      role: response.data.role,
      branch: {
        uuid: response.data.branch.uuid,
        name: response.data.branch.name,
      },
    };
  },
  formatUpdateUser(response: UpdateUserResponse): UserType {
    return {
      name: {
        firstName: response.first_name,
        lastName: response.last_name,
        fullName: response.full_name,
      },
      email: response.email,
      phone: response.phone,
      dob: response.dob,
      isFreelance: response.is_freelance,
      gender: response.gender,
      userUuid: response.user_uuid,
      employeeUuid: response.employee_uuid,
      role: {
        uuid: response.role.uuid,
        name: response.role.name,
      },
      branch: {
        uuid: response.branch.uuid,
        name: response.branch.name,
      },
    };
  },
  formatGetCompanyByUserUuid(
    response: GetCompanyByUserUuidResponse
  ): CompanyType {
    return {
      uuid: response.data?.uuid,
      logo: response.data?.logo,
      name: response.data?.name,
      address: response.data?.address,
      email: response.data?.email,
      phone: response.data?.phone,
      user: {
        uuid: response.data?.user?.uuid,
        firstName: response.data?.user?.firstname,
        lastName: response.data?.user?.lastname,
      },
    };
  },
  formatGetCompanyByUuid(response: GetCompanyByUserUuidResponse): CompanyType {
    return {
      uuid: response.data?.uuid,
      logo: response.data?.logo,
      name: response.data?.name,
      address: response.data?.address,
      email: response.data?.email,
      phone: response.data?.phone,
      user: {
        uuid: response.data?.user?.uuid,
        firstName: response.data?.user?.firstname,
        lastName: response.data?.user?.lastname,
      },
    };
  },
  formatGetCompaniesByUserUuid(
    response: GetCompaniesByUserUuidResponse
  ): CompanyType[] {
    if (!response.data) return [];
    return response.data?.map((company) => ({
      uuid: company?.uuid,
      logo: company?.logo,
      name: company?.name,
      address: company?.address,
      email: company?.email,
      phone: company?.phone,
      user: {
        uuid: company?.user?.uuid,
        firstName: company?.user?.firstname,
        lastName: company?.user?.lastname,
        role: company?.user?.role,
      },
    }));
  },
  formatGetBranchesByCompanyUuid(
    response: GetBranchesByCompanyUuidResponse
  ): CompanyBranchType[] {
    if (!response.data) return [];
    return response.data?.map((branch) => ({
      uuid: branch?.uuid,
      name: branch?.name,
      address: branch?.address,
      email: branch?.email,
      phone: branch?.phone,
      image: branch?.image ?? "",
      company: {
        uuid: branch?.company?.uuid ?? "",
        logo: branch?.company?.logo ?? "",
        name: branch?.company?.name ?? "",
        address: branch?.company?.address ?? "",
        email: branch?.company?.email ?? "",
        phone: branch?.company?.phone ?? "",
      },
    }));
  },
  formatGetBranch(response: GetBranchResponse): CompanyBranchType {
    return {
      uuid: response?.data?.uuid ?? "",
      name: response?.data?.name ?? "",
      address: response?.data?.address ?? "",
      email: response?.data?.email ?? "",
      phone: response?.data?.phone ?? "",
      image: response?.data?.image ?? "",
      company: {
        uuid: response?.data?.company?.uuid ?? "",
        logo: response?.data?.company?.logo ?? "",
        name: response?.data?.company?.name ?? "",
        address: response?.data?.company?.address ?? "",
        email: response?.data?.company?.email ?? "",
        phone: response?.data?.company?.phone ?? "",
      },
    };
  },
  formatGetDivisionsByCompanyUuid(
    response: getDivisionsByCompanyUuidResponse
  ): DivisionType[] {
    if (!response.data) return [];
    return response.data?.map((division) => ({
      uuid: division?.uuid,
      name: division?.name,
      desc: division?.desc,
      company_uuid: division?.company_uuid,
      responsible: {
        uuid: division?.responsible?.uuid ?? "",
        name: division?.responsible?.name ?? "",
      },
    }));
  },
  formatCreateDivisionResponse(response: CreateDivisionResponse): DivisionType {
    return {
      uuid: response?.data?.uuid ?? "",
      name: response?.data?.name ?? "",
      desc: response?.data?.desc ?? "",
      company_uuid: response?.data?.company_uuid ?? "",
      responsible: {
        uuid: response?.data?.responsible?.uuid ?? "",
        name: response?.data?.responsible?.name ?? "",
      },
    };
  },
  formatUpdateDivisionResponse(response: UpdateDivisionResponse): DivisionType {
    return {
      uuid: response?.data?.uuid ?? "",
      name: response?.data?.name ?? "",
      desc: response?.data?.desc ?? "",
      company_uuid: response?.data?.company_uuid ?? "",
      responsible: {
        uuid: response?.data?.responsible?.uuid ?? "",
        name: response?.data?.responsible?.name ?? "",
      },
    };
  },
  formatGetSubDivisionsByCompanyUuid(
    response: getSubDivisionsByCompanyUuidResponse
  ): SubDivisionType[] {
    if (!response.data) return [];
    return response.data?.map((subDivision) => ({
      uuid: subDivision?.uuid,
      name: subDivision?.name,
      desc: subDivision?.description,
      divisions: {
        uuid: subDivision?.department_group?.uuid ?? "",
        name: subDivision?.department_group?.name ?? "",
      },
      employees:
        subDivision?.employees?.map((employee) => ({
          uuid: employee?.uuid ?? "",
          name: employee?.name ?? "",
          email: employee?.email ?? "",
        })) || [],
    }));
  },
  formatCreateSubDivisionResponse(
    response: CreateSubDivisionResponse
  ): SubDivisionType {
    return {
      uuid: response?.data?.uuid ?? "",
      name: response?.data?.name ?? "",
      desc: response?.data?.description ?? "",
      divisions: {
        uuid: response?.data?.department_group?.uuid ?? "",
        name: response?.data?.department_group?.name ?? "",
      },
      employees:
        response?.data?.employees?.map((employee) => ({
          uuid: employee?.uuid ?? "",
          name: employee?.name ?? "",
          email: employee?.email ?? "",
        })) || [],
    };
  },
  formatUpdateSubDivisionResponse(
    response: UpdateSubDivisionResponse
  ): SubDivisionType {
    return {
      uuid: response?.data?.uuid ?? "",
      name: response?.data?.name ?? "",
      desc: response?.data?.description ?? "",
      divisions: {
        uuid: response?.data?.department_group?.uuid ?? "",
        name: response?.data?.department_group?.name ?? "",
      },
      employees:
        response?.data?.employees?.map((employee) => ({
          uuid: employee?.uuid ?? "",
          name: employee?.name ?? "",
          email: employee?.email ?? "",
        })) || [],
    };
  },
  formatCreateEmployeeHistoryResponse(
    response: CreateEmployeeHistoryResponse
  ): EmployeeHistoryType {
    return {
      uuid: response?.data?.uuid ?? "",
      employee: {
        uuid: response?.data?.employee?.uuid ?? "",
        full_name: response?.data?.employee?.full_name ?? "",
        email: response?.data?.employee?.email ?? "",
      },
      company: {
        uuid: response?.data?.company?.uuid ?? "",
        name: response?.data?.company?.name ?? "",
      },
      role: {
        uuid: response?.data?.role?.uuid ?? "",
        name: response?.data?.role?.name ?? "",
      },
      position: response?.data?.position ?? "",
      is_present: response?.data?.is_present ?? false,
      start_date: response?.data?.start_date ?? "",
      end_date: response?.data?.end_date ?? null,
    };
  },
  formatImportEmployeeData(response: ImportEmployeeResponse): EmployeeType[] {
    if (!response.data) return [];
    return response.data?.map((employee) => ({
      company_uuid: employee?.company?.uuid ?? "",
      user_uuid: employee?.user_uuid ?? "",
      employee_uuid: employee?.employee_uuid ?? "",
      role: {
        name: employee?.role?.name ?? "",
        uuid: employee?.role?.uuid ?? "",
      },
      name: {
        fullname: employee?.full_name ?? "",
        firstname: employee?.first_name ?? "",
        lastname: employee?.last_name ?? "",
      },
      phone: employee?.phone ?? "",
      email: employee?.email ?? "",
      dob: employee?.dob ?? "",
      gender: employee?.gender ?? "",
      is_freelance: employee?.is_freelance ?? false,
    }));
  },
  formatImportEmployeeHistoryData(
    response: ImportEmployeeResponse
  ): EmployeeHistoryType[] {
    return response.data?.flatMap((user) =>
      user.employment_histories?.map((history) => ({
        uuid: history?.uuid ?? "",
        employee: {
          uuid: history?.employee?.uuid ?? "",
          full_name: history?.employee?.full_name ?? "",
          email: history?.employee?.email ?? "",
        },
        company: {
          uuid: history?.company?.uuid ?? "",
          name: history?.company?.name ?? "",
        },
        role: {
          uuid: history?.role?.uuid ?? "",
          name: history?.role?.name ?? "",
        },
        position: history?.position ?? "",
        is_present: history?.is_present ?? false,
        start_date: history?.start_date ?? "",
        end_date: history?.end_date ?? null,
      }))
    );
  },
  formatGetEmployeeByCompanyUuid(
    response: GetEmployeeByCompanyUuidResponse
  ): EmployeeType[] {
    if (!response.data) return [];

    return response.data.map((employee) => {
      const formattedEmployee: EmployeeType = {
        company_uuid: employee.company?.uuid,
        user_uuid: employee.user_uuid,
        employee_uuid: employee.employee_uuid,
        phone: employee.phone,
        email: employee.email,
        dob: employee.dob,
        gender: employee.gender,
        is_freelance: employee.is_freelance,
        role: {
          name: employee.role?.name ?? "",
          uuid: employee.role?.uuid ?? "",
        },
        name: {
          fullname: employee.full_name ?? "",
          firstname: employee.first_name ?? "",
          lastname: employee.last_name ?? "",
        },
      };
      if (employee.department?.uuid) {
        formattedEmployee.subDivision = {
          uuid: employee.department.uuid,
          name: employee.department.name ?? "",
        };
      }
      if (employee.termination?.date || employee.termination?.reason) {
        formattedEmployee.termination = {
          reason: employee.termination.reason ?? null,
          date: employee.termination.date ?? null,
        };
      }
      return formattedEmployee;
    });
  },
  formatCreateEmployeeResponse(response: CreateEmployeeResponse): EmployeeType {
    return {
      company_uuid: response?.data?.company?.uuid ?? "",
      user_uuid: response?.data?.user_uuid ?? "",
      employee_uuid: response?.data?.employee_uuid ?? "",
      role: {
        name: response?.data?.role?.name ?? "",
        uuid: response?.data?.role?.uuid ?? "",
      },
      name: {
        fullname: response?.data?.full_name ?? "",
        firstname: response?.data?.first_name ?? "",
        lastname: response?.data?.last_name ?? "",
      },
      phone: response?.data?.phone ?? "",
      email: response?.data?.email ?? "",
      dob: response?.data?.dob ?? "",
      gender: response?.data?.gender ?? "",
      is_freelance: response?.data?.is_freelance ?? false,
    };
  },
  formatUpdateEmployeeResponse(response: UpdateEmployeeResponse): EmployeeType {
    return {
      company_uuid: response.data?.company?.uuid ?? "",
      user_uuid: response.data?.user_uuid ?? "",
      employee_uuid: response.data?.employee_uuid ?? "",
      role: {
        name: response?.data?.role?.name ?? "",
        uuid: response?.data?.role?.uuid ?? "",
      },
      name: {
        fullname: response?.data?.full_name ?? "",
        firstname: response?.data?.first_name ?? "",
        lastname: response?.data?.last_name ?? "",
      },
      phone: response.data?.phone ?? "",
      email: response.data?.email ?? "",
      dob: response.data?.dob ?? "",
      gender: response.data?.gender ?? "",
      is_freelance: response.data?.is_freelance ?? false,
    };
  },
  formatGetRolesByCompanyUuid(
    response: GetRoleByCompanyUuidResponse
  ): RoleType[] {
    if (!Array.isArray(response.data)) return [];
    return response.data.map((role) => ({
      uuid: role?.uuid ?? "",
      name: role?.name ?? "",
    }));
  },
  formatGetEmployeeDashboard(response: any) {
    const data = response.data?.data ?? {}
    return {
      attendance_rate: data.attendance_rate ?? 0,
      total_hours: data.total_hours ?? 0,
      recent_requests: data.recent_requests ?? [],
      // upcoming_events: data.upcoming_events ?? [],
    }
  },
  formatAttendance(att: any) {
    if (!att) return null
    const status: "OPEN" | "PRESENT" | "ABSENT" =
      att.clock_in_at && att.clock_out_at
        ? "PRESENT"
        : att.clock_in_at
          ? "OPEN"
          : "ABSENT"

    return {
      uuid: att.uuid,
      work_date: att.work_date ? att.work_date.split("T")[0] : null,
      clock_in_at: att.clock_in_at ? formatTime(att.clock_in_at) : null,
      clock_out_at: att.clock_out_at ? formatTime(att.clock_out_at) : null,
      is_home_office: att.is_home_office ?? false,
      notes: att.notes ?? "",
      status, // ✅ sekarang type-nya literal union, bukan string biasa
    }
  },

  formatAttendanceList(data: any): any[] {
    // Kalau bukan array, return kosong tapi kasih warning
    if (!Array.isArray(data)) {
      console.warn("⚠️ formatAttendanceList got invalid data:", data)
      return []
    }

    // Map data attendance agar UI dapat nilai konsisten
    return data.map((a: any) => ({
      uuid: a.uuid || "",
      work_date: a.work_date
        ? a.work_date.split("T")[0] // potong jadi YYYY-MM-DD
        : "",
      clock_in_at: a.clock_in_at ? new Date(a.clock_in_at).toLocaleTimeString() : null,
      clock_out_at: a.clock_out_at ? new Date(a.clock_out_at).toLocaleTimeString() : null,
      is_home_office: !!a.is_home_office,
      notes: a.notes || "",
      status:
        a.status && typeof a.status === "string"
          ? a.status.toUpperCase()
          : a.clock_in_at && a.clock_out_at
            ? "PRESENT"
            : a.clock_in_at
              ? "OPEN"
              : "ABSENT",
    }))
  },
  /** Format single edit attendance request (view or detail) */
  formatAttendanceEdit(att: any) {
    if (!att) return null
    return {
      id: att.id,
      uuid: att.uuid,
      employee_uuid: att.employee_uuid,
      employee_name: att.employee?.user?.first_name
        ? `${att.employee.user.first_name} ${att.employee.user.last_name ?? ""}`.trim()
        : att.employee_name ?? "Unknown",

      company_uuid: att.company_uuid,
      company_name: att.company?.name ?? null,

      work_date: att.work_date ? att.work_date.split("T")[0] : null,
      edit_type: att.edit_type ?? "", // "clock_in", "clock_out", "full_day"
      original_time: att.original_time ? new Date(att.original_time).toLocaleTimeString("en-US", { hour12: false }) : null,
      requested_time: att.requested_time ? new Date(att.requested_time).toLocaleTimeString("en-US", { hour12: false }) : null,
      reason: att.reason ?? "",
      status: att.status ?? "PENDING", // default value
      reviewed_by: att.reviewed_by_user
        ? `${att.reviewed_by_user.first_name} ${att.reviewed_by_user.last_name ?? ""}`.trim()
        : null,
      reviewed_at: att.reviewed_at
        ? new Date(att.reviewed_at).toLocaleString("en-US")
        : null,
      created_at: att.created_at
        ? new Date(att.created_at).toLocaleString("en-US")
        : null,
    }
  },

  /** Format list of edit attendance requests (for employee or HR view) */
  formatAttendanceEditList(res: any) {
    const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
    return list.map((att: any) => ({
      id: att.id,
      uuid: att.uuid,
      work_date: att.work_date ? att.work_date.split("T")[0] : null,
      edit_type: att.edit_type ?? "",
      original_time: att.original_time
        ? new Date(att.original_time).toLocaleTimeString("en-US", { hour12: false })
        : null,
      requested_time: att.requested_time
        ? new Date(att.requested_time).toLocaleTimeString("en-US", { hour12: false })
        : null,
      reason: att.reason ?? "",
      status: att.status ?? "PENDING",
      employee_name: att.employee?.user
        ? `${att.employee.user.first_name} ${att.employee.user.last_name ?? ""}`.trim()
        : att.employee_name ?? "-",
      reviewed_by: att.reviewed_by_user
        ? `${att.reviewed_by_user.first_name} ${att.reviewed_by_user.last_name ?? ""}`.trim()
        : null,
    }))
  }


};
