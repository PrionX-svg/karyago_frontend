export interface Role {
    uuid: string;
    name: string;
}

export interface GetRoleByCompanyUuidResponse {
    data: Role[];
    message: string;
    status: string;
}
