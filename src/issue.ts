import SWC from "./swc";

class IssueDetailed {
  filename = "";
  contract = "";
  code = "";
  issuePointer: IssuePointer;

  constructor(filename: string, contract: string, code: string, ip: IssuePointer) {
    this.filename = filename;
    this.contract = contract;
    this.code = code;
    this.issuePointer = ip;
  }

  /**
   * compare report issue with test case data with line number, and determine if the issue was right reported
   *
   * @param issueShouldReportId issue data in test case
   */
  isSameWithTestCase(issueShouldReportId: string, line_numbers: any): boolean {
    if (this.issuePointer.id === issueShouldReportId) {
      const {linenumber_start, linenumber_end } = this.issuePointer;
      if (line_numbers !== undefined || line_numbers.length !== 0) {
        if ((linenumber_start != null) && (linenumber_end != null)) {
          for (const line_number of line_numbers) {
            if ((linenumber_start <= line_number) && (linenumber_end >= line_number)) {
              return true;
            }
          }
        }
      } else {
        return true;
      }
    }
    return false;
  }

  print() {
    const { id } = this.issuePointer;
    const title = IssuePointer.swc.getTitle(id);
    const SWCUrl = `https://smartcontractsecurity.github.io/SWC-registry/docs/${id}`;

    console.log(`Filename: ${this.filename}`);
    console.log(`Title: ${title}`);
    console.log(`SWC-Link: ${SWCUrl}`);
    console.log(`Contract: ${this.contract}`);
    console.log(`Code: \n${this.code}`);
  }

  jsonValue() {
    const { id } = this.issuePointer;
    const { linenumber_start, linenumber_end } = this.issuePointer;
    const title = IssuePointer.swc.getTitle(id);
    const relationships = IssuePointer.swc.getRelationships(id);
    const description = IssuePointer.swc.getDescription(id);
    const remediation = IssuePointer.swc.getRemediation(id);
    const references = IssuePointer.swc.getReferences(id);
    // TODO: IssuePointer.swc.getSeverity(id);
    const severity = "Critical";
    const SWCUrl = `https://smartcontractsecurity.github.io/SWC-registry/docs/${id}`;
    return {
      "contractName": this.contract,
      "swc-id": id,
      "lineNumberStart": linenumber_start,
      "lineNumberEnd": linenumber_end,
      "filename": this.filename,
      "swc-link": SWCUrl,
      "swc-title": title,
      "swc-relationships": relationships,
      "swc-description": description,
      "swc-remediation": remediation,
      "swc-references": references,
      "severity": severity,
    };
  }

  jsonPrint() {
    console.log(JSON.stringify(this.jsonValue(), null, 4));
  }

}

class IssuePointer {
  static swc = new SWC();
  id: string;
  linenumber_start?: number;
  linenumber_end?: number;
  expr_start?: number;
  expr_end?: number;

  constructor(id: string, linenumber_start?: number, linenumber_end?: number, expr_start?: number, expr_end?: number) {
    this.id = id;
    this.linenumber_start = linenumber_start;
    this.linenumber_end = linenumber_end;
    this.expr_start = expr_start;
    this.expr_end = expr_end;
  }

  print() {
    console.log(`SWC ID: ${this.id}`);
    if(this.linenumber_start !== this.linenumber_end) {
      console.log(`linenumber: ${this.linenumber_start} - ${this.linenumber_end}`);
    } else {
      console.log(`linenumber: ${this.linenumber_start}`);
    }
  }

  jsonValue() {
    return {
      id: this.id,
      linenumber_start: this.linenumber_start,
      linenumber_end: this.linenumber_end,
      expr_start: this.expr_start,
      expr_end: this.expr_end,
      swc: IssuePointer.swc.jsonValueForId(this.id),
    };
  }

  jsonPrint() {
    console.log(JSON.stringify(this, null, 4));
  }
}

export { IssueDetailed, IssuePointer };
