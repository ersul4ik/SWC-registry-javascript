import { IssueDetailed } from "./issue";

class Reporter {
    static toText(issues: IssueDetailed[]) {
        for (const issue of issues) {
            console.log("----------------------------------");
            issue.print();
        }
    }
    static toJSON(issues: IssueDetailed[]) {
        const response = issues.map(item => item.jsonValue());
        console.log(JSON.stringify({ issues: response }, null, 4));
    }
}

export default Reporter;
