const parser = require("solidity-parser-antlr");
const util = require("util");

import logger from "../logger/logger";
import Analyzer from "../maru/analyzer";
import { IssuePointer } from "../maru/issue";
import FileUtils from "./file";

class AstUtility {

  static getStartLine(node: any) {
    return node.loc.start.line;
  }

  static getEndLine(node: any) {
    return node.loc.end.line;
  }

  static isVersionFixed(version: string) {
    return !version.match(/\^/);
  }

  static matchRegex(node: any, match: RegExp): boolean {
    if (node !== null && node !== undefined) {
      if (node.match(match)) {
        return true;
      }
    }
    return false;
  }

  static matchString(node: string, match: string): boolean {
    if (node !== null && node !== undefined) {
      if (node.match(match)) {
        return true;
      }
    }
    return false;
  }

  static hasProperty(o: Object, property: string): boolean {
    if (o instanceof Object) {
      if (o.hasOwnProperty(property)) {
        return true;
      }
    }
    return false;
  }

  static logNode(node: any): void {
    logger.info(JSON.stringify(node, null, 4));
  }

  static printNode(node: any): void {
    console.log(JSON.stringify(node, null, 4));
  }

}

export default AstUtility;
