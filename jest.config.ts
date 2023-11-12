import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 80,
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  reporters: [["github-actions", { silent: false }], "summary"],
  testEnvironment: "jsdom",
  transform: { "^.+.(ts|tsx)$": "ts-jest" },
};

export default config;
