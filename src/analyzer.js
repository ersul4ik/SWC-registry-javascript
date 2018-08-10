const parser = require('solidity-parser-antlr');
const util = require('util')
const { IssueDetailed, IssuePointer }  = require('./issue.js')
const AstUtility  = require('./ast_utility.js')
const Logger  = require('./logger.js')

var plugins = require('require-all')({
  dirname     :  __dirname + '/../plugins/',
  filter      :  /(.+)\.js$/,
  excludeDirs :  /^\.(git|svn)$/,
  recursive   : true
});


class Analyzer { 
	static runAllPlugins(repo,config){

		for (const [filename, filecontent] of Object.entries(repo.files)) {
			var issues = []
			
			var ast = parser.parse(filecontent, { loc: true });
			var contract_name = AstUtility.getContractName(ast)
		
			for(var config_plugin_name in config.plugins){
				if(config.plugins[config_plugin_name].active == "true"){
					for(var plugin in plugins){
						if (typeof plugins[plugin][config_plugin_name] === 'function'){
							Logger.info("Executing Plugin: " + config_plugin_name)
							var issue_pointers = plugins[plugin][config_plugin_name](ast)
							var issue_type = config.plugins[config_plugin_name].type 

							Logger.info("Plugin " + config_plugin_name + " discovered " + issue_pointers.length + " issue(s) in " + filename)

							for(var issue_pointer of issue_pointers){

								var issue_detailed = new IssueDetailed(filename, contract_name, issue_type, issue_pointer.code, issue_pointer.linenumber)
								issues.push(issue_detailed)

							}

						} else {
							Logger.warn("Implementation missing for " + config_plugin_name)	
						}	
					}
				}
			}

		}	

		return issues 	
	}
}	

module.exports = Analyzer