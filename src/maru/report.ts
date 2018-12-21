import { IssueDetailed } from "./issue";

class Report {
    sourceType: string;
    sourceValue: string;
    sourceList: string[];
    meta: {};
    issues: IssueDetailed[];

    constructor(sourceType: string, sourceValue: string, sourceList: string[], issues: IssueDetailed[]) {
        this.sourceType = sourceType;
        this.sourceValue = sourceValue;
        this.sourceList = sourceList;
        this.meta = {};
        this.issues = issues;
    }
}

export default Report;
