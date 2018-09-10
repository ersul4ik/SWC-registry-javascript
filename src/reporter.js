class Reporter {
  static toText(issues) {
    for (const issue of issues) {
      console.log('----------------------------------');
      issue.print();
    }
  }
}

module.exports = Reporter;
