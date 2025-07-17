export interface GetEmployeeByCompanyUuidResponse {
    data: {
        user_uuid: string;
        employee_uuid: string;
        first_name: string;
        last_name: string;
        full_name: string;
        email: string;
        phone: string;
        gender: string | null;
        dob: string | null;
        is_freelance: boolean;
        role: {
            name: string;
            uuid: string;
        }
        branch: {
            uuid: string;
            name: string;
        };
        company: {
            uuid: string;
        };
    }[];
    filtered: number;
    limit: number;
    page: number;
    total: number;
}

export interface CreateEmployeeResponse {
    data: {
        user_uuid: string;
        employee_uuid: string;
        first_name: string;
        last_name: string;
        full_name: string;
        email: string;
        phone: string;
        gender: string;
        dob: string;
        is_freelance: boolean;
        role: {
            name: string;
            uuid: string;
        }
        branch: {
            uuid: string;
            name: string;
        };
        company: {
            uuid: string;
        };
    };
    message?: string;
}

export interface CreateEmployeePayload {
    role_uuid?: string;
    company_uuid: string;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    password: string;
    dob: string;
    gender: string;
    is_freelance: boolean;
}

export interface CreateEmployeeHistoryPayload {
    employee_uuid: string;
    company_uuid: string;
    position: string;
    is_present: boolean;
    start_date: string;
    end_date?: string | null;
    role_uuid?: string;
}

export interface CreateEmployeeHistoryResponse {
    data: {
        uuid: string;
        employee: {
            uuid: string;
            full_name: string;
            email: string;
        };
        company: {
            uuid: string;
            name: string;
        };
        role: {
            uuid: string;
            name: string;
        };
        position: string;
        is_present: boolean;
        start_date: string;
        end_date?: string | null; 
    };
    message?: string;
}

export interface UpdateEmployeeResponse {
    data: {
        user_uuid: string;
        employee_uuid: string;
        first_name: string;
        last_name: string;
        full_name: string;
        email: string;
        phone: string;
        gender: string;
        dob: string;
        is_freelance: boolean;
        role: {
            name: string;
            uuid: string;
        }
        branch: {
            uuid: string;
            name: string;
        };
        company: {
            uuid: string;
        };
    };
    message?: string;
}

export interface UpdateEmployeePayload {
    role_uuid?: string;
    company_uuid: string;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    password: string;
    dob: string;
    gender: string;
    is_freelance: boolean;
}