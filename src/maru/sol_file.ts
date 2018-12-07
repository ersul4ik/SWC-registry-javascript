const src_location = require('src-location')

import Node from "../misc/node";
import SolidityAntlr from "../parser/solidity_antlr";
import Pragma from "../declarations/pragma";
import Contract from '../declarations/contract';
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
    pragma: Pragma;
    contracts_current: Contract[];
    contracts_imported: Contract[];

    constructor(file_name: string) {
        this.file_name = file_name;
        this.file_content = FileUtils.getFileContent(file_name);
        this.nodes = Solc.walkAST(file_name);
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

    parseLocation(src: any): Location {

        const src_array = src.split(":")
        const start = src_location.indexToLocation(this.file_content, src_array[0]);
        const end = src_location.indexToLocation(this.file_content, src_array[0] + src_array[1]);

        return new Location(
            start.line,
            start.column,
            end.line,
            end.column,
            src
        );
    }

    parsePragma(): Pragma {
        let pragma: any;
        for (const node of this.nodes) {
            if (StringUtility.matchString(node.name, NodeTypes.PragmaDirective)) {
                const location: Location = this.parseLocation(node.src);
                pragma = new Pragma(
                    location,
                    node.attributes.literals[0],
                    node.attributes.literals[1]
                );
            }
        }

        return pragma;

    }

    private static newMethod() {
        return this;
    }
}

export default SolFile;