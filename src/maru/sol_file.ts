const src_location = require("src-location");

import Node from "../misc/node";
import SolidityAntlr from "../parser/solidity_antlr";
import Pragma from "../declarations/pragma";
import Contract from "../declarations/contract";
import { IssueDetailed, IssuePointer } from "./issue";
import CFunction from "../declarations/cfunction";
import logger from "../logger/logger";
import FileUtils from "../utils/file";
import Solc from "../parser/solc";
import Location from "../misc/location";
import StringUtility from "../utils/ast";
import NodeTypes from "../maru/node_types";

class SolFile {
    file_name: string;
    file_content: string;
    nodes: any[];
    block: Node;
    pragma: Pragma[];
    contracts_current: Contract[];
    contracts_imported: Contract[];

    constructor(file_name: string) {
        this.file_name = file_name;
        this.file_content = FileUtils.getFileContent(file_name);
        this.nodes = Solc.walkAST(file_name);
        this.block = new Node(SolidityAntlr.generateAST(file_name));
        this.pragma = this.parsePragma();
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

    parseLocation(src: any): Location {
        const src_array: string[] = src.split(":");
        const index_start: number = parseInt(src_array[0]);
        const index_end: number = parseInt(src_array[1]);
        const start = src_location.indexToLocation(this.file_content, index_start);
        const end = src_location.indexToLocation(this.file_content, index_start + index_end);

        return new Location(start.line, end.line, start.column, end.column, src);
    }

    parsePragma(): Pragma[] {
        let pragma: Pragma[] = [];
        let filtered_nodes = Solc.getNodeOfType(this.nodes, NodeTypes.PragmaDirective);

        for (const node of filtered_nodes) {
            let version = "";
            for (let x = 1; node.attributes.literals.length > x; x++) {
                version += node.attributes.literals[x];
            }

            const location: Location = this.parseLocation(node.src);
            pragma.push(new Pragma(location, node.attributes.literals[0], version));
        }

        return pragma;
    }

    parseContracts(): Contract[] {
        let contracts: Contract[] = [];
        let filtered_nodes = Solc.getNodeOfType(this.nodes, NodeTypes.ContractDefinition);

        for (const node of filtered_nodes) {
            const name: string = node.attributes.name;
            const kind: string = node.attributes.contractKind;
            const baseContracts: string[] = []; //SolidityAntlr.parseInheritance(node.baseContracts);
            const subNodes: Node = new Node("");
            const location = this.parseLocation(node.src);

            contracts.push(new Contract(location, name, kind, baseContracts, subNodes));
        }

        return contracts;
    }
}

export default SolFile;
