const Repository = require('../src/repository');

const Issue = require('../src/issue');
const assert = require('assert');

describe('Repository', function() {
  describe('#addFiles recursively to a Repository', function() {
    it('should have more than 0 files in the test directory', function() {

   		var test =  new Repository()
   		test.addFiles("./test",".sol")
        //console.log(test)
        //console.log(Object.keys(test).length )

        assert(Object.keys(test).length > 0);
    });
  });

  describe('#scan all files in a repository', function() {
    it('should return more than 0 issues', function() {

        var test =  new Repository()
        test.addFiles("./test",".sol")

        var issues = test.scan();

        assert(Object.keys(test).length > 0);
    });
  });
});