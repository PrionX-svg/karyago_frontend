export interface CompanyPayload {
    user_uuid: string
    name: string
    address: string
    email: string
    phone: string
    logo?: File | string
}

export interface BranchPayload {
    company_uuid: string
    name: string
    address: string
    email: string
    phone: string
}

export type DivisionPayload = {
    id?: string;
    company_uuid: string
    responsible_uuid: string
    name: string
    description: string
}

export type SubDivisionPayload = {
    id?: string
    division_uuid: string
    name: string
    description: string
}
