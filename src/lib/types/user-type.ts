export type UserType = {
    uuid: string;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    dob: string;
    isFreelance: boolean;
    role: string;
    branch?: {
        uuid: string;
        name: string;
    }
}