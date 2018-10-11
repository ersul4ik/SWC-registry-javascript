const parser = require("solidity-parser-antlr");

import { logger } from "../maru";
import Repository from "./repository";

class Parser {
    static getContractAST(repo: Repository, config: { [plugins: string]: any }) {
        const issues = [];
        let response;
        for (const [filename, filecontent] of Object.entries(repo.files)) {
            let ast;
            try {
                ast = parser.parse(filecontent, { loc: true, range: true });
            } catch (e) {
                logger.error("Exception during AST parsing for " + filename);
                console.log(e);
            }

            response = JSON.stringify(ast, null, 4);
            return response;
        }
    }
}
export default Parser;