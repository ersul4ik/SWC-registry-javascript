"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const plugins = require("require-all")({
    dirname: `${__dirname}/../plugins/`,
    filter: /(.+)/,
    excludeDirs: /^\.(git|svn)$/,
    recursive: true,
});
const ast_utility_1 = __importDefault(require("./ast_utility"));
const file_utils_1 = __importDefault(require("./file_utils"));
const issue_1 = require("./issue");
const logger_1 = __importDefault(require("./logger"));
class Analyzer {
    static runAllPlugins(repo, config) {
        const issues = [];
        for (const [filename, filecontent] of Object.entries(repo.files)) {
            let ast;
            try {
                ast = parser.parse(filecontent, { loc: true });
            }
            catch (e) {
                logger_1.default.error("Exception during AST parsing for " + filename);
                console.log(e);
            }
            const contractName = ast_utility_1.default.getContractName(ast);
            for (const configPluginName in config.plugins) {
                if (config.plugins[configPluginName].active === "true") {
                    let pluginFound = false;
                    for (const plugin in plugins) {
                        if (typeof plugins[plugin][configPluginName] === "function") {
                            pluginFound = true;
                            let issuePointers = [];
                            logger_1.default.info(`Executing Plugin: ${configPluginName}`);
                            try {
                                issuePointers = plugins[plugin][configPluginName](ast);
                                logger_1.default.info(`Plugin ${configPluginName} discovered ${issuePointers.length} issue(s) in ${filename}`);
                                for (const issuePointer of issuePointers) {
                                    const code = file_utils_1.default.getCodeAtLine(filecontent, issuePointer.linenumber_start, issuePointer.linenumber_end);
                                    const issueDetailed = new issue_1.IssueDetailed(filename, contractName, code, issuePointer);
                                    issues.push(issueDetailed);
                                }
                            }
                            catch (error) {
                                logger_1.default.debug(`Something went wrong in plugin: ${configPluginName}`);
                                logger_1.default.debug(error);
                            }
                        }
                    }
                    if (!pluginFound) {
                        logger_1.default.warn(`Implementation missing for ${configPluginName}`);
                    }
                }
            }
        }
        return issues;
    }
}
exports.default = Analyzer;
