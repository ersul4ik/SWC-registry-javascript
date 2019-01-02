const src_location = require("src-location");

import Contract from "../core/declarations/contract";
import CFunction from "../core/declarations/function";
import Pragma from "../core/declarations/pragma";
import SourceUnit from "../core/meta/source_unit";
import Variable from "../core/declarations/variable";
import BinaryOperation from "../core/expressions/binary_operation";
import FunctionCall from "../core/expressions/function_call";
import Identifier from "../core/expressions/identifier";
import IfStatement from "../core/expressions/if_statement";
import MemberAccess from "../core/expressions/member_access";
import UnaryOperation from "../core/expressions/unary_operation";
import NodeTypes from "../maru/node_types";
import Location from "../misc/location";
import Solc from "../parser/solc";
import SolidityAntlr from "../parser/solidity_antlr";
import FileUtils from "../utils/file";
import NodeUtility from "../utils/node";
import Modifier from "../core/declarations/modifier";
import logger from "../logger/logger";
import PlaceHolder from "../core/statements/placeholder";
import Source from "./source";
import Node from "../misc/node";

class SolFile {
    file_name: string;
    file_content: string;
    antlrAST: any;
    sources: Source[];
    contracts: Contract[];
    solc_compilation_output: any;

    constructor(file_name: string) {
        this.file_name = file_name;
        this.file_content = FileUtils.getFileContent(file_name);
        this.antlrAST = SolidityAntlr.generateAST(file_name);

        const version = SolidityAntlr.getPragmaVersion(this.antlrAST);
        this.solc_compilation_output = Solc.compile(file_name, version);
        this.sources = Solc.walkAST(this.solc_compilation_output, version);

        this.contracts = this.getContracts();
    }

    getContracts(): Contract[] {
        let contracts: Contract[] = [];
        for (const source of this.sources) {
            contracts = contracts.concat(source.parseContracts());
        }
        return contracts;
    }

    getFunctions(): CFunction[] {
        let functions: CFunction[] = [];
        for (const contract of this.contracts) {
            for (const cfunction of contract.functions) {
                functions.push(cfunction);
            }
        }
        return functions;
    }
}

export default SolFile;
