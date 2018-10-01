"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swc_1 = __importDefault(require("./swc"));
class IssueDetailed {
    constructor(filename, contract, code, ip) {
        this.filename = "";
        this.contract = "";
        this.code = "";
        this.filename = filename;
        this.contract = contract;
        this.code = code;
        this.issuePointer = ip;
    }
    /**
     * compare report issue with test case data with line number, and determine if the issue was right reported
     *
     * @param issueShouldReport issue data in test case
     */
    isSameWithTestCase(issueShouldReport) {
        if (this.issuePointer.id === issueShouldReport.id) {
            const linenumber = issueShouldReport.location.line_number;
            const linenumber_start = this.issuePointer.linenumber_start;
            const linenumber_end = this.issuePointer.linenumber_end;
            if (linenumber != null) {
                if ((linenumber_start != null) && (linenumber_end != null)) {
                    if ((linenumber_start <= linenumber) && (linenumber_end >= linenumber)) {
                        return true;
                    }
                }
                else {
                    return false;
                }
            }
            else {
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
exports.IssueDetailed = IssueDetailed;
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
        IssuePointer.swc
            .printForId(this.id);
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
IssuePointer.swc = new swc_1.default();
exports.IssuePointer = IssuePointer;
