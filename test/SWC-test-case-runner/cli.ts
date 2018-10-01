const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { ok, fail } = require("assert");
import { strictEqual } from "assert";
import config from "../../config/config.json";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

function parseTextOutput(output: string) {
  // Each issues is separated by multiple dashes
  const issuesText = output.split("----------------------------------").slice(1);

  return issuesText.map((issueText) => {
    // Convert each "<name>": "<value"> pair into object properties
    const obj: any = {};
    // Parameters starts from new line
    issueText.trim().split("\n").forEach((param) => {
      const matchResult = param.match(/(.+): (.+)/);
      if (matchResult) {
        let _: any;
        let key: any;
        let value: any;
        [_, key, value] = matchResult;
        obj[key] = value;
      }
    });

    return obj;
  });
}

describe("Running Maru Command Line Tool Test Case", () => {

  const swcFile = path.resolve(__dirname, "..", "SWC-registry", "test_cases",
    "call_best_practices", "unchecked_return_value.sol");

  it(`Test case - should output with JSON format when given --output json`, async () => {
    const { stdout, _ } = await exec(`./maru --run ${swcFile} --output json`);
    const results = stdout.split("----------------------------------").slice(1);
    try {
      const outputJson = JSON.parse(results[0]);
      ok(outputJson.issuePointer.id === "SWC-108");
    } catch {
      fail("output should be json format");
    }
  });

  it(`Test case - should output with text format when given --output txt`, async () => {
    const { stdout, _ } = await exec(`./maru --run ${swcFile} --output txt`);
    const results = parseTextOutput(stdout);
    strictEqual(results[0].id, "SWC-108");
  });

});
