const parser = require("solidity-parser-antlr");

import { logger } from "../maru";
import Repository from "./repository";

class AstTool {
    static getContractAST(repo: Repository, config: { [plugins: string]: any }) {
        for (const [filename, filecontent] of Object.entries(repo.files)) {
            var ast;
            try {
                ast = parser.parse(filecontent, { loc: true, range: true });
            } catch (e) {
                logger.error("Exception during AST parsing for " + filename);
                console.log(e);
            }
        }
        return ast;
    }

}
export default AstTool;