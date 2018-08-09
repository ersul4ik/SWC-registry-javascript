const parser = require('solidity-parser-antlr');
const util = require('util')
const Issue  = require('../src/issue.js')
const AstUtility  = require('../src/ast_utility.js')

class Analyzer { 
	static InsecureIntegerArithmetic(filename, contract_content){
		var issues = []
		var ast = parser.parse(contract_content, { loc: true });
		var type = "Insecure Integer Arithmetic"
		
		var contract_name = AstUtility.getContractName(ast)
		// output the path of each import found
		parser.visit(ast, {
		  ExpressionStatement: function(node) {
		  //	console.log(node)
	
		    const expr = node.expression
		    if (expr.type === 'BinaryOperation'){
	  			var code = ""
		    	code += expr['left']['name']
		    	code += expr['operator']

		    	if(expr['right']['left'] != undefined ){
		    		code += expr['right']['left']['name']
		    		code += expr['right']['operator']
		    		code += expr['right']['right']['number']
		    	} else {
		    		//console.log(expr['right']['name'])	
		    		code += expr['right']['name']
		    	}
		    	var linenumber = expr['loc']['start']['line']
				var issue = new Issue(filename, contract_name, type , code, linenumber)

				issues.push(issue);
				
		    }
		  }
		})
		return issues;    	
	}
}	

module.exports = Analyzer