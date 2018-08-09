#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const parser = require('solidity-parser-antlr');
const util = require('util')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const analyzer = require('./src/analyzer.js')
const file_utils = require('./src/file_utils.js')

const optionDefinitions = [
  { name: 'version', alias: 'v', type: Boolean },
  { name: 'test', alias: 't', type: Boolean },
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
else if(options['test']){
	const files = file_utils.searchRecursive('./test/', '.sol'); 
    for (var i in files) {
    	const contract_content = fs.readFileSync(files[i]).toString();
  		analyzer.checkInsecureArithmetic(contract_content);
	}
}	






