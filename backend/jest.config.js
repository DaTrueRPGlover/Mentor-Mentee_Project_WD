export default {
    transform: {
      '^.+\\.js$': 'babel-jest',  // Use babel-jest for ES module transformation
    },
    testEnvironment: 'node',
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',  // Resolve module paths without the .js extension
    },
  };