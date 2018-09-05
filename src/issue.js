class IssueDetailed {
  constructor(filename, contract, type, code, linenumber) {
    this.filename = filename;
    this.contract = contract;
    this.type = type;
    this.code = code;
    this.linenumber = linenumber;
  }

  print() {
    console.log(`filename: ${this.filename}`);
    console.log(`contract: ${this.contract}`);
    console.log(`type: ${this.type}`);
    console.log(`code: ${this.code}`);
    console.log(`linenumber: ${this.linenumber}`);
  }
}

class IssuePointer {
  constructor(linenumber) {
    this.linenumber = linenumber;
  }

  print() {
    console.log(`linenumber: ${this.linenumber}`);
  }
}


module.exports = { IssueDetailed, IssuePointer };
