
const fs = require('fs');
const path = require('path');

class FileUtils {
    static searchRecursive (dir, pattern) {
    var results = [];

    fs.readdirSync(dir).forEach(function (dirInner) {

      dirInner = path.resolve(dir, dirInner);
      var stat = fs.statSync(dirInner);

      if (stat.isDirectory()) {
        results = results.concat(module.exports.searchRecursive(dirInner, pattern));
      }

      if (stat.isFile() && dirInner.endsWith(pattern)) {
        results.push(dirInner);
      }
    });

    return results;
  }

  static getCodeAtLine(filecontent, linenumber){
    var lines = filecontent.split("\n")
    return lines[linenumber-1]
  }
}


module.exports = FileUtils;


