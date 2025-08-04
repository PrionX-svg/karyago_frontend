export interface GetMeResponse {
  data: {
    user_uuid: string;
    full_name: string;
    email: string;
    phone: string;
    gender: string;
    dob: string;
    is_freelance: boolean;
    role: {
      uuid: string;
      name: string;
    };
    branch: {
      uuid: string;
      name: string;
    };
  };
}
