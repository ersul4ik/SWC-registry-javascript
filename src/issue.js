class IssueDetailed {
  constructor(filename, contract, code, ip) {
    this.filename = filename;
    this.contract = contract;
    this.code = code;
    this.issuePointer = ip;
  }

  print() {
    console.log(`filename: ${this.filename}`);
    console.log(`contract: ${this.contract}`);
    console.log(`code: ${this.code}`);
    this.issuePointer.print();
  }
}

class IssuePointer {
  constructor(id, linenumber_start, linenumber_end, expr_start, expr_end) {
    this.id = id;
    this.linenumber_start = linenumber_start;
    this.linenumber_end = linenumber_end;
    this.expr_start = expr_start;
    this.expr_end = expr_end;
  }

  print() {
    console.log(`id: ${this.id}`);
    console.log(`linenumber_start: ${this.linenumber_start}`);
    console.log(`linenumber_end: ${this.linenumber_start}`);
    console.log(`expr_start: ${this.expr_start}`);
    console.log(`expr_end: ${this.expr_end}`);
  }
}


module.exports = { IssueDetailed, IssuePointer };
