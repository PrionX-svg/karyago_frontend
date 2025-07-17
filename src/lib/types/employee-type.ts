export type EmployeeType = {
    company_uuid: string;
    user_uuid: string;
    employee_uuid: string;
    role: {
        name: string;
        uuid: string;
    }
    name: {
        fullname: string;
        firstname: string;
        lastname: string;
    }
    phone: string;
    email: string;
    dob: string | null;
    gender: string | null;
    is_freelance: boolean;
}

export type EmployeeHistoryType = {
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
}