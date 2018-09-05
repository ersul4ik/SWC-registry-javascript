const fs = require('fs');
const FileUtils = require('../src/file_utils.js');

class Repository {
  constructor() {
    this.files = {};
    this.issues = [];
    this.commitHash = '';
  }

  addIssue(issue) {
    this.issues.push(issue);
  }

  addIssues(issues) {
    this.issues.concat(issues);
  }

  addFile(filename, filecontent) {
    this.files[filename] = filecontent;
  }

  addFiles(directory, pattern) {
    const filenames = FileUtils.searchRecursive(directory, pattern);
    for (const filename of filenames) {
      const contractContent = fs.readFileSync(filename).toString();
      this.addFile(filename, contractContent);
    }
  }
}

module.exports = Repository;
