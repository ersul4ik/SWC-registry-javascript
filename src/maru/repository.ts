import FileUtils from "../utils/file";
import { IssueDetailed } from "./issue";
import SolFile from "./sol_file";
const fs = require("fs");

// A Repository is a list of SolFiles

class Repository {
    sol_files: SolFile[] = [];

    constructor() {}

    addFile(file_name: string): void {
        this.sol_files.push(new SolFile(file_name));
    }

    addFiles(directory: string, pattern: string): void {
        const file_names = FileUtils.searchRecursive(directory, pattern);
        for (const file_name of file_names) {
            this.addFile(file_name);
        }
    }
}

export default Repository;
