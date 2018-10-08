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
      const linenumber_start = this.issuePointer.linenumber_start;
      const linenumber_end = this.issuePointer.linenumber_end;
      if (line_numbers !== undefined || line_numbers.length != 0) {
        if ((linenumber_start != null) && (linenumber_end != null)) {
          for(let x=0;x<line_numbers.length;x++){
            if ((linenumber_start <= line_numbers[x]) && (linenumber_end >= line_numbers[x])) {
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
    console.log(`filename: ${this.filename}`);
    console.log(`contract: ${this.contract}`);
    console.log(`code: ${this.code}`);
    this
      .issuePointer
      .print();
  }

  jsonValue() {
    return {
      filename: this.filename,
      contract: this.contract,
      code: this.code,
      issuePointer: this
        .issuePointer
        .jsonValue(),
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
    if(this.linenumber_start != this.linenumber_end){
      console.log(`linenumber: ${this.linenumber_start} - ${this.linenumber_end}`);
    }  
    else {  
      console.log(`linenumber: ${this.linenumber_start}`);
    }
   // console.log(`expr_start: ${this.expr_start}`);
    //console.log(`expr_end: ${this.expr_end}`);
    //IssuePointer.swc.printForId(this.id);
 //   console.log(IssuePointer.swc.getTitle(this.id));
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
