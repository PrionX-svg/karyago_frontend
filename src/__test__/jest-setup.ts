import "@testing-library/jest-dom";

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
