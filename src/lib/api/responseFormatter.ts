import { getDivisionsByCompanyUuidResponse, getSubDivisionsByCompanyUuidResponse } from "../interfaces/company-interface";
import { GetMeResponse } from "../interfaces/user-interface";
import { DivisionType, SubDivisionType } from "../types/company-type";
import { UserType } from "../types/user-type";

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
        if(!response.data) return [];
        return response.data.map(subDivision => ({
            uuid: subDivision.uuid,
            department_group_uuid: subDivision.department_group_uuid,
            name: subDivision.name,
            desc: subDivision.desc,
        }));
    }
}