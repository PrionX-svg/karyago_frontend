export interface GetMeResponse {
  data: {
    user_uuid: string;
    employee_uuid: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string;
    gender: string | null;
    dob: string | null;
    is_freelance: boolean;
    role: {
      uuid: string;
      name: string;
    };
    branch: {
      uuid: string;
      name: string;
    };
    company: {
      uuid: string;
      name: string;
    };
  };
}

export interface UpdateUserPayload {
  firstname: string
  lastname: string
  email: string
  password?: string
  phone?: string
  dob?: string | null
  gender?: string | null
  is_freelance: boolean
  role_uuid?: string
  company_uuid?: string
  branch_uuid?: string
}
