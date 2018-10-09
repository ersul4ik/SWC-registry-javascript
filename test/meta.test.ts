
const { spawn } = require("child_process");
const assert = require("assert");
const { version } = require("../package.json");

describe("Meta commands", () => {
  it("should return maru version", () => {
    const prc = spawn("maru",  ["-v"]);
    prc.stdout.setEncoding("utf8");
    prc.stdout.on("data", (data: string) => {
      const str = data.toString();
      assert(str.includes(`This is version ${version}`));
    });
  });
});
