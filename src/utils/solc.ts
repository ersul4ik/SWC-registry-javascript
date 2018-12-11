import FileUtils from "./file";
import logger from "../logger/logger";
import Import from "../declarations/import";

const detectInstalled = require("detect-installed");
const niv = require("npm-install-version");

class SolcUtility {
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

        if (!SolcUtility.isSolcVersionInstalled(version)) {
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
            compile_output = JSON.parse(compiler.compileStandardWrapper(JSON.stringify(input), 1, SolcUtility.findImports(imports)));
        } else {
            compile_output = JSON.parse(compiler.compileStandard(JSON.stringify(input)));
        }
        return compile_output;
    }

    static findImports(imports: Import[]): {} {
        let i_string = "";
        for (const i of imports) {
            i_string += FileUtils.getFileContent(i.path);
        }

        return { contents: "library L { function f() internal returns (uint) { return 7; } }" };
    }
}

export default SolcUtility;
