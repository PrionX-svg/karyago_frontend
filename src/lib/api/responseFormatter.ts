import { GetBranchesByCompanyUuidResponse, GetCompanyByUserUuidResponse, getDivisionsByCompanyUuidResponse, getSubDivisionsByCompanyUuidResponse } from "../interfaces/company-interface";
import { GetMeResponse } from "../interfaces/user-interface";
import { CompanyBranchType, CompanyType, DivisionType, SubDivisionType } from "../types/company-type";
import { UserType } from "../types/user-type";
import { EmployeeHistoryType, EmployeeType } from "../types/employee-type";
import { CreateEmployeeHistoryResponse, CreateEmployeeResponse, GetEmployeeByCompanyUuidResponse, ImportEmployeeResponse, UpdateEmployeeResponse } from "../interfaces/employee-interface";
import { RoleType } from "../types/role-type";
import { GetRoleByCompanyUuidResponse } from "../interfaces/role-interface";

export const responseFormatter = {
    formatUserData(response: GetMeResponse): UserType {
        return {
            uuid: response.data?.user_uuid,
            fullName: response.data?.full_name,
            email: response.data?.email,
            phone: response.data?.phone,
            gender: response.data?.gender,
            dob: response.data?.dob,
            isFreelance: response.data?.is_freelance,
            role: response.data?.role,
            branch: {
                uuid: response.data?.branch.uuid,
                name: response.data?.branch.name
            }
        }
    },
    formatGetCompanyByUserUuid(response: GetCompanyByUserUuidResponse): CompanyType {
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
                lastName: response.data?.user?.lastname
            }
        };
    },
    formatGetBranchesByCompanyUuid(response: GetBranchesByCompanyUuidResponse): CompanyBranchType[] {
        if (!response.data) return [];
        return response.data?.map(branch => ({
            uuid: branch?.uuid,
            company_uuid: branch?.company?.uuid,
            name: branch?.name,
            address: branch?.address,
            email: branch?.email,
            phone: branch?.phone
        }));
    },
    formatGetDivisionsByCompanyUuid(response: getDivisionsByCompanyUuidResponse): DivisionType[] {
        if (!response.data) return [];
        return response.data?.map(division => ({
            uuid: division?.uuid,
            name: division?.name,
            desc: division?.desc,
            company_uuid: division?.company_uuid,
            responsible_uuid: division?.responsible_uuid
        }));
    },
    formatGetSubDivisionsByCompanyUuid(response: getSubDivisionsByCompanyUuidResponse): SubDivisionType[] {
        if (!response.data) return [];
        return response.data?.map(subDivision => ({
            uuid: subDivision?.uuid,
            department_group_uuid: subDivision?.department_group_uuid,
            name: subDivision?.name,
            desc: subDivision?.desc,
        }));
    },
    formatCreateEmployeeHistoryResponse(response: CreateEmployeeHistoryResponse): EmployeeHistoryType {
        return {
            uuid: response?.data?.uuid ?? "",
            employee: {
                uuid: response?.data?.employee?.uuid ?? "",
                full_name: response?.data?.employee?.full_name ?? "",
                email: response?.data?.employee?.email ?? ""
            },
            company: {
                uuid: response?.data?.company?.uuid ?? "",
                name: response?.data?.company?.name ?? ""
            },
            role: {
                uuid: response?.data?.role?.uuid ?? "",
                name: response?.data?.role?.name ?? ""
            },
            position: response?.data?.position ?? "",
            is_present: response?.data?.is_present ?? false,
            start_date: response?.data?.start_date ?? "",
            end_date: response?.data?.end_date ?? null
        }
    },
    formatImportEmployeeData(response: ImportEmployeeResponse): EmployeeType[] {
        if (!response.data) return [];
        return response.data?.map(employee => ({
            company_uuid: employee?.company?.uuid ?? "",
            user_uuid: employee?.user_uuid ?? "",
            employee_uuid: employee?.employee_uuid ?? "",
            role: {
                name: employee?.role?.name ?? "",
                uuid: employee?.role?.uuid ?? ""
            },
            name: {
                fullname: employee?.full_name ?? "",
                firstname: employee?.first_name ?? "",
                lastname: employee?.last_name ?? ""
            },
            phone: employee?.phone ?? "",
            email: employee?.email ?? "",
            dob: employee?.dob ?? "",
            gender: employee?.gender ?? "",
            is_freelance: employee?.is_freelance ?? false,
        }))
    },
    formatImportEmployeeHistoryData(response: ImportEmployeeResponse): EmployeeHistoryType[] {
        return response.data?.flatMap(user =>
            user.employment_histories?.map(history => ({
                uuid: history?.uuid ?? "",
                employee: {
                    uuid: history?.employee?.uuid ?? "",
                    full_name: history?.employee?.full_name ?? "",
                    email: history?.employee?.email ?? ""
                },
                company: {
                    uuid: history?.company?.uuid ?? "",
                    name: history?.company?.name ?? ""
                },
                role: {
                    uuid: history?.role?.uuid ?? "",
                    name: history?.role?.name ?? ""
                },
                position: history?.position ?? "",
                is_present: history?.is_present ?? false,
                start_date: history?.start_date ?? "",
                end_date: history?.end_date ?? null
            }))
        )
    },
    formatGetEmployeeByCompanyUuid(response: GetEmployeeByCompanyUuidResponse): EmployeeType[] {
        if (!response.data) return [];
        return response.data?.map(employee => ({
            company_uuid: employee?.company?.uuid,
            user_uuid: employee?.user_uuid,
            employee_uuid: employee?.employee_uuid,
            role: {
                name: employee?.role?.name ?? "",
                uuid: employee?.role?.uuid ?? ""
            },
            name: {
                fullname: employee?.full_name ?? "",
                firstname: employee?.first_name ?? "",
                lastname: employee?.last_name ?? ""
            },
            phone: employee?.phone,
            email: employee?.email,
            dob: employee?.dob,
            gender: employee?.gender,
            is_freelance: employee?.is_freelance,
        }))
    },
    formatCreateEmployeeResponse(response: CreateEmployeeResponse): EmployeeType {
        return {
            company_uuid: response?.data?.company?.uuid ?? "",
            user_uuid: response?.data?.user_uuid ?? "",
            employee_uuid: response?.data?.employee_uuid ?? "",
            role: {
                name: response?.data?.role?.name ?? "",
                uuid: response?.data?.role?.uuid ?? ""
            },
            name: {
                fullname: response?.data?.full_name ?? "",
                firstname: response?.data?.first_name ?? "",
                lastname: response?.data?.last_name ?? ""
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
                uuid: response?.data?.role?.uuid ?? ""
            },
            name: {
                fullname: response?.data?.full_name ?? "",
                firstname: response?.data?.first_name ?? "",
                lastname: response?.data?.last_name ?? ""
            },
            phone: response.data?.phone ?? "",
            email: response.data?.email ?? "",
            dob: response.data?.dob ?? "",
            gender: response.data?.gender ?? "",
            is_freelance: response.data?.is_freelance ?? false,
        }
    },
    formatGetRolesByCompanyUuid(response: GetRoleByCompanyUuidResponse): RoleType[] {
        if (!Array.isArray(response.data)) return [];
        return response.data.map(role => ({
            uuid: role?.uuid ?? "",
            name: role?.name ?? ""
        }));
    },
}