const src_location = require("src-location");
import SolidityAntlr from "../parser/solidity_antlr";
import Pragma from "../declarations/pragma";
import Contract from "../declarations/contract";
import { IssueDetailed, IssuePointer } from "./issue";
import CFunction from "../declarations/function";
import logger from "../logger/logger";
import FileUtils from "../utils/file";
import Solc from "../parser/solc";
import Location from "../misc/location";
import NodeUtility from "../utils/node";
import NodeTypes from "../maru/node_types";
import Parameter from "../declarations/parameter";
import Node from "../misc/node";
import Variable from "../declarations/variable";
import Type from "../types/type";
import ElementaryType from "../types/elementary_type";
import ArrayType from "../types/array_type";
import UserDefinedType from "../types/user_defined_type";

class SolFile {
    file_name: string;
    file_content: string;
    antlrAST: any;
    nodes: any[];
    pragmas: Pragma[];
    contracts_current: Contract[];
    contracts_imported: Contract[];

    constructor(file_name: string) {
        this.file_name = file_name;
        this.file_content = FileUtils.getFileContent(file_name);
        this.antlrAST = SolidityAntlr.generateAST(file_name);
        this.nodes = Solc.walkAST(
            file_name,
            SolidityAntlr.getPragmaVersion(this.antlrAST),
            SolidityAntlr.parseAllImports(file_name, this.antlrAST)
        );
        this.pragmas = this.parsePragma();
        this.contracts_current = this.parseContracts();
        this.contracts_imported = [];
    }

    getContractFunctions(): CFunction[] {
        let f: CFunction[] = [];
        for (const c of this.contracts_current) {
            f = f.concat(c.functions);
        }
        return f;
    }

    getNode(id: number): any {
        for (const n of this.nodes) {
            if (id === n.id) {
                return n;
            }
        }
    }

    parseLocation(_id: any, src: any): Location {
        const id: number = parseInt(_id);
        const src_array: string[] = src.split(":");
        const index_start: number = parseInt(src_array[0]);
        const index_end: number = parseInt(src_array[1]);
        const start = src_location.indexToLocation(this.file_content, index_start);
        const end = src_location.indexToLocation(this.file_content, index_start + index_end);

        return new Location(id, src, start.line, end.line, start.column, end.column);
    }

    parsePragma(): Pragma[] {
        let pragma: Pragma[] = [];
        let filtered_nodes = Solc.filterNodes(this.nodes, NodeTypes.PragmaDirective);

        for (const node of filtered_nodes) {
            let part_one: string = node.attributes.literals[0];
            let part_two: string = "";
            for (let x = 1; node.attributes.literals.length > x; x++) {
                part_two += node.attributes.literals[x];
            }

            const location: Location = this.parseLocation(node.id, node.src);
            pragma.push(new Pragma(location, part_one, part_two));
        }

        return pragma;
    }

    parseContracts(): Contract[] {
        let contracts: Contract[] = [];
        let filtered_nodes = Solc.filterNodes(this.nodes, NodeTypes.ContractDefinition);

        for (const node of filtered_nodes) {
            const location = this.parseLocation(node.id, node.src);

            const name: string = node.attributes.name;
            const kind: string = node.attributes.contractKind;

            const linearizedBaseContracts: number[] = node.attributes.linearizedBaseContracts;
            // remove the contract itself from the linearizedBaseContracts array
            linearizedBaseContracts.shift();

            const scope: number = node.attributes.scope;
            const isImplemented: boolean = node.attributes.fullyImplemented;

            const functions: CFunction[] = this.parseFunction(node.id);

            contracts.push(new Contract(location, scope, name, kind, isImplemented, linearizedBaseContracts, functions));
        }

        return contracts;
    }

    parseFunction(id?: number): CFunction[] {
        let functions: CFunction[] = [];
        let filtered_nodes = Solc.filterNodes(this.nodes, NodeTypes.FunctionDefinition, id);

        for (const node of filtered_nodes) {
            const location: Location = this.parseLocation(node.id, node.src);
            const scope = node.attributes.scope;

            let name: string = node.attributes.name;
            const isConstructor: boolean = node.attributes.isConstructor;
            const visibility: string = node.attributes.visibility;
            let stateMutability: string = node.attributes.stateMutability;
            const isImplemented = node.attributes.implemented;

            // rename constructor consistenly
            if (isConstructor) {
                name = "constructor";
            }

            // stateMutability is null if it is not set specifically
            if (stateMutability === null) {
                stateMutability = "nonpayable";
            }

            const variables = this.parseVariables(node.id);
            const modifiers: any = node.attributes.modifiers;
            const function_parameters: Parameter[] = [];
            const return_parameters: Parameter[] = [];

            functions.push(
                new CFunction(
                    location,
                    scope,
                    name,
                    isConstructor,
                    visibility,
                    stateMutability,
                    isImplemented,
                    variables,
                    function_parameters,
                    return_parameters,
                    modifiers
                )
            );
        }

        return functions;
    }

    parseVariables(id?: number): Variable[] {
        let variables: Variable[] = [];
        let filtered_nodes = Solc.filterNodes(this.nodes, NodeTypes.VariableDeclaration, id);

        for (const node of filtered_nodes) {
            const location: Location = this.parseLocation(node.id, node.src);
            const scope: number = node.attributes.scope;
            const function_name: string = node.attributes.name;
            const type: string = node.attributes.type;
            const visibility: string = node.attributes.visibility;
            const storageLocation: string = node.attributes.storageLocation;
            const isStateVar: boolean = node.attributes.stateVariable;
            const isConstant: boolean = node.attributes.constant;

            variables.push(new Variable(location, scope, function_name, type, visibility, storageLocation, isStateVar, isConstant));
        }

        return variables;
    }

    parseType(node: any) {
        // implement me
    }
}

export default SolFile;
