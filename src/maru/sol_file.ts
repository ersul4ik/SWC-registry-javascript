import Node from "../declarations/node";
import SolidityAntlr from "../parser/solidity_antlr";
import Pragma from "../declarations/pragma";
import Contract from '../declarations/contract';
import { IssueDetailed, IssuePointer } from "./issue";
import CFunction from "../declarations/cfunction";

class SolFile {
    file_name: string;
    subNodes: Node;
    pragma: Pragma;
    contracts_current: Contract[];
    contracts_imported: Contract[];
    issuePointers: IssuePointer[];

    constructor(file_name: string) {
        this.file_name = file_name;
        this.subNodes = SolidityAntlr.generateAST(file_name);
        this.pragma = SolidityAntlr.parsePragma(this.subNodes);
        this.contracts_current = SolidityAntlr.parseContracts(this.subNodes);
        this.contracts_imported = SolidityAntlr.parseImportedContracts(file_name, this.subNodes);
        this.issuePointers = [];
    }

    getContractFunctions(): CFunction[] {
        let f: CFunction[] = [];
        for (const c of this.contracts_current) {
            f.concat(c.functions);
        }
        return f;
    }

    addIssue(issue: IssuePointer) {
        this.issuePointers.push(issue);
    }

    addIssues(issues: IssuePointer[]) {
        this.issuePointers.concat(issues);
    }

}

export default SolFile;