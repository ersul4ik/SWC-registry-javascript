
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
}


module.exports = FileUtils;


