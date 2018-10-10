#!/usr/bin/env node

const fs = require("fs");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const pkg = require("./package.json");
const Logger = require("logplease");

import Config from "./config/config.json";
import Analyzer from "./src/analyzer";
import Reporter from "./src/reporter";
import Repository from "./src/repository";

const DEFAULT_DEBUG_LEVEL = 'INFO'
const DEBUG_OPTIONS = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE']

Logger.setLogLevel(DEFAULT_DEBUG_LEVEL);

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
  {
    name: "debug",
    alias: "d",
    type: String,
    description: "Set debug level: DEBUG, INFO, WARN, ERROR, NONE",
  },
];

const options = commandLineArgs(optionDefinitions);

const debugLevel = options.debug && options.debug.toUpperCase();

if (DEBUG_OPTIONS.indexOf(debugLevel) > -1) {
  Logger.setLogLevel(debugLevel);
}

export const logger = Logger.create("utils");

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
} else if (options.version) {
  const version = require("./package.json").version;
  console.log(`This is version ${version}`);
} else if (options.run) {
  let config: { [plugins: string]: any } = {};
  config = Config;
  if (options.plugin != null) {
    const usingPlugins: { [plugins: string]: any } = {};
    options.plugin.split(",").forEach((plugin: string) => {
      if ((config.plugins[plugin] != null) && (config.plugins[plugin].SWC != null)) {
        usingPlugins[plugin] = config.plugins[plugin];
      } else {
        console.log(`${plugin} does not exist.`)
        return;
      }
    });
    config = {
      plugins: usingPlugins,
    };
  }
  const repo = new Repository();

  const stats = fs.statSync(options.run);
  if (stats.isDirectory()) {
    repo.addFiles(options.run, ".sol");
  } else if (stats.isFile()) {
    repo.addFile(options.run);
  }

  const issues = Analyzer.runAllPlugins(repo, config);
  if (options.output === "json") {
    Reporter.toJSON(issues);
  } else {
    Reporter.toText(issues);
  }
}
