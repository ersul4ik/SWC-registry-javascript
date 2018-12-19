import NodeUtility from "../utils/node";
import Import from "../core/declarations/import";
import FileUtils from "../utils/file";
import logger from "../logger/logger";
import Source from "../maru/source";
import PragmaUtils from "../utils/pragma";

const path = require("path");

const detectInstalled = require("detect-installed");
const niv = require("npm-install-version");
const AstWalker = require("remix-lib").AstWalker;

class Solc {
    static isSolcVersionInstalled(version_number: string) {
        const version: string = "solc@" + version_number;
        const installed: boolean = detectInstalled.sync(version, {
            local: true
        });
        return installed;
    }

    // This function is deprecated
    // Using the Antlr AST to get the version string
    static getPragmaVersion(file_name: string): string {
        // set a default version
        let version = "0.4.25";
        const file_content: string = FileUtils.getFileContent(file_name);
        let lines = file_content.split("\n");

        for (let x = 0; x < lines.length; x++) {
            const filter_whitespaces: string = lines[x].replace(/\s|\t/g, "");
            if (filter_whitespaces.startsWith("pragmasolidity")) {
                // if a floating pragma is used then take the oldest allowed version
                let extracted_version = filter_whitespaces.replace(/pragmasolidity|\^|;/g, "");

                if (extracted_version.match(/^(\d+\.\d+\.\d+)$/)) {
                    version = extracted_version;
                } else {
                    logger.error(`Extracting version failed in ${file_name} got ${extracted_version}`);
                }
            }
        }

        return version;
    }

    static compile(file_name: string, version: string, hasImports: boolean): any {
        //const version = SolcUtility.getPragmaVersion(file_name);
        const solc_version_string: string = "solc@" + version;

        if (!Solc.isSolcVersionInstalled(version)) {
            logger.debug(`Solc version ${solc_version_string} not installed, trying to do that now.`);
            niv.install(solc_version_string);
        }

        let compiler = niv.require(solc_version_string, { quiet: true });

        function findImports(pathName: any) {
            try {
                return { contents: FileUtils.getFileContent(pathName) };
            } catch (e) {
                return { error: e.message };
            }
        }

        const file_content: string = FileUtils.getFileContent(file_name);

        let input = {};

        if (PragmaUtils.isVersion04(version)) {
            input = {
                language: "Solidity",
                sources: {
                    [file_name]: file_content
                },
                settings: {
                    outputSelection: {
                        "*": {
                            "*": ["*"],
                            "": ["*"]
                        }
                    }
                }
            };
        } else if (PragmaUtils.isVersion05(version)) {
            input = {
                language: "Solidity",
                sources: {
                    [file_name]: {
                        content: file_content
                    }
                },
                settings: {
                    outputSelection: {
                        "*": {
                            "*": ["*"],
                            "": ["*"]
                        }
                    }
                }
            };
        }

        let compilation_output = {};
        if (PragmaUtils.isVersion04(version)) {
            compilation_output = compiler.compile(input, 1, findImports);
        } else if (PragmaUtils.isVersion05(version)) {
            compilation_output = JSON.parse(compiler.compile(JSON.stringify(input), findImports));
        } else {
            logger(`What's version is that ${version}? I can't compile this Beep Beep.`);
        }

        return compilation_output;
    }

    static walkAST(compilation_output: any, version: string): Source[] {
        let walker = new AstWalker();
        let sources: Source[] = [];
        let nodes: any[] = [];

        const callback = (node: any) => {
            nodes.push(node);
            if ("children" in node) {
                for (const child of node.children) {
                    walker.walk(child, callback);
                }
            }
        };

        Object.entries(compilation_output.sources).forEach(([file_name, source]) => {
            walker = new AstWalker();

            if (PragmaUtils.isVersion04(version)) {
                walker.walk((<any>source).AST, callback);
            } else if (PragmaUtils.isVersion05(version)) {
                walker.walk((<any>source).legacyAST, callback);
            } else {
                logger(`What's version is that ${version}? I can't compile this Beep Beep.`);
            }

            sources.push(new Source(file_name, nodes));
            nodes = [];
        });
        return sources;
    }
}
export default Solc;
