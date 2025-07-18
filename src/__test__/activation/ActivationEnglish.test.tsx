import React, { use } from "react";
import { render, screen, waitFor, fireEvent, act, within } from "@testing-library/react";
import ActivationPage from "@/app/[locale]/activation/page";
import postAPI from "@/lib/api/postAPI";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { mock } from "node:test";

jest.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string, vals?: Record<string, any>) =>
    vals ? `${ns}.${key} (${JSON.stringify(vals)})` : `${ns}.${key}`,
}));

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock("@/lib/api/postAPI", () => jest.fn());
jest.mock("sonner", () => ({
  toast: { error: jest.fn() },
}));

// Stub window.location for redirect tests
beforeAll(() => {
  delete (window as any).location;
  (window as any).location = { href: "" };
});

const mockUseSearchParams = useSearchParams as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockPostAPI = postAPI as jest.MockedFunction<typeof postAPI>;
const mockToastError = toast.error as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockUseSearchParams.mockReturnValue(
    {
      get: (key: string) => (key === "token" ? "test-token" : null),
    } as any
  );

  mockUsePathname.mockReturnValue("/en/activation");

  mockUseRouter.mockReturnValue(
    {
      push: jest.fn(),
      replace: jest.fn(),
    });
});

describe("Activation Test Black Box", () => {
  it("show loadingStep initally", () => {
    mockPostAPI.mockImplementation(() => new Promise(() => { }));
    render(<ActivationPage />);
    expect(screen.getByText("activation.title1")).toBeInTheDocument();
  });
  it("show successStep if the activation success", async () => {
    mockPostAPI.mockResolvedValue({ status: 200, data: {} });
    render(<ActivationPage />);
    expect(
      await screen.findByText("activation.welcomeTitle")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/activation.redirectMessage/)
    ).toBeInTheDocument();
  });
  it("show errorStep if the activation failed", async () => {
    mockPostAPI.mockRejectedValueOnce(new Error("oops"));
    render(<ActivationPage />);
    // wait for the error title
    expect(await screen.findByText("activation.title3")).toBeInTheDocument();
    // error message & retry button
    expect(screen.getByText("oops")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /activation\.reqNewLink/i })
    ).toBeInTheDocument();

    // grab both back-to-login links and assert the second one
    const backLinks = screen.getAllByRole("link", {
      name: /navigation\.backToLogin/i,
    });
    expect(backLinks).toHaveLength(2);
    expect(backLinks[1]).toHaveAttribute("href", "/auth");
  });
  it("continue to otpsentStep", async () => {
    mockPostAPI.mockRejectedValueOnce(new Error("expired"));
    mockPostAPI.mockResolvedValueOnce({ status: 200, data: {} });

    render(<ActivationPage />);

    const retryBtn = await screen.findByRole("button", {
      name: /activation.reqNewLink/i,
    });
    fireEvent.click(retryBtn);

    expect(
      await screen.findByText("activation.resendTitle")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /activation.goToSignIn/i })
    ).toHaveAttribute("href", "/auth");
  });
});

describe("Activation Test White Box", () => {
  it("call postAPI('/auth/verify') with the activation token on mount", async () => {
    mockPostAPI.mockResolvedValueOnce({ status: 200, data: {} });
    render(<ActivationPage />);
    await waitFor(() =>
      expect(mockPostAPI).toHaveBeenCalledWith(
        { uuid: "test-token" },
        "/auth/verify"
      )
    );
  });

  it(" call postAPI('/auth/resend-verification') when try to retry", async () => {
    mockPostAPI
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce({ status: 200, data: {} });

    render(<ActivationPage />);

    const retry = await screen.findByRole("button", {
      name: /activation.reqNewLink/i,
    });
    fireEvent.click(retry);

    await waitFor(() =>
      expect(mockPostAPI).toHaveBeenCalledWith(
        { uuid: "test-token" },
        "/auth/resend-verification"
      )
    );
  });

  it("automatic redirect SuccessStep after the countdown was end", async () => {
    jest.useFakeTimers();
    mockPostAPI.mockResolvedValueOnce({ status: 200, data: {} });
    render(<ActivationPage />);

    // tunggu SuccessStep
    await screen.findByText("activation.welcomeTitle");

    // jalankan 10 detik
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(window.location.href).toBe("/auth");
    jest.useRealTimers();
  });

  it("show the toast error if resend-verification returns 500 + user already verified", async () => {
    mockPostAPI
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce({ status: 500, data: { message: "user already verified" } });

    render(<ActivationPage />);
    const retryBtn = await screen.findByRole("button", {
      name: /activation.reqNewLink/i,
    });
    fireEvent.click(retryBtn);

    await waitFor(() =>
      expect(mockToastError).toHaveBeenCalledWith("api.userAlreadyVerified")
    );
  });
});