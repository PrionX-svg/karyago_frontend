export interface RegisterForm {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    phone: string;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    timezone: string
}

export interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}