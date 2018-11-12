import Node from "../declarations/node";
import SolidityAntlr from "../parser/solidity_antlr";
import Pragma from "../declarations/pragma";
import Contract from '../declarations/contract';

class SolFile {
    subNodes: Node;
    pragma: Pragma;
    contracts_current: Contract[];
    contracts_imported: Contract[];

    constructor(file_name: string) {
        this.subNodes = SolidityAntlr.generateAST(file_name);
        this.pragma = SolidityAntlr.parsePragma(this.subNodes);
        this.contracts_current = SolidityAntlr.parseContracts(this.subNodes);
        this.contracts_imported = SolidityAntlr.parseImportedContracts(file_name, this.subNodes);
    }
}

export default SolFile;