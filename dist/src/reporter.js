"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Reporter {
    static toText(issues) {
        for (const issue of issues) {
            console.log("----------------------------------");
            issue.print();
        }
    }
    static toJSON(issues) {
        for (const issue of issues) {
            console.log("----------------------------------");
            issue.jsonPrint();
        }
    }
}
exports.default = Reporter;
