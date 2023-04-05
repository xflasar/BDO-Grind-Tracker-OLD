module.exports = {
    testEnvironment: 'jsdom',
    rootDir: '.',
    modulePaths: ['<rootDir>'],
    moduleDirectories: ['node_modules', 'src'],
    setupFilesAfterEnv: ['<rootDir>/setupJest.js'],
    moduleNameMapper: { '\\.(css|less|scss|sass)$': 'identity-obj-proxy' },
  }