const parser = require('solidity-parser-antlr');
const { IssueDetailed, IssuePointer } = require('../src/issue.js')
const AstUtility  = require('../src/ast_utility.js')

exports.LockPragma = function (ast){
	var issue_pointers = []
	
	parser.visit(ast, {
	  	PragmaDirective: function(node) {
	  		if (!AstUtility.isVersionFixed(node.value)){
	  			var linenumber = AstUtility.getStartLine(node)
				var issue_pointer = new IssuePointer(linenumber)
				issue_pointers.push(issue_pointer);	
	  		}

	  	}
	})
	return issue_pointers;    	
}