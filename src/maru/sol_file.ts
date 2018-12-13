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

    filterNodes(type?: string, id?: number): any[] {
        let filter_nodes_types: any[] = [];
        let filter_nodes_ids: any[] = [];

        // filter types
        for (const n of this.nodes) {
            if (type) {
                if (NodeUtility.matchString(n.name, type)) {
                    filter_nodes_types.push(n);
                }
            } else {
                filter_nodes_types.push(n);
            }
        }

        // filter ids
        for (const n of filter_nodes_types) {
            if (id) {
                if (NodeUtility.hasProperty(n.attributes, "scope") && id == n.attributes.scope) {
                    filter_nodes_ids.push(n);
                }
            } else {
                filter_nodes_ids.push(n);
            }
        }

        return filter_nodes_ids;
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
        let filtered_nodes = this.filterNodes(NodeTypes.PragmaDirective);

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
        let filtered_nodes = this.filterNodes(NodeTypes.ContractDefinition);

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
            const variables: Variable[] = this.parseVariables(node.id);

            contracts.push(new Contract(location, scope, name, kind, isImplemented, linearizedBaseContracts, functions, variables));
        }

        return contracts;
    }

    parseFunction(id?: number): CFunction[] {
        let functions: CFunction[] = [];
        let filtered_nodes = this.filterNodes(NodeTypes.FunctionDefinition, id);

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
            const function_parameters: Variable[] = this.parseParameters(variables);

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
                    modifiers
                )
            );
        }

        return functions;
    }

    parseVariables(id: number, variable_declarations?: any[]): Variable[] {
        let variables: Variable[] = [];
        let filtered_nodes: any[] = [];

        if (variable_declarations) {
            filtered_nodes = variable_declarations;
        } else {
            filtered_nodes = this.filterNodes(NodeTypes.VariableDeclaration, id);
        }

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

    parseParameters(variables: Variable[]): Variable[] {
        let parameters: Variable[] = [];

        for (const variable of variables) {
            if (this.isParent(variable.location.id, NodeTypes.ParameterList)) {
                parameters.push(variable);
            }
        }

        return parameters;
    }

    isParent(id: number, node_type: string): boolean {
        for (let x = 0; this.nodes.length; x++) {
            if (id === this.nodes[x].id) {
                let parts: any[] = this.nodes.slice(0, x);
                for (const p of parts) {
                    if (NodeUtility.matchString(p.name, node_type)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    parseType(node: any) {
        // implement me
    }
}

export default SolFile;
