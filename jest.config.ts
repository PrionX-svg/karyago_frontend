import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/__test__/**",
  ],
  coverageReporters: ["json", "lcov", "text", "clover", "html"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Enable fake timers globally to avoid timer warnings
  // fakeTimers: {
  //   enableGlobally: true,
  // },

  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/src/__test__/setup.ts"],
  watch: false,
  watchAll: false,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
