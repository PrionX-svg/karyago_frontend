export type CompanyType = {
    uuid: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    logo?: string;
}

export type CompanyBranchType = {
    uuid: string;
    company_uuid: string;
    name: string;
    address: string;
    email: string;
    phone: string;
}

export type DivisionType = {
    uuid: string;
    company_uuid: string;
    responsible_uuid: string;
    name: string;
    description: string;
}

export type SubDivisionType = {
    uuid: string;
    division_uuid: string;
    name: string;
    description: string;
}