import logger from "../../src/logger/logger";
import { Report, MythXReport } from "../../src/maru/report";
import { MythXIssue } from "../../src/maru/mythX";
import NodeUtility from "../../src/utils/node";
import SolFile from "../../src/maru/sol_file";

const { spawn } = require("child_process");
const assert = require("assert");
const expect = require("expect");
const { version } = require("../../package.json");

describe("CMD commands", () => {
    it("-v: should return maru version", () => {
        const prc = spawn("maru", ["-v"]);
        prc.stdout.setEncoding("utf8");
        prc.stdout.on("data", (data: string) => {
            const str = data.toString();
            // logger.debug(str);
            expect(str.includes(`Maru version ${version}`));
        });
    });

    it("-r: should return MythX formatted JSON output", () => {
        const prc = spawn("maru", ["-r", "./test/sol_files/report/reports.sol", "-o", "json"]);
        prc.stdout.setEncoding("utf8");
        prc.stdout.on("data", (data: string) => {
            const reports: MythXReport[] = JSON.parse(data.toString());

            expect(reports.length).toEqual(2);
            expect(reports[0].issues).toEqual(4);
            expect(reports[0].issues).toEqual(3);
            expect(reports.length).toEqual(2);

            expect(reports[0].sourceType).toEqual("solidity-file");
            expect(reports[0].sourceFormat).toEqual("text");
            expect(reports[0].sourceList.length).toEqual(2);

            expect(reports[0].issues[0].locations.length).toEqual(2);
            expect(reports[0].issues[0].swcID).toEqual("SWC-103");
            expect(reports[0].issues[0].swcTitle).toEqual("Floating Pragma");
            expect(reports[0].issues[0].description.head.length).toBeGreaterThan(0);
            expect(reports[0].issues[0].description.tail.length).toBeGreaterThan(0);
            expect(reports[0].issues[0].severity).toEqual("");
            expect(reports[0].issues[0].extra).toEqual({});
        });
    });

    it("-r: running on an invalid Solidity file should return an error in the JSON output", () => {
        const error = "./test/sol_files/errors/error.sol";

        const prc = spawn("maru", ["-r", error, "-o", "json"]);
        prc.stdout.setEncoding("utf8");
        prc.stdout.on("data", (data: string) => {
            NodeUtility.printNode(data.toString());
            const report: Report = JSON.parse(data.toString());
        });
    });
});
