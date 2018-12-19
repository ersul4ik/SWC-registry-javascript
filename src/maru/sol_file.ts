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

class SolFile {
    file_name: string;
    file_content: string;
    antlrAST: any;
    nodes: any[];
    pragmas: Pragma[];
    source_unit: SourceUnit[];
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
        this.source_unit = this.parseSourceUnit();
        this.contracts_current = this.parseContracts();
        this.contracts_imported = [];
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
        let filtered_nodes = this.getChildren(this.nodes.length, NodeTypes.PragmaDirective);

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

    parseSourceUnit(): SourceUnit[] {
        let source_unit: SourceUnit[] = [];
        for (const n of this.nodes) {
            if (NodeUtility.matchString(n.name, NodeTypes.SourceUnit)) {
                source_unit.push(new SourceUnit(n.id, n.attributes.absolutePath));
            }
        }
        return source_unit;
    }

    parseContracts(id?: number): Contract[] {
        let contracts: Contract[] = [];

        let filtered_nodes = this.getChildren(this.source_unit[0].id, NodeTypes.ContractDefinition);

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
            const variables: Variable[] = this.parseVariables(undefined, this.getScopedChildren(node.id, NodeTypes.VariableDeclaration));

            contracts.push(new Contract(location, scope, name, kind, isImplemented, linearizedBaseContracts, functions, variables));
        }

        return contracts;
    }

    parseFunction(id?: number): CFunction[] {
        let functions: CFunction[] = [];
        let filtered_nodes: any[] = [];

        if (id) {
            filtered_nodes = this.getChildren(id, NodeTypes.FunctionDefinition);
        } else {
            filtered_nodes = this.getChildren(this.source_unit[0].id, NodeTypes.FunctionDefinition);
        }

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

    parseModifier(id?: number): Modifier[] {
        let modifiers: Modifier[] = [];
        let filtered_nodes: any[] = [];

        if (id) {
            filtered_nodes = this.getChildren(id, NodeTypes.ModifierDefinition);
        } else {
            filtered_nodes = this.getChildren(this.source_unit[0].id, NodeTypes.ModifierDefinition);
        }

        for (const node of filtered_nodes) {
            const location: Location = this.parseLocation(node.id, node.src);

            const name: string = node.attributes.name;
            const visibility: string = node.attributes.visibility;

            const variables = this.parseVariables(node.id);
            const function_parameters: Variable[] = this.parseParameters(variables);

            const c: any[] = this.getParents(node.id, NodeTypes.ContractDefinition);

            // set the default scope to SourceUnit
            let scope: number = this.parseSourceUnit()[0].id;

            if (c.length != 1) {
                logger.error("Unexpected result when parsing contracts to get the scope for a modifier");
            } else {
                scope = c[0].id;
            }

            modifiers.push(new Modifier(location, scope, name, visibility, variables, function_parameters));
        }

        return modifiers;
    }

    parseFunctionCalls(id?: number): FunctionCall[] {
        let function_calls: FunctionCall[] = [];
        let filtered_nodes: any[] = [];

        if (id) {
            filtered_nodes = this.getChildren(id, NodeTypes.FunctionCall);
        } else {
            filtered_nodes = this.getChildren(this.source_unit[0].id, NodeTypes.FunctionCall);
        }

        for (const node of filtered_nodes) {
            const location: Location = this.parseLocation(node.id, node.src);
            const member_access: MemberAccess[] = this.parseMemberAccess(node.id);
            const identifier: Identifier[] = this.parseIdentifiers(node.id);

            if (identifier.length !== 0) {
                let identifier_name: string = identifier[0].name;
                let identifier_type: string = identifier[0].type;
                let member_name: string = "";
                let member_type: string = "";

                if (member_access.length !== 0) {
                    member_name = member_access[0].member_name;
                    member_type = member_access[0].type;
                }
                function_calls.push(new FunctionCall(location, identifier_name, identifier_type, member_name, member_type));
            }
        }

        return function_calls;
    }

    parseVariables(id?: number, variable_declarations?: any[]): Variable[] {
        let variables: Variable[] = [];
        let filtered_nodes: any[] = [];

        if (variable_declarations) {
            filtered_nodes = variable_declarations;
        } else if (id) {
            filtered_nodes = this.getChildren(id, NodeTypes.VariableDeclaration);
        } else {
            filtered_nodes = this.getChildren(this.source_unit[0].id, NodeTypes.VariableDeclaration);
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
            if (this.hasParent(variable.location.id, NodeTypes.ParameterList)) {
                parameters.push(variable);
            }
        }

        return parameters;
    }

    parseIdentifiers(id?: number): Identifier[] {
        let identifiers: Identifier[] = [];
        let filtered_nodes: any[] = [];

        if (id) {
            filtered_nodes = this.getChildren(id, NodeTypes.Identifier);
        } else {
            filtered_nodes = this.getChildren(this.source_unit[0].id, NodeTypes.Identifier);
        }

        for (const node of filtered_nodes) {
            const location: Location = this.parseLocation(node.id, node.src);
            const name: string = node.attributes.value;
            const type: string = node.attributes.type;

            let referencedDeclaration: number = -1;

            if (!isNaN(node.attributes.referencedDeclaration)) {
                referencedDeclaration = node.attributes.referencedDeclaration;
            }

            identifiers.push(new Identifier(location, name, type, referencedDeclaration));
        }

        return identifiers;
    }

    parseMemberAccess(id?: number): MemberAccess[] {
        let memberAccess: MemberAccess[] = [];

        let filtered_nodes: any[] = [];

        if (id) {
            filtered_nodes = this.getChildren(id, NodeTypes.MemberAccess);
        } else {
            filtered_nodes = this.getChildren(this.source_unit[0].id, NodeTypes.MemberAccess);
        }

        for (const node of filtered_nodes) {
            const location: Location = this.parseLocation(node.id, node.src);
            const member_name: string = node.attributes.member_name;
            const type: string = node.attributes.type;

            memberAccess.push(new MemberAccess(location, member_name, type));
        }

        return memberAccess;
    }

    parseBinaryOperation(id: number): BinaryOperation[] {
        let bo: BinaryOperation[] = [];
        let filtered_nodes: any[] = [];

        filtered_nodes = this.getChildren(id, NodeTypes.BinaryOperation);

        for (const node of filtered_nodes) {
            const location: Location = this.parseLocation(node.id, node.src);
            const operator: string = node.attributes.operator;
            const type: string = node.attributes.type;
            const isPure: boolean = node.attributes.isPure;

            bo.push(new BinaryOperation(location, operator, type, isPure));
        }

        return bo;
    }

    parseUnaryOperation(id: number): UnaryOperation[] {
        let uo: UnaryOperation[] = [];
        let filtered_nodes: any[] = [];

        filtered_nodes = this.getChildren(id, NodeTypes.UnaryOperation);

        for (const node of filtered_nodes) {
            const location: Location = this.parseLocation(node.id, node.src);
            const operator: string = node.attributes.operator;
            const type: string = node.attributes.type;
            const isPure: boolean = node.attributes.isPure;

            uo.push(new UnaryOperation(location, operator, type, isPure));
        }

        return uo;
    }

    parsePlaceHolder(id: number): PlaceHolder[] {
        let ph: PlaceHolder[] = [];
        let filtered_nodes: any[] = [];

        filtered_nodes = this.getChildren(id, NodeTypes.PlaceholderStatement);

        for (const node of filtered_nodes) {
            const location: Location = this.parseLocation(node.id, node.src);

            ph.push(new PlaceHolder(location));
        }

        return ph;
    }

    parseIfStatement(id: number): IfStatement[] {
        let if_s: IfStatement[] = [];
        let filtered_nodes: any[] = [];

        filtered_nodes = this.getChildren(id, NodeTypes.IfStatement);

        for (const node of filtered_nodes) {
            const location: Location = this.parseLocation(node.id, node.src);

            if_s.push(new IfStatement(location));
        }

        return if_s;
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

    printNodes() {
        for (const n of this.nodes) {
            NodeUtility.printNode(n.id + " - " + n.name);
        }
    }

    getInternalReferencedIdentifiers(): any[] {
        let su: SourceUnit[] = this.parseSourceUnit();
        let external_references: any[] = [];

        for (const n of this.nodes) {
            if (NodeUtility.hasProperty(n.attributes, "referencedDeclaration") && n.attributes.referencedDeclaration > su[0].id) {
                external_references.push(n);
            }
        }
        return external_references;
    }

    /*
     * Check if a node has a parent node of a particular type
     */
    hasParent(id: number, node_type: string): boolean {
        for (let x = 0; x < this.nodes.length; x++) {
            if (id === this.nodes[x].id) {
                let parts: any[] = this.nodes.slice(0, x);
                for (const p of parts.reverse()) {
                    // if that's the case then we have found a parent
                    if (id < p.id) {
                        // NodeUtility.printNode(p.id + " - " + p.name);
                        if (NodeUtility.matchString(p.name, node_type)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    getScopedChildren(id: number, type?: string): any[] {
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

    /*
     * Get all parent nodes of a particular node
     */
    getParents(id: number, node_type?: string): any[] {
        let parents: any[] = [];
        for (let x = 0; x < this.nodes.length; x++) {
            if (id === this.nodes[x].id) {
                let parts: any[] = this.nodes.slice(0, x);
                for (const p of parts.reverse()) {
                    if (id < p.id) {
                        if (node_type) {
                            if (NodeUtility.matchString(node_type, p.name)) {
                                parents.push(p);
                            }
                        } else {
                            parents.push(p);
                        }
                    }
                }
            }
        }
        return parents;
    }

    /*
     * Get all child nodes of a particular node
     */
    getChildren(id: number, node_type?: string): any[] {
        let children: any[] = [];
        let start_i: number = -1;

        for (let x = 0; x < this.nodes.length; x++) {
            if (id === this.nodes[x].id) {
                start_i = x;
            } else if (start_i >= 0) {
                if (this.nodes[x].id > id) {
                    return children;
                } else {
                    if (node_type) {
                        if (NodeUtility.matchString(node_type, this.nodes[x].name)) {
                            children.push(this.nodes[x]);
                        }
                    } else {
                        children.push(this.nodes[x]);
                    }
                }
            }
        }

        return children;
    }

    parseType(node: any) {
        // implement me
    }
}

export default SolFile;
