const fs = require("fs");
const path = require("path");

import logger from "../logger/logger";

class FileUtils {
  static searchRecursive(dir: string, pattern: string): string[] {
    let results: string[] = [];

    fs.readdirSync(dir).forEach((_dirInner: string) => {
      const dirInner = path.resolve(dir, _dirInner);
      const stat = fs.statSync(dirInner);

      if (stat.isDirectory()) {
        results = results.concat(FileUtils.searchRecursive(dirInner, pattern));
      }

      if (stat.isFile() && dirInner.endsWith(pattern)) {
        results.push(dirInner);
      }
    });

    return results;
  }

  static getCodeAtLine(filecontent: string, linenumber_start: number, linenumber_end: number): string {
    const lines = filecontent.split("\n");
    const code = [];
    for (let x = linenumber_start - 1; x <= linenumber_end - 1; x++) {
      code.push(`${x}: ${lines[x]}`);
    }
    return code.join("\n");
  }

  static getFileContent(filepath:string): string {
    const stats = fs.statSync(filepath);
    if (stats.isFile()) {
        return fs.readFileSync(filepath).toString();
    } else {
      logger.error("File not found " + filepath);
      return ""
    }

  }
}

export default FileUtils;
