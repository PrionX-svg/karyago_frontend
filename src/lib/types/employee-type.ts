export type EmployeeType = {
    // fullname: { fullname: string; firstname: string; lastname: string; };
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
    },
    subDivision?: {
        uuid: string;
        name: string;
    }
    branch?: {
        uuid: string
        name: string
    }
    termination?: {
        reason: string | null;
        date: string | null;
    };
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

export type MergedEmployeeType = {
    user_uuid: string;
    employee_uuid: string;
    name: {
        fullname: string;
        firstname: string;
        lastname: string;
    };
    email: string;
    phone: string;
    dob: string | null;
    gender: string | null;
    is_freelance: boolean;
    company_uuid: string;
    company_name?: string;
    role_name: string;
    role_uuid: string;
    position?: string;
    is_present?: boolean;
    start_date?: string;
    end_date?: string | null;
    source: "basic" | "history";
};

