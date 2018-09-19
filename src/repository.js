const fs = require('fs');
const FileUtils = require('../src/file_utils.js');

class Repository {
  constructor() {
    this.files = {};
  }

  addIssue(issue) {
    this.issues.push(issue);
  }

  addIssues(issues) {
    this.issues.concat(issues);
  }

  addFile(filename) {
    this.files[filename] = fs.readFileSync(filename).toString();
  }

  addFiles(directory, pattern) {
    const filenames = FileUtils.searchRecursive(directory, pattern);
    for (const filename of filenames) {
      this.addFile(filename);
    }
  }
}

module.exports = Repository;
