import { IssueDetailed } from "./issue";

class Report {
    sourceType: string;
    sourceFormat: string;
    sourceList: string[];
    meta: {};
    issues: IssueDetailed[];

    constructor(sourceType: string, sourceFormat: string, sourceList: string[], issues: IssueDetailed[], meta: {}) {
        this.sourceType = sourceType;
        this.sourceFormat = sourceFormat;
        this.sourceList = sourceList;
        this.meta = {};
        this.issues = issues;
    }
}

export default Report;
