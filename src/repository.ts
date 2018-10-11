import FileUtils from "./file_utils";
import { IssueDetailed } from "./issue";
const fs = require("fs");

class Repository {
  issues: IssueDetailed[] = [];
  files: { [key: string]: string } = {};

  addIssue(issue: IssueDetailed) {
    this.issues.push(issue);
  }

  addIssues(issues: IssueDetailed[]) {
    this.issues.concat(issues);
  }

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
}

export default Repository;
