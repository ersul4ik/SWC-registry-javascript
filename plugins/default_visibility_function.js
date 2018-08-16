const parser = require('solidity-parser-antlr');
const { IssueDetailed, IssuePointer } = require('../src/issue.js')
const AstUtility  = require('../src/ast_utility.js')

exports.DefaultVisibilityFunction = function (ast){
	var issue_pointers = []
	
	parser.visit(ast, {
	    FunctionDefinition: function(node) {
	    	var func = node
	    	if (AstUtility.isDefaultVisibility(func)){
	  			var linenumber = AstUtility.getStartLine(func)
				var issue_pointer = new IssuePointer(linenumber)
				issue_pointers.push(issue_pointer);	
	  		}

	    }
	})
	return issue_pointers;    	
}