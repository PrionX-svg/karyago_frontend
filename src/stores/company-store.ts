import { CompanyBranchType, CompanyType } from "@/lib/types/company-type";
import { create } from "zustand";

type CompanyStore = {
    company: CompanyType[];
    companyBranch: CompanyBranchType[];
    setCompany: (company: CompanyType[]) => void;
    setCompanyBranch: (branch: CompanyBranchType[]) => void;
    addCompanyBranch: (branch: CompanyBranchType) => void;
    removeCompany: (uuid: string) => void;
    removeCompanyBranch: (uuid: string) => void;
};

export const useCompanyStore = create<CompanyStore>((set) => ({
    company: [],
    companyBranch: [],
    setCompany: (company) => set({ company }),
    setCompanyBranch: (branch) => set({ companyBranch: branch }),
    addCompanyBranch: (branch) =>
        set((state) => ({ companyBranch: [...state.companyBranch, branch] })),
    removeCompany: (uuid) =>
        set((state) => ({
            company: state.company.filter((company) => company.uuid !== uuid),
        })),
    removeCompanyBranch: (uuid) =>
        set((state) => ({
            companyBranch: state.companyBranch.filter(
                (branch) => branch.uuid !== uuid
            ),
        })),
}));
