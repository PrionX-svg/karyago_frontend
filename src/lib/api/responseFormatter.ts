import { GetBranchesByCompanyUuidResponse, GetCompanyByUserUuidResponse, getDivisionsByCompanyUuidResponse, getSubDivisionsByCompanyUuidResponse } from "../interfaces/company-interface";
import { GetMeResponse } from "../interfaces/user-interface";
import { CompanyBranchType, CompanyType, DivisionType, SubDivisionType } from "../types/company-type";
import { UserType } from "../types/user-type";
import { EmployeeType } from "../types/employee-type";
import { GetEmployeeByCompanyUuidResponse } from "../interfaces/employee-interface";

export const responseFormatter = {
    formatUserData(response: GetMeResponse): UserType {
        return {
            uuid: response.data.user_uuid,
            fullName: response.data.full_name,
            email: response.data.email,
            phone: response.data.phone,
            gender: response.data.gender,
            dob: response.data.dob,
            isFreelance: response.data.is_freelance,
            role: response.data.role,
            branch: {
                uuid: response.data.branch.uuid,
                name: response.data.branch.name
            }
        }
    },
    formatGetCompanyByUserUuid(response: GetCompanyByUserUuidResponse): CompanyType {
        return {
            uuid: response.data.uuid,
            logo: response.data.logo,
            name: response.data.name,
            address: response.data.address,
            email: response.data.email,
            phone: response.data.phone,
            user: {
                uuid: response.data.user.uuid,
                firstName: response.data.user.firstname,
                lastName: response.data.user.lastname
            }
        };
    },
    formatGetBranchesByCompanyUuid(response: GetBranchesByCompanyUuidResponse): CompanyBranchType[] {
        if (!response.data) return [];
        return response.data.map(branch => ({
            uuid: branch.uuid,
            company_uuid: branch.company.uuid,
            name: branch.name,
            address: branch.address,
            email: branch.email,
            phone: branch.phone
        }));
    },
    formatGetDivisionsByCompanyUuid(response: getDivisionsByCompanyUuidResponse): DivisionType[] {
        if (!response.data) return [];
        return response.data.map(division => ({
            uuid: division.uuid,
            name: division.name,
            desc: division.desc,
            company_uuid: division.company_uuid,
            responsible_uuid: division.responsible_uuid
        }));
    },
    formatGetSubDivisionsByCompanyUuid(response: getSubDivisionsByCompanyUuidResponse): SubDivisionType[] {
        if (!response.data) return [];
        return response.data.map(subDivision => ({
            uuid: subDivision.uuid,
            department_group_uuid: subDivision.department_group_uuid,
            name: subDivision.name,
            desc: subDivision.desc,
        }));
    },
    formatGetEmployeeByCompanyUuid(response: GetEmployeeByCompanyUuidResponse): EmployeeType[] {
    if (!response.data) return [];

    return response.data.map(employee => {
        const [firstname, ...rest] = employee.full_name.split(" ");
        const lastname = rest.join(" "); 

        return {
            firstname,
            lastname,
            user_uuid: employee.user_uuid,
            phone: employee.phone,
            email: employee.email,
            dob: employee.dob,
            gender: employee.gender,
            is_freelance: employee.is_freelance,
            company_uuid: employee.company?.uuid
        };
    });
}

}