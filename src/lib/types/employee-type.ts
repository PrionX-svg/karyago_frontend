export type EmployeeType = {
    company_uuid?: string;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    dob: string | null;
    gender: string | null;
    is_freelance: boolean;
}