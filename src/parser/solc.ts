import NodeUtility from "../utils/node";
import Import from "../core/declarations/import";
import FileUtils from "../utils/file";
import logger from "../logger/logger";

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
    static getPragmaVersion(file_name: string) {
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

    static compile(file_name: string, version: string, imports?: Import[]) {
        //const version = SolcUtility.getPragmaVersion(file_name);
        const solc_version_string: string = "solc@" + version;

        if (!Solc.isSolcVersionInstalled(version)) {
            logger.debug(`Solc version ${solc_version_string} not installed, trying to do that now.`);
            niv.install(solc_version_string);
        }

        let compiler = niv.require(solc_version_string, { quiet: true });

        let input = {
            language: "Solidity",
            sources: {},
            settings: {
                outputSelection: {
                    "*": {
                        "": ["legacyAST"]
                    }
                }
            }
        };

        const file_content: string = FileUtils.getFileContent(file_name);
        input.sources = { [file_name]: { content: file_content } };

        let compile_output;
        if (imports && imports.length > 0) {
            // Implement imports
            compile_output = JSON.parse(compiler.compileStandardWrapper(JSON.stringify(input)));
        } else {
            compile_output = JSON.parse(compiler.compileStandardWrapper(JSON.stringify(input)));
        }
        return compile_output;
    }

    findImports(imports: Import[]): {} {
        let i_string = "";
        for (const i of imports) {
            i_string += FileUtils.getFileContent(i.path);
        }

        return { contents: "library L { function f() internal returns (uint) { return 7; } }" };
    }

    static getChildrenNodes(nodes: any[], parent_id: number): any[] {
        let push: boolean = false;
        let filter_nodes: any[] = [];

        for (const n of nodes) {
            if (parent_id === n.id) {
                push = true;
            }

            if (push) {
                if (parent_id >= n.id) {
                    filter_nodes.push(n);
                } else {
                    push = false;
                }
            }
        }
        return filter_nodes;
    }

    static walkAST(file_name: string, version: string, imports: Import[]): any[] {
        const compilation_result = Solc.compile(file_name, version, imports);
        let walker = new AstWalker();
        let nodes: any[] = [];

        const callback = (node: any) => {
            nodes.push(node);
            if ("children" in node) {
                for (const child of node.children) {
                    walker.walk(child, callback);
                }
            }
        };

        Object.entries(compilation_result.sources).forEach(([pathName, source]) => {
            walker = new AstWalker();
            walker.walk((<any>source).legacyAST, callback);
        });
        return nodes;
    }
}
export default Solc;
