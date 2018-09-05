const parser = require('solidity-parser-antlr');

const plugins = require('require-all')({
  dirname: `${__dirname}/../plugins/`,
  filter: /(.+)\.js$/,
  excludeDirs: /^\.(git|svn)$/,
  recursive: true,
});

const Logger = require('./logger.js');
const AstUtility = require('./ast_utility.js');
const { IssueDetailed } = require('./issue.js');
const FileUtils = require('../src/file_utils.js');

class Analyzer {
  static runAllPlugins(repo, config) {
    const issues = [];

    for (const [filename, filecontent] of Object.entries(repo.files)) {
      let ast;

      try {
        ast = parser.parse(filecontent, { loc: true });
      } catch (e) {
        Logger.error(`Exception during AST parsing for ${filename}`);
        console.log(e);
      }


      const contractName = AstUtility.getContractName(ast);

      for (const configPluginName in config.plugins) {
        if (config.plugins[configPluginName].active === 'true') {
          let pluginFound = false;

          for (const plugin in plugins) {
            if (typeof plugins[plugin][configPluginName] === 'function') {
              pluginFound = true;
              let issuePointers = [];
              const issueType = config.plugins[configPluginName].type;

              Logger.info(`Executing Plugin: ${configPluginName}`);

              try {
                issuePointers = plugins[plugin][configPluginName](ast);

                Logger.info(`Plugin ${configPluginName} discovered ${issuePointers.length} issue(s) in ${filename}`);

                for (const issuePointer of issuePointers) {
                  const code = FileUtils.getCodeAtLine(filecontent, issuePointer.linenumber);
                  const issueDetailed = new IssueDetailed(filename, contractName, issueType,
                    code, issuePointer.linenumber);
                  issues.push(issueDetailed);
                }
              } catch (error) {
                Logger.debug(`Something went wrong in plugin: ${configPluginName}`);
              }
            }
          }

          if (!pluginFound) {
            Logger.warn(`Implementation missing for ${configPluginName}`);
          }
        }
      }
    }

    return issues;
  }
}

module.exports = Analyzer;
