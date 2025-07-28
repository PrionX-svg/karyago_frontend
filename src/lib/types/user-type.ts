export type UserType = {
  uuid: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  isFreelance: boolean;
  role: {
    name: string;
    uuid: string;
  };
  branch?: {
    uuid: string;
    name: string;
  };
};
