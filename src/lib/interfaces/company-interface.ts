export interface CompanyResponse {
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