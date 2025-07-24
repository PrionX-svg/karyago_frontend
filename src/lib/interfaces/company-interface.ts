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

export interface GetCompanyByUserUuidResponse {
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

export interface GetCompaniesByUserUuidResponse {
    data: Array<{
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
            role: string;
        };
    }>;
    message: string;
    status: string;
}

export interface GetBranchesByCompanyUuidResponse {
    data: Array<{
        uuid: string;
        name: string;
        address: string;
        email: string;
        phone: string;
        company: {
            uuid: string;
            logo: string;
            name: string;
            address: string;
            email: string;
            phone: string;
        };
    }>;
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

export interface getDivisionsByCompanyUuidResponse {
    data: Array<{
        uuid: string;
        company_uuid: string;
        responsible: {
            uuid: string;
            name: string;
        } | null;
        name: string;
        desc: string;
    }>;
    page: number;
    limit: number;
    total: number;
    filtered: number;
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

export interface getSubDivisionsByCompanyUuidResponse {
    data: Array<{
        uuid: string;
        name: string;
        description: string;
        department_group: {
            uuid: string;
            name: string;
        }
        employees: Array<{
            uuid: string;
            name: string;
            email: string
        }>
    }>;
    page: number;
    limit: number;
    total: number;
    filtered: number;
}