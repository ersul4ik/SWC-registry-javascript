const parser = require("solidity-parser-antlr");
const path = require("path");

import CFunction from '../declarations/cfunction';
import Contract from '../declarations/contract';
import Import from '../declarations/import';
import Location from '../misc/location';
import Node from '../misc/node';
import Pragma from '../declarations/pragma';
import Variable from '../declarations/variable';
import Identifier from '../expressions/identifier';
import ElementaryType from '../types/elementary_type';
import Logger from '../logger/logger';
import FileUtils from '../utils/file';
import Type from '../types/type';
import AstUtility from '../utils/ast';
import ArrayType from '../types/array_type';
import UserDefinedType from '../types/user_defined_type';
import FunctionCall from '../expressions/function_call';
import MemberAccess from '../expressions/member_access';
import Throw from '../expressions/throw';
import BinaryOperation from '../expressions/binary_operation';

class SolidityAntlr {

    static parseContracts(parent_node: Node): Contract[] {
        let contracts: Contract[] = [];
        parser.visit(parent_node.branch, {
            ContractDefinition(node: any) {

                const name: string = node.name;
                const kind: string = node.kind;
                const baseContracts: string[] = SolidityAntlr.parseInheritance(node.baseContracts);
                const subNodes: Node = new Node(node.subNodes);
                const location = SolidityAntlr.parseLocation(node.loc, node.range)

                contracts.push(
                    new Contract(
                        name,
                        kind,
                        baseContracts,
                        subNodes,
                        location
                    )
                );

            }
        });
        return contracts;
    }

    static parseImportedContracts(file_name: string, subNodes: Node): Contract[] {
        let imports: Import[] = SolidityAntlr.parseAllImports(file_name, subNodes);
        let imported_contracts: Contract[] = [];

        for (const i of imports) {
            const subNodes = SolidityAntlr.generateAST(i.path);
            imported_contracts.concat(SolidityAntlr.parseContracts(subNodes));
        }
        return imported_contracts;
    }

    static parseAllImports(file_name: string, ast: any): Import[] {
        file_name = path.normalize(file_name)
        let imports_all: Import[] = [];
        let imports_work: Import[] = SolidityAntlr.parseImports(file_name, ast)

        while (imports_work.length != 0) {
            let imp: any = imports_work.pop();
            let _ast = SolidityAntlr.generateAST(imp.path);
            let _imports: Import[] = SolidityAntlr.parseImports(imp.path, _ast);

            for (let i = imports_all.length - 1; i >= 0; i--) {
                for (let j = _imports.length - 1; j >= 0; j--) {
                    if (imports_all[i].path === _imports[j].path || file_name === _imports[j].path) {
                        _imports.splice(j, 1)
                    }
                }
            }

            imports_work = imports_work.concat(_imports);
            imports_all.push(new Import(imp.location, imp.path));
        }
        return imports_all;
    }

    // TODO: handle URLs 
    static parseImports(file_name: string, ast: any): Import[] {
        let imports: Import[] = [];
        parser.visit(ast, {
            ImportDirective(node: any) {
                const location: Location = SolidityAntlr.parseLocation(node.loc, node.range);
                let dir: string = path.dirname(file_name) + path.sep;
                let new_file_name = path.normalize(dir + node.path);
                imports.push(new Import(location, new_file_name));
            }
        });
        return imports;
    }

    static parsePragma(parent_node: Node): Pragma {
        let pragma: any;
        parser.visit(parent_node.branch, {
            PragmaDirective(node: any) {
                const location: Location = SolidityAntlr.parseLocation(node.loc, node.range);
                pragma = new Pragma(
                    location,
                    node.name,
                    node.value
                );
            }
        });
        return pragma;

    }

    static parseInheritance(parent_node: any): string[] {
        let baseContracts: string[] = [];
        parser.visit(parent_node, {
            InheritanceSpecifier(node: any) {
                const name: string = node.baseName.namePath;
                baseContracts.push(name);
            }
        });
        return baseContracts;
    }

    static parseIdentifiers(parent_node: Node): Identifier[] {
        let identifiers: Identifier[] = [];
        parser.visit(parent_node.branch, {
            Identifier(node: any) {
                const location: Location = SolidityAntlr.parseLocation(node.loc, node.range);
                identifiers.push(
                    new Identifier(
                        node.name,
                        location
                    )
                );
            }
        });
        return identifiers;
    }

    static parseBinaryOperation(parent_node: any): BinaryOperation[] {
        let bop: BinaryOperation[] = [];
        parser.visit(parent_node.branch, {
            BinaryOperation(node: any) {
                const location: Location = SolidityAntlr.parseLocation(node.loc, node.range);
                bop.push(
                    new BinaryOperation(
                        location,
                        node.operator,
                        new Node(node.left),
                        new Node(node.right)
                    )
                )
            }
        });
        return bop;
    }

    static parseMemberAccess(parent_node: Node): MemberAccess[] {
        let memberAccess: MemberAccess[] = [];

        parser.visit(parent_node.branch, {
            MemberAccess(node: any) {
                const location: Location = SolidityAntlr.parseLocation(node.loc, node.range);
                memberAccess.push(
                    new MemberAccess(
                        location,
                        node.memberName,
                        new Node(node.expression)
                    )
                )
            }
        });
        return memberAccess;
    }

    static parseThrowStatements(parent_node: Node): Throw[] {
        let _throw: Throw[] = [];

        parser.visit(parent_node.branch, {
            ThrowStatement(node: any) {
                const location: Location = SolidityAntlr.parseLocation(node.loc, node.range);
                _throw.push(
                    new Throw(location)
                )
            }
        });
        return _throw;
    }

    static parseLocation(loc: any, range: any): Location {
        const r_start: number = range[0];
        const r_end: number = range[1];
        let src_2: number = r_end - r_start + 1;
        let src = `${r_start}:${src_2}:0`

        return new Location(
            loc.start.line,
            loc.end.line,
            loc.start.column,
            loc.end.column,
            src
        );
    }

    // TODO: Need to parse nested expressions 
    static parseFunctionCalls(parent_node: Node): FunctionCall[] {
        let function_calls: FunctionCall[] = [];

        parser.visit(parent_node.branch, {
            FunctionCall(node: any) {
                const location: Location = SolidityAntlr.parseLocation(node.loc, node.range);
                const expression: Node = new Node(node.expression);
                const args: Node = new Node(node.arguments);
                const member_access: MemberAccess[] = SolidityAntlr.parseMemberAccess(expression);
                const identifier: Identifier[] = SolidityAntlr.parseIdentifiers(expression);

                if (identifier.length !== 0) {
                    let f_name: string = identifier[0].name;
                    if (member_access.length !== 0) {
                        f_name = `${f_name}.${member_access[0].name}`
                    }
                    function_calls.push(
                        new FunctionCall(
                            location,
                            f_name,
                            expression,
                            args,
                            "TODO"
                        )
                    );
                }

            }
        });

        return function_calls;

    }

    static parseCFunction(parent_node: Node): CFunction[] {

        let functions: CFunction[] = [];
        parser.visit(parent_node.branch, {
            FunctionDefinition(node: any) {
                let name: string = node.name;
                const parameters: any = node.parameters;
                const block: Node = new Node(node.body);
                const visibility: string = node.visibility;
                const modifiers: any = node.modifiers;
                const isConstructor: boolean = node.isConstructor;
                let stateMutability: string = node.stateMutability
                const location: Location = SolidityAntlr.parseLocation(node.loc, node.range)

                // rename constructor consistenly 
                if (isConstructor) { name = "constructor"; }

                // stateMutability is null if it is not set specifically 
                if (stateMutability === null) { stateMutability = "nonpayable" }

                functions.push(
                    new CFunction(
                        name,
                        parameters,
                        block,
                        visibility,
                        modifiers,
                        isConstructor,
                        stateMutability,
                        location
                    )
                );
            }
        });

        return functions;
    }

    static parseType(node: any) {
        let type: any;
        const location: Location = SolidityAntlr.parseLocation(node.loc, node.range)

        if (AstUtility.matchString(node.type, "ElementaryTypeName")) {
            return new ElementaryType(
                location,
                node.name
            )
        } else if (AstUtility.matchString(node.type, "ArrayTypeName")) {
            let length: string = "null"

            if (AstUtility.hasProperty(node.length, "number")) {
                length = node.length.number;
            }

            if (AstUtility.matchString(node.baseTypeName.type, "ElementaryTypeName")) {
                return new ArrayType(
                    location,
                    new ElementaryType(
                        location,
                        node.baseTypeName.name,
                    ),
                    length
                )
            } else if (AstUtility.matchString(node.baseTypeName.type, "UserDefinedTypeName")) {
                return new ArrayType(
                    location,
                    new UserDefinedType(
                        location,
                        node.baseTypeName.namePath,
                    ),
                    length
                )
            } else {
                Logger.error("Array type not recognised at")
            }

        } else if (AstUtility.matchString(node.type, "UserDefinedTypeName")) {
            return new UserDefinedType(
                location,
                node.namePath
            )
        }
        return type;
    }

    static parseVariables(parent_node: Node): Variable[] {

        let var_declarations: any[] = [];
        parser.visit(parent_node.branch, {
            VariableDeclarationStatement(node: any) {
                var_declarations.push(
                    {
                        "variables": node.variables,
                        "initialValue": node.initialValue
                    }
                );
            }
        });

        parser.visit(parent_node.branch, {
            StateVariableDeclaration(node: any) {
                var_declarations.push(
                    {
                        "variables": node.variables,
                        "initialValue": node.initialValue
                    }
                );
            }
        });

        let variables: Variable[] = [];
        for (const var_declaration of var_declarations) {
            parser.visit(var_declaration.variables, {
                VariableDeclaration(node: any) {
                    const location: Location = SolidityAntlr.parseLocation(node.loc, node.range)
                    const type: Type = SolidityAntlr.parseType(node.typeName)

                    variables.push(
                        new Variable(
                            location,
                            node.name,
                            type,
                            node.expression,
                            var_declaration.initialValue,
                            node.visibility,
                            node.isStateVar,
                            node.isDeclaredConst,
                            node.storageLocation
                        )
                    );
                }
            })
        }

        return variables;
    }

    static generateAST(file_name: string): Node {
        const file_content = FileUtils.getFileContent(file_name);
        let ast;
        try {
            ast = parser.parse(file_content, { loc: true, range: true });
        } catch (e) {
            Logger.error("Exception during AST parsing for " + file_name);
            Logger.error(e);
        }
        return ast;
    }

}

export default SolidityAntlr;