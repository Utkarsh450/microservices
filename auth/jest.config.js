module.exports = {
  testEnvironment: 'node',

  testMatch: ['**/__tests__/**/*.test.js'],

  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/index.js'
  ],

  verbose: true,
  moduleFileExtensions: ['js', 'json', 'node']
};
