const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const yaml = require('js-yaml');
const { strictEqual, fail } = require('assert');
const Repository = require('../../src/repository');

const OMNIBUS_DIR = 'test/fixtures/Omnibus';

const yamlFiles = new Repository();
yamlFiles.addFiles(OMNIBUS_DIR, '.yaml');


function countKeyValueInAoH(arr,s_key,s_value){
  var count = 0;
  for (const h of arr){
    const keys = Object.keys(h)
    for(const key of keys){
      if (h[key] === s_value && s_key === key){
        count++;
      }
    }
  }
  return count;
}

function isKeyValueInAoH(arr,s_key,s_value){
  for (const h of arr){
    const keys = Object.keys(h)
    for(const key of keys){
      if (toString(h[key]) === toString(s_value) && key === s_key){
        return true;
      }
    }
  }
}

function getIssuesSameValue(arr,s_key,s_value){
  var same_ids = [];
    for (const h of arr){
    const keys = Object.keys(h)
    for(const key of keys){
      if (h[key] === s_value && s_key === key){
        same_ids.push(h)
      }
    }
  }
  return same_ids;
}

function parseTextOutput(output) {
  // Each issues is separated by multiple dashes
  const issuesText = output.split('----------------------------------').slice(1);

  return issuesText.map((issueText) => {
    // Convert each "<name>": "<value"> pair into object properties
    const obj = {};
    // Parameters starts from new line
    issueText.trim().split('\n').forEach((param) => {
      /* eslint-disable-next-line no-unused-vars */
      const [line, key, value] = param.match(/(.+): (.+)/);
      obj[key] = value;
    });

    return obj;
  });
}

describe('Running Omnibus Benchmarks', () => {
  for (const [yamlFile, filecontent] of Object.entries(yamlFiles.files)) {
    const benchmarkConfig = yaml.safeLoad(fs.readFileSync(yamlFile));
    // benchmark has to have solidity file wit the same name as the yaml file
    const testFile = yamlFile.replace('.yaml', '.sol');
    
    it(`Benchmark - ${benchmarkConfig.description}`, async () => {

      const { stdout, stderr } = await exec(`node maru.js --run ${testFile}`);
      // Verify that there are no errors
      strictEqual(stderr, '');
      const foundIssues = parseTextOutput(stdout);

      // Check if the number of found issues is the same as expected
      for (const benchmarkIssue of benchmarkConfig.issues) {
        strictEqual(countKeyValueInAoH(foundIssues,"id",benchmarkIssue.id), benchmarkIssue.count, 'Number of issues is not identical');
        for (const loc of benchmarkIssue.location) {
          // get the issues wit the same id  
          const same_issues = getIssuesSameValue(foundIssues,"id",benchmarkIssue.id);
          // check if the linenumber in the benchconf matches with the one in the foundIssues
          strictEqual(isKeyValueInAoH(same_issues,"linenumber_start",loc.line_number), true, 'Line number does not match with benchmark configuration');
        }
      }
    });
  }
});
