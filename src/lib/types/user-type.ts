export type UserType = {
  userUuid: string;
  employeeUuid: string;
  name:{
    firstName: string;
    lastName: string;
    fullName: string;
  };
  email: string;
  phone: string;
  gender: string | null;
  dob: string | null;
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
