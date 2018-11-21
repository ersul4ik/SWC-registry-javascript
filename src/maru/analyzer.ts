const parser = require("solidity-parser-antlr");
const plugins = require("require-all")({
  dirname: `${__dirname}/../plugins/`,
  filter: /(.+)/,
  excludeDirs: /^\.(git|svn)$/,
  recursive: true,
});

import Logger from "../logger/logger";
import AstUtility from "../utils/ast";
import FileUtils from "../utils/file";
import { IssueDetailed, IssuePointer } from "./issue";
import Repository from "./repository";
import PluginConfig from "./plugin_config"

class Analyzer {
  static runAllPlugins(repo: Repository, config: { [plugins: string]: any }): IssueDetailed[] {
    let issues: IssueDetailed[] = [];

    for (const sol_file of repo.sol_files) {

      for (const configPluginName in config.plugins) {
        if (config.plugins[configPluginName].active === "true") {
          let pluginFound = false;

          for (const plugin in plugins) {
            if (typeof plugins[plugin][configPluginName] === "function") {
              pluginFound = true;
              let issuePointers: IssuePointer[] = [];

              let pc = new PluginConfig(
                config.plugins[configPluginName].active,
                config.plugins[configPluginName].swcID,
                config.plugins[configPluginName].descriptionShort
              );

              Logger.info(`Executing Plugin: ${configPluginName}`);

              try {
                issuePointers = plugins[plugin][configPluginName](sol_file, pc);
                Logger.info(`Plugin ${configPluginName} discovered ${issuePointers.length} issue(s) in ${sol_file.file_name}`);
              } catch (error) {
                Logger.debug(`Something went during plugin execution for: ${configPluginName}`);
                Logger.debug(error);
              }

              for (const issuePointer of issuePointers) {
                const { lineNumberStart, lineNumberEnd } = issuePointer;
                const code = FileUtils.getCodeAtLine(sol_file.file_name, lineNumberStart, lineNumberEnd);

                const issueDetailed = new IssueDetailed(sol_file.file_name, code, issuePointer);

                issues.push(issueDetailed);
              }

            }

            if (!pluginFound) {
              Logger.debug(`Implementation missing for ${configPluginName}`);
            }
          }
        }
      }
    }
    return issues;
  }
}
export default Analyzer;
