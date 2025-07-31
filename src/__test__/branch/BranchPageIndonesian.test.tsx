import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import BranchPage from "@/app/[locale]/[company]/branch/page";

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(() => "encrypted-uuid"),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 1,
};

// Mock dependencies
jest.mock("@/components/branch/add-branch-dialog", () => ({
  AddBranchDialog: (props: any) => (
    <div data-testid="add-branch-dialog" {...props} />
  ),
}));
jest.mock("@/components/branch/update-branch-dialog", () => ({
  UpdateBranchDialog: (props: any) => (
    <div data-testid="update-branch-dialog" {...props} />
  ),
}));
jest.mock("@/components/ui/dialog", () => ({
  Dialog: (props: any) => <div data-testid="dialog" {...props} />,
  DialogContent: (props: any) => (
    <div data-testid="dialog-content" {...props} />
  ),
  DialogHeader: (props: any) => <div data-testid="dialog-header" {...props} />,
  DialogTitle: (props: any) => <div data-testid="dialog-title" {...props} />,
  DialogDescription: (props: any) => (
    <div data-testid="dialog-description" {...props} />
  ),
  DialogFooter: (props: any) => <div data-testid="dialog-footer" {...props} />,
}));
jest.mock("@/lib/queries/company-queries", () => {
  const mockDecrypt = jest.fn(async (val) => "decrypted-uuid");
  return {
    __esModule: true,
    default: {
      useDeleteBranch: jest.fn(() => ({
        deleteBranch: jest.fn(),
        isDeletingBranch: false,
      })),
      useUpdateBranch: jest.fn(() => ({
        updateBranch: jest.fn(),
        isUpdatingBranch: false,
      })),
      useCreateBranch: jest.fn(() => ({
        createBranch: jest.fn(),
        isCreatingBranch: false,
      })),
      useGetBranchesByCompanyUuid: jest.fn(() => ({
        isFetchingBranches: false,
      })),
    },
    decrypt: mockDecrypt,
  };
});
jest.mock("@/stores/company-store", () => ({
  useCompanyStore: jest.fn(() => [
    {
      uuid: "1",
      name: "Branch 1",
      address: "Address 1",
      email: "branch1@email.com",
      phone: "1234567890",
      company: {
        uuid: "c1",
        logo: "",
        name: "",
        address: "",
        email: "",
        phone: "",
      },
    },
  ]),
}));
jest.mock("@/lib/types/company-type", () => ({
  CompanyBranchType: jest.fn(),
}));

describe("BranchPage Component (Indonesian)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing and shows add branch dialog", async () => {
    render(<BranchPage />);
    await waitFor(() => {
      expect(screen.getByTestId("add-branch-dialog")).toBeInTheDocument();
    });
  });

  it("renders update branch dialog", async () => {
    render(<BranchPage />);
    await waitFor(() => {
      expect(screen.getByTestId("update-branch-dialog")).toBeInTheDocument();
    });
  });

  it("renders delete dialog", async () => {
    render(<BranchPage />);
    await waitFor(() => {
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });
  });

  it("shows branch data from store", async () => {
    render(<BranchPage />);
    await waitFor(() => {
      expect(
        screen.getByText(
          "Kelola dan atur lokasi perusahaan Anda secara efisien"
        )
      ).toBeInTheDocument();
    });
  });
});
