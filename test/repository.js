const assert = require('assert');
const Repository = require('../src/repository');

describe('Repository', () => {
  describe('#addFiles recursively to a Repository', () => {
    it('should have more than 0 files in the test directory', () => {
      const test = new Repository();
      test.addFiles('./test', '.sol');

      assert(Object.keys(test).length > 0);
    });
  });
});
