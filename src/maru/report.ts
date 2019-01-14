import { IssueDetailed } from "./issue";
import { MythXIssue } from "./mythX";

class Report {
    sourceType: string;
    sourceFormat: string;
    sourceList: string[];
    meta: Meta;
    issues: IssueDetailed[];

    constructor(sourceType: string, sourceFormat: string, sourceList: string[], issues: IssueDetailed[], meta: Meta) {
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
    meta: Meta;
    issues: MythXIssue[];

    constructor(sourceType: string, sourceFormat: string, sourceList: string[], issues: MythXIssue[], meta: Meta) {
        this.sourceType = sourceType;
        this.sourceFormat = sourceFormat;
        this.sourceList = sourceList;
        this.meta = meta;
        this.issues = issues;
    }
}

class Meta {
    selected_compiler: string;
    error: string[];
    warning: string[];

    constructor(selected_compiler: string, error: string[], warning: string[]) {
        this.selected_compiler = selected_compiler;
        this.error = error;
        this.warning = warning;
    }
}

export { MythXReport, Report, Meta };
