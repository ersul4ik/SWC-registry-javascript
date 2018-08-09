const fs = require('fs');
const assert = require('assert');

const Analyzer  = require('../src/analyzer.js')
const FileUtils = require('../src/file_utils.js')

describe('InsecureIntegerArithmetic', function() {
  describe('in int_overflow1.sol', function() {
    it('should find one issue in line 7', function() {
      const filename = './test/contracts/int_overflow1.sol'
	  const contract_content = fs.readFileSync(filename).toString();
	  const issues = Analyzer.InsecureIntegerArithmetic(filename,contract_content);
      
      /*
   	  for(var issue of issues){
   	  	issue.print()
   	  }	
	  */
	  
      assert(Object.keys(issues).length == 1);


    });
  });
});
