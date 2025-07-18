import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";

// global mocks
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    query: {},
    pathname: "",
    asPath: "",
    prefetch: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

jest.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string, values?: Record<string, any>) => {
    return `${namespace}.${key}${values ? ` (${JSON.stringify(values)})` : ""}`;
  },
}));

jest.mock("@/lib/get-timezone", () => ({
  getClientUTCOffset: () => "+07:00",
}));

jest.mock("@/lib/get-api", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
}));

jest.mock("@/lib/post-api", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
}));

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => ({
    get: (key: string) => (key === "token" ? "test-token" : null),
  }),
  useRouter: jest.fn(),
}));

// jest-dom type declarations
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveValue(value: string | number): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toHaveClass(className: string): R;
      toBeGreaterThan(value: number): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledWith(...args: unknown[]): R;
    }
  }
}

export {};
