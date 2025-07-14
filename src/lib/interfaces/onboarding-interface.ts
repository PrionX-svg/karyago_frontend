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

export type DivisionPayload = {
    id?: string;
    name: string
    company_uuid: string
    desc: string
}

export type SubDivisionPayload = {
    id?: string
    division_uuid: string
    name: string
    desc: string
}
