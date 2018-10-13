const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { ok, fail } = require("assert");
import { strictEqual } from "assert";
import config from "../../config/config.json";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

const STDOUT_DIVIDER = "----------------------------------";

const listToMap = (arr: any) => arr.reduce((map: any, obj: any) => {
  const matchResult = obj.match(/(.+): (.+)/);
  if (matchResult) {
    const [_, key, value] = matchResult;
    map[key] = value;
  }
  return map;
}, {});

function parseTextOutput(output: any) {
  let [issuesText] = output.split(STDOUT_DIVIDER).splice(1);
  issuesText = issuesText.trim().split("\n");
  return listToMap(issuesText);
}

describe("Running Maru Command Line Tool Test Case", () => {
  const swcFile = path.resolve(__dirname, "..", "SWC-registry", "test_cases",
    "call_best_practices", "unchecked_return_value.sol");

  it(`Test case - should output with JSON format when given --output json`, async () => {
    const { stdout, _ } = await exec(`./maru --run ${swcFile} --output json`);
    const [results] = stdout.split(STDOUT_DIVIDER).splice(1);
    try {
      const outputJson = JSON.parse(results);
      ok(outputJson["swc-id"] === "SWC-108");
    } catch (e) {
      fail(e);
    }
  });

  it(`Test case - should output with text format when given --output txt`, async () => {
    const { stdout, _ } = await exec(`./maru --run ${swcFile} --output txt`);
    const results = parseTextOutput(stdout);
    strictEqual(results["SWC-ID"], "SWC-108");
  });

});
