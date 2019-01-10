import { IssueDetailed } from "./issue";
import Report from "./report";
import NodeUtility from "../utils/node";
import { MythXIssue } from "./mythX";
import logger from "../logger/logger";

class Reporter {
    static toText(reports: Report[]) {
        let issues: IssueDetailed[] = [];

        for (const report of reports) {
            issues = issues.concat(report.issues);
        }

        for (const issue of issues) {
            console.log("----------------------------------");
            issue.print();
        }
    }
    static toJSON(reports: Report[]) {
        for (const report of reports) {
            const issues = report.issues.map(item => item.jsonValue());
            let filtered_issues: MythXIssue[] = [];

            logger.debug(`Converting ${issues.length} issues to MythX standard issues.`);
            for (let x: number = 0; x < issues.length; x++) {
                let found: boolean = false;

                for (let y: number = 0; y < filtered_issues.length; y++) {
                    if (
                        NodeUtility.matchString(issues[x]["swcID"], filtered_issues[y]["swcID"]) &&
                        NodeUtility.matchString(issues[x]["swcTitle"], filtered_issues[y]["swcTitle"]) &&
                        NodeUtility.matchString(issues[x].description.head, filtered_issues[y].description.head) &&
                        NodeUtility.matchString(issues[x].description.tail, filtered_issues[y].description.tail)
                    ) {
                        found = true;
                        filtered_issues[y].locations.push(issues[x].locations[0]);
                    }
                }
                if (!found) {
                    filtered_issues.push(issues[x]);
                }
            }

            console.log(
                JSON.stringify(
                    {
                        sourceType: report.sourceType,
                        sourceFormat: report.sourceFormat,
                        sourceList: report.sourceList,
                        issues: filtered_issues,
                        meta: report.meta
                    },
                    null,
                    4
                )
            );
        }
    }
}

export default Reporter;
