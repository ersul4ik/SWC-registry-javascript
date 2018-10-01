"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class FileUtils {
    static searchRecursive(dir, pattern) {
        let results = [];
        fs.readdirSync(dir).forEach((_dirInner) => {
            const dirInner = path.resolve(dir, _dirInner);
            const stat = fs.statSync(dirInner);
            if (stat.isDirectory()) {
                results = results.concat(FileUtils.searchRecursive(dirInner, pattern));
            }
            if (stat.isFile() && dirInner.endsWith(pattern)) {
                results.push(dirInner);
            }
        });
        return results;
    }
    static getCodeAtLine(filecontent, linenumber_start, linenumber_end) {
        const lines = filecontent.split("\n");
        let code = "";
        for (let x = linenumber_start - 1; x <= linenumber_end - 1; x++) {
            code += lines[x];
        }
        return code;
    }
}
exports.default = FileUtils;
