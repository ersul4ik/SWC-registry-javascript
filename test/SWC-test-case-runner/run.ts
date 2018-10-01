const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { ok } = require("assert");

import config from "../../config/config.json";
import Analyzer from "../../src/analyzer";
import FileUtils from "../../src/file_utils";
import { IssueDetailed } from "../../src/issue";
import Repository from "../../src/repository";

const SWCRepoPath = path.resolve(__dirname, "..", "SWC-registry", "test_cases");

describe("Running SWC test cases for Maru", () => {

  const solFiles = FileUtils.searchRecursive(SWCRepoPath, ".sol");
  ok(solFiles.length > 0);

  solFiles.forEach((solFile) => {
    const repo = new Repository();
    repo.addFile(solFile);
    const issues = Analyzer.runAllPlugins(repo, config);
    const yamlFile = solFile.replace(".sol", ".yaml");
    const yamlContent = yaml.safeLoad(fs.readFileSync(yamlFile));
    yamlContent
      .issues
      .forEach((issueShouldReport: any) => {
        let solFileRel = solFile.split('/').slice(-2)[0] + '/' + path.basename(solFile)
        it(`Test case - ${solFileRel} should report ${issueShouldReport.id}`, () => {
          let issuesReportedCorrectly = 0;
          issueShouldReport.locations.forEach((locations: any) => {

            issues.forEach((issue: IssueDetailed) => {
              if(issue.isSameWithTestCase(issueShouldReport.id,locations.line_numbers)){
        
                issuesReportedCorrectly++;
              }
            });

          });

          ok.equal(issuesReportedCorrectly, issueShouldReport.count, `should find ${issueShouldReport.count} of ${issueShouldReport.id}`);
        });
      });

  });
});
