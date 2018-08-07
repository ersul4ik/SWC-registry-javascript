const parser = require('solidity-parser-antlr');
const util = require('util')

class Analyzer { 
	static checkInsecureArithmetic(contract_content){
		var issues = []
		var ast = parser.parse(contract_content, { loc: true });
		//console.log(ast);
		// output the path of each import found
		parser.visit(ast, {
		  ExpressionStatement: function(node) {
		 // 	console.log(node)
		  	var code = ""
		    const expr = node.expression
		    if (expr.type === 'BinaryOperation'){
		    	//console.log(util.inspect(expr, false, null))

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
		    	console.log(expr['loc']['start']['line'])
		    	console.log("Integer Overflow detected")
				console.log(code)
				
		    }
		  }
		})
		return true;    	
	}
}	

module.exports = Analyzer