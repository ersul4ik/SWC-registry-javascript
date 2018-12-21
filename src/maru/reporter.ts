import { IssueDetailed } from "./issue";
import Report from "./report";
import NodeUtility from "../utils/node";
import { MythXIssue } from "./mythX";

class Reporter {
    static toText(issues: IssueDetailed[]) {
        for (const issue of issues) {
            console.log("----------------------------------");
            issue.print();
        }
    }
    static toJSON(reports: Report[]) {
        let report: Report = reports[0];
        const issues = report.issues.map(item => item.jsonValue());
        let filtered_issues: MythXIssue[] = [];

        for (let x: number = 0; x < issues.length; x++) {
            let found: boolean = false;
            for (let y: number = 0; y < filtered_issues.length; y++) {
                if (
                    NodeUtility.matchString(issues[x]["swc-id"], filtered_issues[y]["swc-id"]) &&
                    NodeUtility.matchString(issues[x]["swc-title"], filtered_issues[y]["swc-title"]) &&
                    NodeUtility.matchString(issues[x].description.head, filtered_issues[y].description.head) &&
                    NodeUtility.matchString(issues[x].description.tail, filtered_issues[y].description.tail)
                ) {
                    found = true;
                    filtered_issues[y].locations.push(issues[x].locations[y]);
                }
            }
            if (!found) {
                filtered_issues.push(issues[x]);
            }
        }

        console.log(
            JSON.stringify(
                { sourceType: report.sourceType, sourceValue: report.sourceValue, sourceList: report.sourceList, issues: filtered_issues },
                null,
                4
            )
        );
    }
}

export default Reporter;
