
const assert = require('assert');
const FileUtils = require('../src/file_utils.js')

describe('Search for files', function() {
  describe('with .sol extension in ./test/', function() {
    it('should return more than 0 files', function() {

      var files = FileUtils.searchRecursive('./test/', '.sol'); 
      assert(files.length > 0);
    });
  });
});