#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const parser = require('solidity-parser-antlr');
const util = require('util')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const Analyzer = require('./src/analyzer.js')
const File_utils = require('./src/file_utils.js')
const Issue = require('./src/issue');
const Reporter = require('./src/reporter');
const Repository = require('./src/repository');


const optionDefinitions = [
  { name: 'version', alias: 'v', type: Boolean },
  { name: 'run', alias: 'r', type: String },
  { name: 'help', alias: 'h', type: Boolean }
]
const options = commandLineArgs(optionDefinitions)

const sections = [
  {
    header: 'Solidity Static Analyzer',
    content: 'Looks for vulnerabilities in Solidity code.'
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  }
]



if(options['help'] || options.length < 1 ){
	const usage = commandLineUsage(sections);
	console.log('usage');
	console.log(usage);
	return;
}


if (options['version']){
	console.log('This is version 0.0.1')
}
else if(options['run']){
  var config = {}
  var issues = []

  try {
    config = require('./config/config.json')
  } catch (e) {
    throw new Error("Missing config")

  }

  var repo =  new Repository()
  repo.addFiles(options['run'], '.sol')

  var issues = Analyzer.runAllPlugins(repo,config)
  Reporter.toText(issues)

}	






