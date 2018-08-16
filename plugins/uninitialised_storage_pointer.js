const parser = require('solidity-parser-antlr');
const { IssueDetailed, IssuePointer } = require('../src/issue.js')
const AstUtility  = require('../src/ast_utility.js')


/*
{ type: 'VariableDeclaration',
  typeName:
   { type: 'ElementaryTypeName',
     name: 'uint',
     loc: { start: [Object], end: [Object] } },
  name: 'x',
  expression:
   { type: 'NumberLiteral',
     number: '0',
     subdenomination: null,
     loc: { start: [Object], end: [Object] } },
  visibility: 'default',
  isStateVar: true,
  isDeclaredConst: false,
  isIndexed: false,
  loc:
   { start: { line: 6, column: 9 }, end: { line: 6, column: 9 } } }

*/   

exports.UndeclaredStoragePointer = function (ast){
	var issue_pointers = []
	
	parser.visit(ast, {
	    VariableDeclaration: function(node) {
	    	var variable = node
	    	console.log(variable)
	   
	    	if ( variable.storageLocation == null && variable.isStateVar == false && variable.typeName.type == 'UserDefinedTypeName' ){
	  			var linenumber = AstUtility.getStartLine(variable)
				var issue_pointer = new IssuePointer(linenumber)
				issue_pointers.push(issue_pointer);	
	  		}

	    }
	})
	return issue_pointers;    	
}