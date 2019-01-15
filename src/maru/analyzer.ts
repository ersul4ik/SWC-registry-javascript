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
import { MythXReport, Report, Meta } from "./report";

class Analyzer {
    static runAllPlugins(repo: Repository, config: { [plugins: string]: any }, sourceType: string, sourceFormat: string): Report[] {
        let reports: Report[] = [];

        for (const sol_file of repo.sol_files) {
            let issues: IssueDetailed[] = [];
            let sourceList: string[] = [];

            for (const source of sol_file.sources) {
                sourceList.push(source.file_name);
            }

            if (sol_file.errors.length == 0) {
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
                                    const error_message: string = `Maru: Something went wrong during execution for plugin: ${configPluginName} in file ${
                                        sol_file.file_name
                                    }: ${error}`;

                                    Logger.error(error_message);
                                    sol_file.errors.push(error_message);
                                }

                                if (issuePointers.length > 0) {
                                    for (const issuePointer of issuePointers) {
                                        try {
                                            const { lineNumberStart, lineNumberEnd } = issuePointer;
                                            const source_index: number = parseInt(issuePointer.src.split(":")[2]);
                                            const code = FileUtils.getCodeAtLine(sourceList[source_index], lineNumberStart, lineNumberEnd);
                                            const issueDetailed = new IssueDetailed(sol_file.file_name, code, issuePointer);

                                            issues.push(issueDetailed);
                                        } catch (error) {
                                            const error_message: string = `Maru: Something went wrong during issue post processing in file ${
                                                sol_file.file_name
                                            }: ${error}`;

                                            Logger.error(error_message);
                                            sol_file.errors.push(error_message);
                                        }
                                    }
                                }
                            }
                        }

                        if (!pluginFound) {
                            Logger.debug(`Implementation missing for ${configPluginName}`);
                        }
                    }
                }
            } else {
                Logger.error(`Compilation errors occured!`);
                Logger.error(sol_file.solc_compilation_output);
            }

            const meta: Meta = new Meta(sol_file.selected_compiler_version, sol_file.errors, sol_file.warnings);

            reports.push(new Report(sourceType, sourceFormat, sourceList, issues, meta));
        }
        return reports;
    }
}
export default Analyzer;
