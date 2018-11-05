const parser = require("solidity-parser-antlr");
const plugins = require("require-all")({
  dirname: `${__dirname}/../plugins/`,
  filter: /(.+)/,
  excludeDirs: /^\.(git|svn)$/,
  recursive: true,
});

import logger from "../src/logger";
import AstUtility from "./ast_utility";
import FileUtils from "./file_utils";
import { IssueDetailed } from "./issue";
import Repository from "./repository";

class Analyzer {
  static runAllPlugins(repo: Repository, config: { [plugins: string]: any }) {
    const issues = [];

    for (const [filename, filecontent] of Object.entries(repo.files)) {
      let ast;
      try {
        ast = parser.parse(filecontent, { loc: true, range: true });
      } catch (e) {
        logger.error("Exception during AST parsing for " + filename);
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

              logger.info(`Executing Plugin: ${configPluginName}`);

              try {
                issuePointers = plugins[plugin][configPluginName](ast);
                logger.info(`Plugin ${configPluginName} discovered ${issuePointers.length} issue(s) in ${filename}`);
                for (const issuePointer of issuePointers) {
                  const { linenumber_start, linenumber_end } = issuePointer;
                  const code = FileUtils.getCodeAtLine(filecontent, linenumber_start, linenumber_end);

                  const issueDetailed = new IssueDetailed(filename, contractName, code, issuePointer);
                  issues.push(issueDetailed);
                }
              } catch (error) {
                logger.debug(`Something went wrong in plugin: ${configPluginName}`);
                logger.debug(error);
              }
            }
          }

          if (!pluginFound) {
            logger.debug(`Implementation missing for ${configPluginName}`);
          }
        }
      }
    }

    return issues;
  }
}

export default Analyzer;
