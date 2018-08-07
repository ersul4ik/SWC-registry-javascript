const fs = require('fs');
const assert = require('assert');

const Analyzer  = require('../src/analyzer.js')
const FileUtils = require('../src/file_utils.js')

describe('InsecureArithmetic', function() {
  describe('in int_overflow1.sol', function() {
    it('should find one overflow', function() {
      const path = './test/contracts/int_overflow1.sol'
	  const contract_content = fs.readFileSync(path).toString();
	  const result = Analyzer.checkInsecureArithmetic(contract_content);
        console.log(result);
      assert(result === true);
    });
  });
});
