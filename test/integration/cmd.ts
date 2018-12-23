import logger from "../../src/logger/logger";
import Report from "../../src/maru/report";
import { MythXIssue } from "../../src/maru/mythX";

const { spawn } = require("child_process");
const assert = require("assert");
const expect = require("expect");
const { version } = require("../../package.json");

describe("CMD commands", () => {
    it("should return maru version", () => {
        const prc = spawn("./maru", ["-v"]);
        prc.stdout.setEncoding("utf8");
        prc.stdout.on("data", (data: string) => {
            const str = data.toString();
            logger.debug(str);
            expect(str.includes(`Maru version ${version}`));
        });
    });

    it("should return MythX formatted JSON output", () => {
        const prc = spawn("./maru", ["-r", "./test/sol_files/imports/simple.sol", "-o", "json"]);
        prc.stdout.setEncoding("utf8");
        prc.stdout.on("data", (data: string) => {
            const report: Report = JSON.parse(data.toString());
            expect(report.sourceType).toEqual("solidity-file");
            expect(report.sourceFormat).toEqual("text");
            expect(report.sourceList.length).toEqual(2);
            expect(report.issues.length).toEqual(1);
            expect(report.meta).toEqual({});
        });
    });
});
