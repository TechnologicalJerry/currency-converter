/** @type {import('jest').Config} */
export default {
  // The test environment that will be used for testing
  testEnvironment: 'node',

  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest/presets/default-esm',

  // Enable ES modules
  extensionsToTreatAsEsm: ['.ts'],

  // The root of your source code, typically /src
  roots: ['<rootDir>/src', '<rootDir>/tests'],

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],

  // Transform files with ts-jest
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true
    }]
  },

  // Module name mapping
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Setup files after env
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true
};