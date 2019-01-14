import logger from "../../src/logger/logger";
import { Report, MythXReport } from "../../src/maru/report";
import { MythXIssue } from "../../src/maru/mythX";
import NodeUtility from "../../src/utils/node";
import SolFile from "../../src/maru/sol_file";
import Repository from "../../src/maru/repository";
import FileUtils from "../../src/utils/file";
import { spawnSync } from "child_process";

const { spawn } = require("child_process");
const assert = require("assert");
const expect = require("expect");
const { version } = require("../../package.json");

describe("Run Maru against all files in the SWC-registry", () => {
    const directory: string = "./test/SWC-registry/test_cases/";
    const pattern: string = ".sol";
    const file_names = FileUtils.searchRecursive(directory, pattern);
    for (const file_name of file_names) {
        it(`Test Cases: should return MythX formatted JSON output and no errors for ${file_name}`, () => {
            const sol_file: SolFile = new SolFile(file_name);
            const prc = spawnSync("./maru", ["-r", file_name, "-o", "json"]);
            let reports: Report[] = JSON.parse(prc.stdout.toString());

            expect(reports.length).toEqual(1);
            expect(reports[0].issues.length).toBeGreaterThanOrEqual(0);
            expect(reports[0].sourceType).toEqual("solidity-file");
            expect(reports[0].sourceFormat).toEqual("text");
            expect(reports[0].sourceList.length).toBeGreaterThanOrEqual(1);
            expect(reports[0].meta.selected_compiler.length).toBeGreaterThan(0);
            expect(reports[0].meta.error.length).toEqual(0);
            expect(reports[0].meta.error.length).toBeGreaterThanOrEqual(0);
        });
    }
});
