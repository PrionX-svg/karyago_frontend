import { GetMeResponse } from "../interfaces/user-interface";
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
    }
}