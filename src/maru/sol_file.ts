import Node from "../misc/node";
import SolidityAntlr from "../parser/solidity_antlr";
import Pragma from "../declarations/pragma";
import Contract from '../declarations/contract';
import { IssueDetailed, IssuePointer } from "./issue";
import CFunction from "../declarations/cfunction";
import logger from "../logger/logger";

class SolFile {
    file_name: string;
    block: Node;
    pragma: Pragma;
    contracts_current: Contract[];
    contracts_imported: Contract[];

    constructor(file_name: string) {
        this.file_name = file_name;
        this.block = new Node(SolidityAntlr.generateAST(file_name));
        this.pragma = SolidityAntlr.parsePragma(this.block);
        this.contracts_current = SolidityAntlr.parseContracts(this.block);
        this.contracts_imported = SolidityAntlr.parseImportedContracts(file_name, this.block);
    }

    getContractFunctions(): CFunction[] {
        let f: CFunction[] = [];
        for (const c of this.contracts_current) {
            f = f.concat(c.functions);
        }
        return f;
    }

}

export default SolFile;