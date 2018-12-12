const path = require("path");

import SWC from "./../swc/swc";
import Location from "../misc/location";

const SWC_REGISTRY_DOC = "https://smartcontractsecurity.github.io/SWC-registry/docs";

class IssueDetailed {
  file_name: string;
  code: string;
  issuePointer: IssuePointer;
  swcURL: string;

  constructor(file_name: string, code: string, ip: IssuePointer) {
    this.file_name = file_name;
    this.code = code;
    this.issuePointer = ip;
    this.swcURL = `${SWC_REGISTRY_DOC}/${ip.id}`;
  }

  /**
   * compare report issue with test case data with line number, and determine if the issue was right reported
   *
   * @param issueShouldReportId issue data in test case
   */
  isSameWithTestCase(issueShouldReportId: string, line_numbers: any): boolean {
    if (this.issuePointer.id === issueShouldReportId) {
      const { lineNumberStart, lineNumberEnd } = this.issuePointer;
      if (line_numbers !== undefined || line_numbers.length !== 0) {
        if ((lineNumberStart != null) && (lineNumberEnd != null)) {
          for (const line_number of line_numbers) {
            if ((lineNumberStart <= line_number) && (lineNumberEnd >= line_number)) {
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
    console.log(`Filename: ${this.file_name}`);
    console.log(`Title: ${this.issuePointer.swc.getTitle()}`);
    console.log(`SWC-Link: ${this.swcURL}`);
    console.log(`Description-Short: ${this.issuePointer.descriptionShort}`);
    console.log(`Code: \n${this.code}`);
  }

  jsonValue() {
    const { id } = this.issuePointer;
    const { lineNumberStart, lineNumberEnd, columnStart, columnEnd, src } = this.issuePointer;
    return {
      "swc-id": id,
      "swc-title": this.issuePointer.swc.getTitle(),
      "description-short": this.issuePointer.descriptionShort,
      "filename": this.file_name,
      "lineNumberStart": lineNumberStart,
      "lineNumberEnd": lineNumberEnd,
      "columnStart": columnStart,
      "columnEnd": columnEnd,
      "src": src,
      "swc-link": this.swcURL,
    };
  }

  jsonPrint() {
    console.log(JSON.stringify(this.jsonValue(), null, 4));
  }

}

class IssuePointer {
  swc: SWC;
  id: string;
  descriptionShort: string;
  lineNumberStart: number;
  lineNumberEnd: number;
  columnStart: number;
  columnEnd: number;
  src: string;

  constructor(id: string, descriptionShort: string, location: Location) {
    this.swc = new SWC(id);
    this.id = id;
    this.descriptionShort = descriptionShort;
    this.lineNumberStart = location.lineNumberStart;
    this.lineNumberEnd = location.lineNumberEnd;
    this.columnStart = location.columnStart;
    this.columnEnd = location.columnEnd;
    this.src = location.src;
  }

  print() {
    console.log(`SWC ID: ${this.id}`);
    if (this.lineNumberStart !== this.lineNumberEnd) {
      console.log(`linenumber: ${this.lineNumberStart} - ${this.lineNumberEnd}`);
    } else {
      console.log(`linenumber: ${this.lineNumberStart}`);
    }
  }

  jsonValue() {
    return {
      id: this.id,
      descriptionShort: this.descriptionShort,
      lineNumberStart: this.lineNumberStart,
      lineNumberEnd: this.lineNumberEnd,
      columnStart: this.columnStart,
      columnEnd: this.columnEnd,
      src: this.src,
      swc: this.swc.getEntry(),
    };
  }

  jsonPrint() {
    console.log(JSON.stringify(this, null, 4));
  }
}

export { IssueDetailed, IssuePointer };