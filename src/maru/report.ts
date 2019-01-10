import { IssueDetailed } from "./issue";
import { MythXIssue } from "./mythX";

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
        this.meta = meta;
        this.issues = issues;
    }
}

class MythXReport {
    sourceType: string;
    sourceFormat: string;
    sourceList: string[];
    meta: {};
    issues: MythXIssue[];

    constructor(sourceType: string, sourceFormat: string, sourceList: string[], issues: MythXIssue[], meta: {}) {
        this.sourceType = sourceType;
        this.sourceFormat = sourceFormat;
        this.sourceList = sourceList;
        this.meta = meta;
        this.issues = issues;
    }
}

export { MythXReport, Report };
