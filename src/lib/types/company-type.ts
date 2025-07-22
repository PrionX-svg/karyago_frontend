    export type CompanyType = {
        uuid: string;
        name: string;
        address: string;
        email: string;
        phone: string;
        logo?: string;
        user: {
            uuid: string;
            firstName: string;
            lastName: string;
            role?: string;
        }
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
    name: string;
    desc: string;
    responsible_uuid?: string | null;
}

export type SubDivisionType = {
    uuid: string;
    department_group_uuid: string;
    name: string;
    desc: string;
}