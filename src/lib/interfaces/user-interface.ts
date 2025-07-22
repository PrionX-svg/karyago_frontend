export interface GetMeResponse {
    data: {
        user_uuid: string;
        full_name: string;
        email: string;
        phone: string;
        gender: string;
        dob: string;
        is_freelance: boolean;
        role: string;
        branch: {
            uuid: string;
            name: string;
        }
    }
}