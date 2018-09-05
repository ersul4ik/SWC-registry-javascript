const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const yaml = require('js-yaml');
const { strictEqual, fail } = require('assert');

const OMNIBUS_DIR = 'test/fixtures/Omnibus';

const configPath = path.join(OMNIBUS_DIR, 'benchconf', 'all.yaml');
const suiteConfig = yaml.safeLoad(fs.readFileSync(configPath));

function parseOutput(output) {
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

describe('Omnibus', () => {
  /* eslint-disable-next-line guard-for-in */
  for (const testName in suiteConfig) {
    // Get test case configuration
    const testCaseConfig = suiteConfig[testName];
    // Skip test if marked as ignored
    if (!testCaseConfig.ignore) {
      // Create test case dynamically
      it(`Omnibus - ${testName}`, async () => {
        // testName refers to directory that contains Solidity file
        const dirPath = path.dirname(path.join(OMNIBUS_DIR, 'benchmarks', testName));

        const { stdout, stderr } = await exec(`node maru.js --run ${dirPath}`);
        // Verify that there are no errors
        strictEqual(stderr, '');
        const foundIssues = parseOutput(stdout);
        // Check that number of found issues is the same as expected
        strictEqual(foundIssues.length, testCaseConfig.issues.length, 'Number of issues is not identical');

        for (const expectedIssue of testCaseConfig.issues) {
          /* eslint-disable-next-line arrow-body-style */
          const expected = foundIssues.filter((issue) => {
            // At the moment line number is the only filed that could be used to compare issues
            return expectedIssue.line_number === +issue.linenumber;
          }).length === 1;

          if (!expected) {
            fail(`Expected issue not found: ${JSON.stringify(expectedIssue)}. Found issues: ${JSON.stringify(foundIssues)}`);
          }
        }
      });
    } else {
      it.skip(`Omnibus - ${testName}`, () => {});
    }
  }
});
