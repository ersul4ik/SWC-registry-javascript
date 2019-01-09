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
import Node from "../misc/node";
import Throw from "../core/expressions/throw";
import Assignment from "../core/expressions/assignment";
import Type from "../core/types/type";
import ElementaryType from "../core/types/elementary_type";
import { type } from "os";
import ArrayType from "../core/types/array_type";
import UserDefinedType from "../core/types/user_defined_type";
import Mapping from "../core/types/mapping";
import InheritanceSpecifier from "../core/expressions/inheritance_specifier";

class Source {
    file_name: string;
    file_content: string;
    nodes: any[];
    source_unit: SourceUnit[];
    pragmas: Pragma[];

    constructor(file_name: string, nodes: any[]) {
        this.file_name = file_name;
        this.file_content = FileUtils.getFileContent(file_name);
        this.nodes = nodes;
        this.source_unit = this.parseSourceUnit();
        this.pragmas = this.parsePragma();
    }

    parsePragma(): Pragma[] {
        let pragma: Pragma[] = [];

        let filtered_nodes = this.getChildren(this.source_unit[0].id, NodeTypes.PragmaDirective);

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
                source_unit.push(new SourceUnit(n.id));
            }
        }
        return source_unit;
    }

    parseContracts(): Contract[] {
        let contracts: Contract[] = [];

        let filtered_nodes = this.getChildren(this.source_unit[0].id, NodeTypes.ContractDefinition);

        for (const node of filtered_nodes) {
            const location = this.parseLocation(node.id, node.src);

            const name: string = node.attributes.name;
            const kind: string = node.attributes.contractKind;

            const linearizedBaseContracts: number[] = node.attributes.linearizedBaseContracts;
            // remove the contract itself from the linearizedBaseContracts array
            linearizedBaseContracts.shift();
            const inheritedContracts: UserDefinedType[] = this.parseInheritanceSpecifier(node.id);

            const scope: number = node.attributes.scope;
            const isImplemented: boolean = node.attributes.fullyImplemented;

            const functions: CFunction[] = this.parseFunction(node.id);
            const state_variables: Variable[] = this.parseVariables(
                undefined,
                this.getScopedChildren(node.id, NodeTypes.VariableDeclaration)
            );

            contracts.push(
                new Contract(
                    location,
                    scope,
                    name,
                    kind,
                    isImplemented,
                    linearizedBaseContracts,
                    inheritedContracts,
                    functions,
                    state_variables
                )
            );
        }

        return contracts;
    }

    parseInheritanceSpecifier(id: number): UserDefinedType[] {
        let udt: UserDefinedType[] = [];
        let filtered_nodes = this.getChildren(id, NodeTypes.InheritanceSpecifier);

        for (const node of filtered_nodes) {
            const next_node: any = this.getRelativeNode(node.id, 1);
            const type: UserDefinedType = this.parseUserDefinedType(next_node);
            udt.push(type);
        }
        return udt.reverse();
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
            const isImplemented: boolean = node.attributes.implemented;
            const constant: boolean = node.attributes.constant;

            // rename constructor consistenly
            if (isConstructor) {
                name = "constructor";
            }

            // stateMutability is null if it is not set specifically
            if (stateMutability === null) {
                stateMutability = "nonpayable";
            } else if (constant) {
                stateMutability = "constant";
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

    /*
     * Todo: This parsing function is fairly hackish. Fix it.
     */

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

            let identifier_name: string = "";
            let identifier_type: string = "";
            let member_name1: string = "";
            let member_type1: string = "";
            let member_name2: string = "";
            let member_type2: string = "";
            let member_count: number = 0;

            for (let position = 1; position <= 3; position++) {
                const next_node: any = this.getRelativeNode(node.id, position);
                const identifiers: Identifier[] = this.parseIdentifiers(undefined, [next_node.id]);
                const member_access: MemberAccess[] = this.parseMemberAccess(undefined, [next_node.id]);

                if (identifiers.length > 0) {
                    identifier_name = identifiers[0].name;
                    identifier_type = identifiers[0].type;
                    break;
                } else if (member_access.length > 0) {
                    if (member_count == 0) {
                        member_name1 = member_access[0].member_name;
                        member_type1 = member_access[0].type;
                        member_count++;
                    } else if (member_count == 1) {
                        member_name2 = member_access[0].member_name;
                        member_type2 = member_access[0].type;
                    }
                } else {
                    break;
                }
            }

            function_calls.push(
                new FunctionCall(location, identifier_name, identifier_type, member_name1, member_type1, member_name2, member_type2)
            );
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
            const type: Type = this.parseType(node.id);
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

    parseIdentifiers(parent_id?: number, selected_ids?: number[]): Identifier[] {
        let identifiers: Identifier[] = [];
        let filtered_nodes: any[] = [];

        if (parent_id) {
            filtered_nodes = this.getChildren(parent_id, NodeTypes.Identifier);
        } else if (selected_ids) {
            for (const selected_id of selected_ids) {
                const node: any = this.getNode(selected_id);
                if (NodeUtility.matchString(node.name, NodeTypes.Identifier)) {
                    filtered_nodes.push(node);
                }
            }
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

    parseMemberAccess(parent_id?: number, selected_ids?: number[]): MemberAccess[] {
        let memberAccess: MemberAccess[] = [];
        let filtered_nodes: any[] = [];

        if (parent_id) {
            filtered_nodes = this.getChildren(parent_id, NodeTypes.MemberAccess);
        } else if (selected_ids) {
            for (const selected_id of selected_ids) {
                const node: any = this.getNode(selected_id);
                if (NodeUtility.matchString(node.name, NodeTypes.MemberAccess)) {
                    filtered_nodes.push(node);
                }
            }
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

    parseAssignment(id: number): Assignment[] {
        let uo: Assignment[] = [];
        let filtered_nodes: any[] = [];

        filtered_nodes = this.getChildren(id, NodeTypes.Assignment);

        for (const node of filtered_nodes) {
            const location: Location = this.parseLocation(node.id, node.src);
            const operator: string = node.attributes.operator;
            const type: string = node.attributes.type;
            const isPure: boolean = node.attributes.isPure;

            uo.push(new Assignment(location, operator, type, isPure));
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

    parseThrow(id: number): Throw[] {
        let th: Throw[] = [];
        let filtered_nodes: any[] = [];

        filtered_nodes = this.getChildren(id, NodeTypes.Throw);

        for (const node of filtered_nodes) {
            const location: Location = this.parseLocation(node.id, node.src);

            th.push(new Throw(location));
        }

        return th;
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

    parseLocation(_id: any, src: any): Location {
        const id: number = parseInt(_id);
        const src_array: string[] = src.split(":");
        const index_start: number = parseInt(src_array[0]);
        const index_end: number = parseInt(src_array[1]);
        const start = src_location.indexToLocation(this.file_content, index_start);
        const end = src_location.indexToLocation(this.file_content, index_start + index_end);

        return new Location(id, this.file_name, src, start.line, end.line, start.column, end.column);
    }

    parseType(id: number): Type {
        let type: Type;

        const next_node: any = this.getRelativeNode(id, 1);
        const next_next_node: any = this.getRelativeNode(id, 2);

        if (NodeUtility.matchString(next_node.name, NodeTypes.ElementaryTypeName)) {
            type = this.parseElementaryType(next_node);
        } else if (NodeUtility.matchString(next_node.name, NodeTypes.UserDefinedTypeName)) {
            type = this.parseUserDefinedType(next_node);
        } else if (NodeUtility.matchString(next_node.name, NodeTypes.ArrayTypeName)) {
            type = this.parseArrayType(next_node);
        } else if (NodeUtility.matchString(next_node.name, NodeTypes.Mapping)) {
            type = this.parseMapping(next_node, next_next_node);
        } else {
            const location: Location = this.parseLocation(next_node.id, next_node.src);
            const dummy: Type = new Type(location);
            return dummy;
        }

        return type;
    }

    parseElementaryType(node: any): ElementaryType {
        const location: Location = this.parseLocation(node.id, node.src);
        const type: string = node.attributes.type;
        return new ElementaryType(location, type);
    }

    parseUserDefinedType(node: any): UserDefinedType {
        const location: Location = this.parseLocation(node.id, node.src);
        const type: string = node.attributes.name;
        const referencedDeclaration: number = node.attributes.referencedDeclaration;

        return new UserDefinedType(location, type, referencedDeclaration);
    }

    parseArrayType(node: any): ArrayType {
        const location_node: Location = this.parseLocation(node.id, node.src);

        let length: string = "null";

        if (NodeUtility.hasProperty(node.attributes.length, "number")) {
            length = node.attributes.length;
        }

        return new ArrayType(location_node, this.parseType(node.id), length);
    }

    parseMapping(node: any, next_node: any): Mapping {
        const location_node: Location = this.parseLocation(node.id, node.src);
        const key: ElementaryType = this.parseElementaryType(next_node);
        const value: Type = this.parseType(next_node.id);
        return new Mapping(location_node, key, value);
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

    getNode(id: number): any {
        for (const n of this.nodes) {
            if (id === n.id) {
                return n;
            }
        }
    }

    getRelativeNode(id: number, offset: number): any {
        for (let x = 0; this.nodes.length > x; x++) {
            if (id === this.nodes[x].id) {
                return this.nodes[x + offset];
            }
        }
    }

    printNodes() {
        for (let x = 0; this.nodes.length > x; x++) {
            NodeUtility.printNode(this.nodes[x].id + " - " + this.nodes[x].name);
        }
    }

    isInternalReferencedIdentifier(node: any, source_unit_id: number): boolean {
        if (NodeUtility.hasProperty(node.attributes, "referencedDeclaration")) {
            if (node.attributes.referencedDeclaration > source_unit_id) {
                return true;
            }
        }
        return false;
    }

    getInternalReferencedIdentifiers(): any[] {
        let su: SourceUnit[] = this.parseSourceUnit();
        let external_references: any[] = [];

        for (const n of this.nodes) {
            if (this.isInternalReferencedIdentifier(n, su[0].id)) {
                external_references.push(n);
            }
        }
        return external_references;
    }
}

export default Source;
