const parser = require('solidity-parser-antlr');
const { IssueDetailed, IssuePointer } = require('../src/issue.js')
const AstUtility  = require('../src/ast_utility.js')
const util = require('util')


exports.DeprecatedFunctions = function (ast){
	var issue_pointers = []

	parser.visit(ast, {
	   // FunctionCall: function(node) {
	   	Block: function(node1) {


//console.log(util.inspect(node1, false, null))
	    	parser.visit(node1, {
	   // FunctionCall: function(node) {
			   	Identifier: function(node2) {
	    			//console.log(util.inspect(node2, false, null))
			   	}
			})

	    	//console.log(util.inspect(node2, false, null))
			//exp = node.expression;
		
/*
	    	if(node.name.match(/sha3/) || node.name.match(/suicide/)){
	  			var linenumber = AstUtility.getStartLine(exp)
				var issue_pointer = new IssuePointer(linenumber)
				issue_pointers.push(issue_pointer);	
	  		}*/
	  	}	
	})
	return issue_pointers;    	
}