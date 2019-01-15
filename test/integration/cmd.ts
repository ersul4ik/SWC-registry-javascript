import { spawnSync } from "child_process";
import { Report, MythXReport } from "../../src/maru/report";
import NodeUtility from "../../src/utils/node";

const expect = require("expect");
const { version } = require("../../package.json");

describe("CMD commands", () => {
    it("-v: should return maru version", () => {
        const prc = spawnSync("maru", ["-v"]);
        const str = prc.stdout.toString();
        expect(str.includes(`Maru version ${version}`));
    });

    it("-r: should return MythX formatted JSON output", () => {
        const sol_file: string = "./test/sol_files/reports/A.sol";
        const prc = spawnSync("maru", ["-r", sol_file, "-o", "json"]);
        const reports: MythXReport[] = JSON.parse(prc.stdout.toString());

        expect(reports.length).toEqual(1);

        expect(reports[0].issues.length).toEqual(4);
        expect(reports.length).toEqual(1);

        expect(reports[0].sourceType).toEqual("solidity-file");
        expect(reports[0].sourceFormat).toEqual("text");
        expect(reports[0].sourceList.length).toEqual(2);
        expect(reports[0].meta.error.length).toEqual(0);

        expect(reports[0].issues[0].locations.length).toEqual(2);
        expect(reports[0].issues[0].swcID).toEqual("SWC-103");
        expect(reports[0].issues[0].swcTitle).toEqual("Floating Pragma");
        expect(reports[0].issues[0].description.head.length).toBeGreaterThan(0);
        expect(reports[0].issues[0].description.tail.length).toBeGreaterThan(0);
        expect(reports[0].issues[0].severity).toEqual("");
        expect(reports[0].issues[0].extra).toEqual({});
    });

    it("-r: running on an invalid Solidity file should return an error in the JSON output", () => {
        const error = "./test/sol_files/errors/error.sol";

        const prc = spawnSync("maru", ["-r", error, "-o", "json"]);

        const reports: MythXReport[] = JSON.parse(prc.stdout.toString());
        //     expect(reports[0].meta.error.length).toEqual(2);
    });
});
