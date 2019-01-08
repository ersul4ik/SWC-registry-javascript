const parser = require("solidity-parser-antlr");
const plugins = require("require-all")({
    dirname: `${__dirname}/../plugins/`,
    filter: /(.+)/,
    excludeDirs: /^\.(git|svn)$/,
    recursive: true
});

import Logger from "../logger/logger";
import NodeUtility from "../utils/node";
import FileUtils from "../utils/file";
import { IssueDetailed, IssuePointer } from "./issue";
import Repository from "./repository";
import PluginConfig from "./plugin_config";
import Report from "./report";

class Analyzer {
    static runAllPlugins(repo: Repository, config: { [plugins: string]: any }, sourceType: string, sourceFormat: string): Report[] {
        let reports: Report[] = [];

        for (const sol_file of repo.sol_files) {
            let issues: IssueDetailed[] = [];
            let sourceList: string[] = [];

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
                                config.plugins[configPluginName].description
                            );

                            Logger.info(`Executing Plugin: ${configPluginName} in file ${sol_file.file_name}`);

                            try {
                                issuePointers = plugins[plugin][configPluginName](sol_file, pc);
                                Logger.info(
                                    `Plugin ${configPluginName} discovered ${issuePointers.length} issue(s) in ${sol_file.file_name}`
                                );
                            } catch (error) {
                                Logger.error(
                                    `Something went wrong during plugin execution for: ${configPluginName} in file ${sol_file.file_name}`
                                );
                                Logger.error(error);
                            }

                            if (issuePointers.length > 0) {
                                for (const issuePointer of issuePointers) {
                                    const { lineNumberStart, lineNumberEnd } = issuePointer;
                                    const code = FileUtils.getCodeAtLine(sol_file.file_name, lineNumberStart, lineNumberEnd);

                                    const issueDetailed = new IssueDetailed(sol_file.file_name, code, issuePointer);

                                    issues.push(issueDetailed);
                                }
                            }
                        }
                    }

                    if (!pluginFound) {
                        Logger.debug(`Implementation missing for ${configPluginName}`);
                    }
                }
            }

            for (const source of sol_file.sources) {
                sourceList.push(source.file_name);
            }

            let meta = {
                selected_compiler: sol_file.selected_compiler_version,
                error: sol_file.getErrors(),
                warning: sol_file.getWarnings()
            };

            reports.push(new Report(sourceType, sourceFormat, sourceList, issues, meta));
        }
        return reports;
    }
}
export default Analyzer;
