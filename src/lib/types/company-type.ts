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
  };
};

export type CompanyBranchType = {
  uuid: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  image?: string;
  company: {
    uuid: string;
    logo: string;
    name: string;
    address: string;
    email: string;
    phone: string;
  };
};

export type DivisionType = {
  uuid: string;
  company_uuid: string;
  name: string;
  desc: string;
  responsible?: {
    uuid: string;
    name: string;
  };
};

export type SubDivisionType = {
  uuid: string;
  name: string;
  desc: string;
  divisions: {
    uuid: string;
    name: string;
  };
  employees: {
    uuid: string;
    name: string;
    email: string;
  }[];
};
