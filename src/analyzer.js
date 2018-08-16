const parser = require('solidity-parser-antlr');
const util = require('util')
const { IssueDetailed, IssuePointer }  = require('./issue.js')
const AstUtility  = require('./ast_utility.js')
const Logger  = require('./logger.js')
const FileUtils = require('../src/file_utils.js')

var plugins = require('require-all')({
  dirname     :  __dirname + '/../plugins/',
  filter      :  /(.+)\.js$/,
  excludeDirs :  /^\.(git|svn)$/,
  recursive   : true
});


class Analyzer { 
	static runAllPlugins(repo,config){
		var issues = []

		for (const [filename, filecontent] of Object.entries(repo.files)) {
			
			var ast

			try {
			    ast = parser.parse(filecontent, { loc: true });
			} catch (e) {
				Logger.error("Exception during AST parsing for " + filename)
				console.log(e)
			}

			
			var contract_name = AstUtility.getContractName(ast)
	
			for(var config_plugin_name in config.plugins){

				if(config.plugins[config_plugin_name].active == "true"){
					var plugin_found = false 

					for(var plugin in plugins){
						if (typeof plugins[plugin][config_plugin_name] === 'function'){
							plugin_found = true
							var issue_pointers = []
							var issue_type = config.plugins[config_plugin_name].type 

							Logger.info("Executing Plugin: " + config_plugin_name)
							
							try {
								issue_pointers = plugins[plugin][config_plugin_name](ast)

								Logger.info("Plugin " + config_plugin_name + " discovered " + issue_pointers.length + " issue(s) in " + filename)

								for(var issue_pointer of issue_pointers){
									var code = FileUtils.getCodeAtLine(filecontent,issue_pointer.linenumber)
									var issue_detailed = new IssueDetailed(filename, contract_name, issue_type, code, issue_pointer.linenumber)
									issues.push(issue_detailed)

								}
							} catch(error){
								Logger.debug("Something went wrong in plugin: " + config_plugin_name)
							}
						} 
					}

					if(!plugin_found) {
						Logger.warn("Implementation missing for " + config_plugin_name)	
					}	
				}
			}

		}	

		return issues 	
	}
}	

module.exports = Analyzer