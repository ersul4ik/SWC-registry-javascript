
const fs = require('fs');
const path = require('path');

class FileUtils {
  static searchRecursive(dir, pattern) {
    let results = [];

    fs.readdirSync(dir).forEach((_dirInner) => {
      const dirInner = path.resolve(dir, _dirInner);
      const stat = fs.statSync(dirInner);

      if (stat.isDirectory()) {
        results = results.concat(module.exports.searchRecursive(dirInner, pattern));
      }

      if (stat.isFile() && dirInner.endsWith(pattern)) {
        results.push(dirInner);
      }
    });

    return results;
  }

  static getCodeAtLine(filecontent, linenumber) {
    const lines = filecontent.split('\n');
    return lines[linenumber - 1];
  }
}


module.exports = FileUtils;
