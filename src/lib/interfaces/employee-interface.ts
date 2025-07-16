export interface GetEmployeeByCompanyUuid {
    data: Array<{
        user_uuid: string;
        full_name: string;
        email: string;
        phone: string;
        gender: string | null;
        dob: string | null;
        is_freelance: boolean;
        role: string;
        branch: {
            uuid: string;
            name: string;
        };
        termination?: {
            reason: string;
            date: string;
        };
        company:{
            uuid: string;
        }
    }>;
    filtered: number;
    limit: number;
    page: number;
    total: number;
}