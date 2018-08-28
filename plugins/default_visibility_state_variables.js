const parser = require('solidity-parser-antlr');
const { IssueDetailed, IssuePointer } = require('../src/issue.js')
const AstUtility  = require('../src/ast_utility.js')

exports.DefaultVisibilityStateVariable = function (ast){
	var issue_pointers = []
	
	parser.visit(ast, {
	    StateVariableDeclaration: function(node) {
	    	var variable = node.variables[0]
	   
	    	if(AstUtility.isDefaultVisibility(variable) && variable.isDeclaredConst == false ){
	  			var linenumber = AstUtility.getStartLine(variable)
				var issue_pointer = new IssuePointer(linenumber)
				issue_pointers.push(issue_pointer);	
	  		}

	    }
	})
	return issue_pointers;    	
}