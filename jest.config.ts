import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  globals: {
    'ts-jest': { tsconfig: './tsconfig.json' }
  },
  testTimeout: 30000,    // 30 s default
};

export default config;
