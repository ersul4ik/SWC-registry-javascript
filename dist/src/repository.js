"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_utils_1 = __importDefault(require("./file_utils"));
const fs = require("fs");
class Repository {
    constructor() {
        this.issues = [];
        this.files = {};
    }
    addIssue(issue) {
        this.issues.push(issue);
    }
    addIssues(issues) {
        this.issues.concat(issues);
    }
    addFile(filename) {
        this.files[filename] = fs
            .readFileSync(filename)
            .toString();
    }
    addFiles(directory, pattern) {
        const filenames = file_utils_1.default.searchRecursive(directory, pattern);
        for (const filename of filenames) {
            this.addFile(filename);
        }
    }
}
exports.default = Repository;
