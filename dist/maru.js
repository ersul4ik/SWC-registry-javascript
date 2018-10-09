#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const pkg = require("./package.json");
const config_json_1 = __importDefault(require("./config/config.json"));
const analyzer_1 = __importDefault(require("./src/analyzer"));
const reporter_1 = __importDefault(require("./src/reporter"));
const repository_1 = __importDefault(require("./src/repository"));
const optionDefinitions = [
    {
        name: "version",
        alias: "v",
        type: Boolean,
        description: "Print current version",
    }, {
        name: "run",
        alias: "r",
        type: String,
        typeLabel: "{underline directory}",
        description: "Analyse files in specified directory",
    },
    {
        name: "output",
        alias: "o",
        type: String,
        description: "output format, txt or json, default ouput format is txt",
    },
    {
        name: "plugin",
        alias: "p",
        type: String,
        description: "option to execute individual plugin, specified by plugin names given as comma-separated " +
            "value of this argument, run all plugins if not given",
    },
    {
        name: "help",
        alias: "h",
        type: Boolean,
        description: "Print this help message",
    },
];
const options = commandLineArgs(optionDefinitions);
const sections = [
    {
        header: "Maru",
        content: "A simple, rule based static code analyzer for Solidity smart contracts..",
    }, {
        header: "Options",
        optionList: optionDefinitions,
    },
];
if (options.help || options.length < 1) {
    const usage = commandLineUsage(sections);
    console.log(usage);
}
else if (options.version) {
    const { version } = pkg;
    console.log(`This is version ${version}`);
}
else if (options.run) {
    let config = {};
    config = config_json_1.default;
    if (options.plugin != null) {
        const usingPlugins = {};
        options.plugin.split(",").forEach((plugin) => {
            if ((config.plugins[plugin] != null) && (config.plugins[plugin].SWC != null)) {
                usingPlugins[plugin] = config.plugins[plugin];
            }
            else {
                console.log(`${plugin} does not exist.`);
                return;
            }
        });
        config = {
            plugins: usingPlugins,
        };
    }
    const repo = new repository_1.default();
    const stats = fs.statSync(options.run);
    if (stats.isDirectory()) {
        repo.addFiles(options.run, ".sol");
    }
    else if (stats.isFile()) {
        repo.addFile(options.run);
    }
    const issues = analyzer_1.default.runAllPlugins(repo, config);
    if (options.output === "json") {
        reporter_1.default.toJSON(issues);
    }
    else {
        reporter_1.default.toText(issues);
    }
}
