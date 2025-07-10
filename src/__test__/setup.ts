import "@testing-library/jest-dom";

// Extend Jest matchers for TypeScript
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();
