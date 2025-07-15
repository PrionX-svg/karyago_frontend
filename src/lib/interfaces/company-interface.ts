export interface CreateCompanyResponse {
    data: {
        uuid: string;
        logo: string;
        name: string;
        address: string;
        email: string;
        phone: string;
        user: {
            uuid: string;
            firstname: string;
            lastname: string;
        };
    };
    message: string;
    status: string;
}

export interface CompanyPayload {
    user_uuid: string
    name: string
    address: string
    email: string
    phone: string
    logo?: string
}

export interface BranchPayload {
    company_uuid: string
    name: string
    address: string
    email: string
    phone: string
}

export interface DivisionPayload {
    id?: string;
    name: string
    company_uuid: string
    desc: string
}

export interface CreateDivisionResponse {
    data: {
        uuid: string;
        name: string;
        desc: string;
        company_uuid: string;
        responsible_uuid: string | null;
    };
    message: string;
    status: string;
}

export interface SubDivisionPayload {
    department_group_uuid: string;
    name: string;
    desc: string;
}

export interface CreateSubDivisionResponse {
    data: {
        uuid: string;
        department_group_uuid: string;
        name: string;
        description: string;
    };
    message: string;
    status: string;
}