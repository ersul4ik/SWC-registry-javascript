const parser = require("solidity-parser-antlr");
const util = require("util");

import logger from "../logger/logger";
import Analyzer from "../maru/analyzer";
import { IssuePointer } from "../maru/issue";
import FileUtils from "./file";

class NodeUtility {
    static getStartLine(node: any) {
        return node.loc.start.line;
    }

    static getEndLine(node: any) {
        return node.loc.end.line;
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

    static printNode(node: any): void {
        logger.info(JSON.stringify(node, null, 4));
    }
}

export default NodeUtility;
