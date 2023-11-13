import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverage: true,
  coverageReporters: ["text"],
  coverageThreshold: {
    global: {
      statements: 80,
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testEnvironment: "jsdom",
  transform: { "^.+.(ts|tsx)$": "ts-jest" },
  verbose: true,
};

export default config;
