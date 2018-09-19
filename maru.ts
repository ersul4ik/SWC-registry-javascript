#!/usr/bin/env node
/* eslint-disable global-require */
const fs = require('fs');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const Analyzer = require('./src/analyzer.js');
const Reporter = require('./src/reporter');
const Repository = require('./src/repository');

const optionDefinitions = [
  {
    name: 'version', alias: 'v', type: Boolean, description: 'Print current version',
  },
  {
    name: 'run', alias: 'r', type: String, typeLabel: '{underline directory}', description: 'Analyse files in specified directory',
  },
  {
    name: 'help', alias: 'h', type: Boolean, description: 'Print this help message',
  },
];

const options = commandLineArgs(optionDefinitions);

const sections = [
  {
    header: 'Solidity Static Analyzer',
    content: 'Looks for vulnerabilities in Solidity code.',
  },
  {
    header: 'Options',
    optionList: optionDefinitions,
  },
];

if (options.help || options.length < 1) {
  const usage = commandLineUsage(sections);
  console.log('usage');
  console.log(usage);
} else if (options.version) {
  /* eslint-disable-next-line prefer-destructuring */
  const version = require('./package.json').version;
  console.log(`This is version ${version}`);
} else if (options.run) {
  let config = {};

  try {
    config = require('./config/config.json');
  } catch (e) {
    throw new Error('Missing config');
  }

  const repo = new Repository();

  try {
    const stats = fs.statSync(options.run);
    if (stats.isDirectory()) {
      repo.addFiles(options.run, '.sol');
    } else if (stats.isFile()) {
      repo.addFile(options.run);
    }
  } catch (err) {
    throw new Error('File or directory does not exist');
  }

  const issues = Analyzer.runAllPlugins(repo, config);
  Reporter.toText(issues);
}
