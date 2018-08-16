const parser = require('solidity-parser-antlr');
const { IssueDetailed, IssuePointer } = require('../src/issue.js')
const AstUtility  = require('../src/ast_utility.js')

exports.OutdatedCompilerVersion = function (ast){
	var issue_pointers = []
	
	parser.visit(ast, {
	    PragmaDirective: function(node) {
	    	version = node.value 
		  	version_parts = version.split(".")
		  	if (node.value.match(/\^/)){
			  	if(version_parts[1]<=4){
			  		if(version_parts[2]<=23){
					  	var linenumber = AstUtility.getStartLine(node)
						var issue_pointer = new IssuePointer(linenumber)
						issue_pointers.push(issue_pointer);
			  		}
			  	}
			}  

	    }
	})
	return issue_pointers;    	
}