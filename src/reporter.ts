import { IssueDetailed } from "./issue";

class Reporter {
  static toText(issues: IssueDetailed[]) {
    for (const issue of issues) {
      console.log("----------------------------------");
      issue.print();
    }
  }
  static toJSON(issues: IssueDetailed[]) {
    for (const issue of issues) {
      console.log("----------------------------------");
      issue.jsonPrint();
    }
  }
}

export default Reporter;
