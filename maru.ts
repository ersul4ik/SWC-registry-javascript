#!/usr/bin/env node

const fs = require("fs");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const pkg = require("./package.json");

import Config from "./config/config.json";
import Analyzer from "./src/maru/analyzer";
import Reporter from "./src/maru/reporter";
import Repository from "./src/maru/repository";
import NodeUtility from "./src/utils/node";
import Report from "./src/maru/report";
import SolFile from "./src/maru/sol_file";

const optionDefinitions = [
    {
        name: "version",
        alias: "v",
        type: Boolean,
        description: "Print current version"
    },
    {
        name: "run",
        alias: "r",
        type: String,
        typeLabel: "{underline directory}",
        description: "Analyse files in specified directory"
    },
    {
        name: "output",
        alias: "o",
        type: String,
        description: "output format, txt or json, default ouput format is txt"
    },
    {
        name: "plugin",
        alias: "p",
        type: String,
        description:
            "option to execute individual plugin, specified by plugin names given as comma-separated " +
            "value of this argument, run all plugins if not given"
    },
    {
        name: "help",
        alias: "h",
        type: Boolean,
        description: "Print this help message"
    },
    {
        name: "ast",
        alias: "a",
        type: String,
        description: "Dump the entire antlr/solc ast of the contract. e.g. --run contract.sol --ast solc",
        defaultOption: "antlr"
    }
];

const options = commandLineArgs(optionDefinitions);

const sections = [
    {
        header: "Maru",
        content: "A static code analysis tool for Solidity smart contracts."
    },
    {
        header: "Options",
        optionList: optionDefinitions
    }
];

if (options.help || options.length < 1) {
    const usage = commandLineUsage(sections);
    console.log(usage);
} else if (options.version) {
    console.log(`Maru version ${pkg.version}`);
} else if (options.run) {
    let config: { [plugins: string]: any } = {};
    config = Config;
    if (options.plugin != null) {
        let usingPlugins: { [plugins: string]: any } = {};
        options.plugin.split(",").forEach((plugin: string) => {
            if (config.plugins[plugin] != null && config.plugins[plugin].swcID != null) {
                usingPlugins[plugin] = config.plugins[plugin];
                // enable deactivated plugins
                usingPlugins[plugin].active = "true";
            } else {
                console.log(`${plugin} does not exist.`);
                return;
            }
        });
        config = {
            plugins: usingPlugins
        };
    }

    const repo = new Repository();
    const stats = fs.statSync(options.run);

    if (stats.isDirectory()) {
        repo.addFiles(options.run, ".sol");
    } else if (stats.isFile()) {
        repo.addFile(options.run);
    }

    if (options.ast && stats.isFile()) {
        let output = {};

        if (NodeUtility.matchString(options.ast, "solc")) {
            output = repo.sol_files[0].solc_compilation_output.sources;
        } else if (NodeUtility.matchString(options.ast, "antlr")) {
            output = repo.sol_files[0].antlrAST;
        }

        if (Object.keys(output).length === 0) {
            console.log("Provide a valid AST option");
        } else {
            const response = JSON.stringify(output, null, 4);
            console.log(response);
        }
    } else {
        let sourceType: string = "solidity-file";
        let sourceFormat: string = "text";

        let reports: Report[] = Analyzer.runAllPlugins(repo, config, sourceType, sourceFormat);

        if (options.output === "json") {
            Reporter.toJSON(reports);
        } else {
            Reporter.toText(reports[0].issues);
        }
    }
} else {
    console.log(`Maru version ${pkg.version}`);
}