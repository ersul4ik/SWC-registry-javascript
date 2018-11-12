import FileUtils from "../utils/file";
import { IssueDetailed } from "./issue";
import SolFile from './sol_file'
const fs = require("fs");

// A Repository is a list of SolFiles 

class Repository {

  files: SolFile[] = [];

  constructor() { }

  /*
  addIssue(issue: IssueDetailed) {
    this.issues.push(issue);
  }

  addIssues(issues: IssueDetailed[]) {
    this.issues.concat(issues);
  }
  */
  /*
  addFile(filename: string) {
    this.files[filename] = fs
      .readFileSync(filename)
      .toString();
  }

  addFiles(directory: string, pattern: string) {
    const filenames = FileUtils.searchRecursive(directory, pattern);
    for (const filename of filenames) {
      this.addFile(filename);
    }
  }
  */
}

export default Repository;
