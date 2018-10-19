import SWC from "./swc";

const SWC_REGISTRY_DOC = "https://smartcontractsecurity.github.io/SWC-registry/docs";

class IssueDetailed {
  path: string;
  filename: string;
  contract: string;
  code: string;
  issuePointer: IssuePointer;
  docURL: string;

  constructor(filename: string, contract: string, code: string, ip: IssuePointer) {
    this.path = filename;
    const splitedPath = filename.split('/');
    this.filename = splitedPath[splitedPath.length - 1]
    this.contract = contract;
    this.code = code;
    this.issuePointer = ip;
    this.docURL = `${SWC_REGISTRY_DOC}/${ip.id}`;
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
    console.log(`Filename: ${this.filename}`);
    console.log(`SWC-ID: ${id}`);
    console.log(`Title: ${this.issuePointer.swc.getTitle()}`);
    console.log(`SWC-Link: ${this.docURL}`);
    console.log(`Contract: ${this.contract}`);
    console.log(`Code: \n${this.code}`);
  }

  jsonValue() {
    const { id } = this.issuePointer;
    const { linenumber_start, linenumber_end } = this.issuePointer;
    return {
      "swc-id": id,
      "filename": this.filename,
      "lineNumberStart": linenumber_start,
      "lineNumberEnd": linenumber_end,
      "contractName": this.contract,
      "swc-link": this.docURL,
      ...this.issuePointer.swc.displaySWC(),
    };
  }

  jsonPrint() {
    console.log(JSON.stringify(this.jsonValue(), null, 4));
  }

}

class IssuePointer {
  swc: any;
  id: string;
  linenumber_start?: number;
  linenumber_end?: number;
  expr_start?: number;
  expr_end?: number;

  constructor(id: string, linenumber_start?: number, linenumber_end?: number, expr_start?: number, expr_end?: number) {
    this.swc = new SWC(id);
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
      swc: this.swc.getEntry(),
    };
  }

  jsonPrint() {
    console.log(JSON.stringify(this, null, 4));
  }
}

export { IssueDetailed, IssuePointer };
