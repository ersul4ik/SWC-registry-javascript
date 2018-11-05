const path = require("path");
const { ok, fail } = require("assert");
const fs = require("fs");

describe("Test import directive", () => {
    const stats = fs.statSync(path);

    if (stats.isFile()) {
        const file_content =  stats.readFileSync(path).toString();
  
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



