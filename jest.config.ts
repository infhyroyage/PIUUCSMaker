import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testEnvironment: "jsdom",
  transform: { "^.+.(ts|tsx)$": "ts-jest" },
  verbose: true,
};

export default config;
