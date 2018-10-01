const parser = require("solidity-parser-antlr");
const plugins = require("require-all")({
  dirname: `${__dirname}/../plugins/`,
  filter: /(.+)/,
  excludeDirs: /^\.(git|svn)$/,
  recursive: true,
});

import AstUtility from "./ast_utility";
import FileUtils from "./file_utils";
import { IssueDetailed } from "./issue";
import Logger from "./logger";
import Repository from "./repository";

class Analyzer {
  static runAllPlugins(repo: Repository, config: { [plugins: string]: any }) {
    const issues = [];

    for (const [filename, filecontent] of Object.entries(repo.files)) {
      let ast;
      try {
        ast = parser.parse(filecontent, { loc: true });
      } catch (e) {
        Logger.error("Exception during AST parsing for " + filename);
        console.log(e);
      }
      const contractName = AstUtility.getContractName(ast);

      for (const configPluginName in config.plugins) {
        if (config.plugins[configPluginName].active === "true") {
          let pluginFound = false;

          for (const plugin in plugins) {
            if (typeof plugins[plugin][configPluginName] === "function") {
              pluginFound = true;
              let issuePointers = [];

              Logger.info(`Executing Plugin: ${configPluginName}`);

              try {
                issuePointers = plugins[plugin][configPluginName](ast);
                Logger.info(`Plugin ${configPluginName} discovered ${issuePointers.length} issue(s) in ${filename}`);
                for (const issuePointer of issuePointers) {
                  const code = FileUtils.getCodeAtLine(filecontent, issuePointer.linenumber_start,
                    issuePointer.linenumber_end);
                  const issueDetailed = new IssueDetailed(filename, contractName, code, issuePointer);
                  issues.push(issueDetailed);
                }
              } catch (error) {
                Logger.debug(`Something went wrong in plugin: ${configPluginName}`);
                Logger.debug(error);
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

export default Analyzer;
