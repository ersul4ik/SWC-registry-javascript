const parser = require("solidity-parser-antlr");
const path = require("path");

import Contract from '../declarations/contract'
import Import from '../declarations/import'
import Node from '../declarations/node'
import Location from '../declarations/location'
import CFunction from '../declarations/cfunction'
import Logger from '../logger/logger'
import Pragma from '../declarations/pragma';
import AstUtility from '../utils/ast';
import FileUtils from '../utils/file';
import StateVariable from '../declarations/state_variable';

class SolidityAntlr {

    static parseContracts(ast: Node): Contract[] {
        let contracts: Contract[] = [];
        parser.visit(ast, {
            ContractDefinition(node: any) {
                const name: string = node.name;
                const kind: string = node.kind;
                const baseContracts: string[] = SolidityAntlr.parseInheritance(node.baseContracts);
                const subNodes: Node = new Node(node.subNodes);
                const location = SolidityAntlr.parseLocation(node.loc, node.range)

                contracts.push(new Contract(name, kind, baseContracts, subNodes, location));

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
            imports_all.push(new Import(imp.path));
        }
        return imports_all;
    }

    // TODO: handle URLs 
    static parseImports(file_name: string, ast: any): Import[] {
        let imports: Import[] = [];
        parser.visit(ast, {
            ImportDirective(node: any) {
                let dir: string = path.dirname(file_name) + path.sep;
                let new_file_name = path.normalize(dir + node.path);
                imports.push(new Import(new_file_name));
            }
        });
        return imports;
    }

    static parsePragma(ast: any): Pragma {
        let pragma: any;
        parser.visit(ast, {
            PragmaDirective(node: any) {
                pragma = new Pragma(
                    node.name,
                    node.value
                );
            }
        });
        return pragma;

    }

    static parseInheritance(ast: any): string[] {
        let baseContracts: string[] = [];
        parser.visit(ast, {
            InheritanceSpecifier(node: any) {
                const name: string = node.baseName.namePath;
                baseContracts.push(name);
            }
        });
        return baseContracts;
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

    static parseCFunction(ast: any): CFunction[] {

        let functions: CFunction[] = [];
        parser.visit(ast, {
            FunctionDefinition(node: any) {

                let name: string = node.name;
                const parameters: any = node.parameters;
                const subNodes: Node = node.body;
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
                        subNodes,
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

    static parseStateVariableDeclaration(ast: any) {
        let vars: Node[] = [];

        parser.visit(ast, {
            StateVariableDeclaration(node: any) {
                vars.push(node)
            }
        });
        return SolidityAntlr.parseVariableDeclaration(vars);
    }

    static parseVariableDeclaration(ast: any) {
        let variables: StateVariable[] = [];
        parser.visit(ast, {
            VariableDeclaration(node: any) {
                const location: Location = SolidityAntlr.parseLocation(node.loc, node.range)

                variables.push(
                    new StateVariable(
                        node.name,
                        node.typeName.type,
                        node.expression,
                        node.visibility,
                        node.isStateVar,
                        node.isDeclaredConst,
                        location
                    )
                );
            }
        })
        return variables;
    }

    static generateAST(file_name: string): Node {
        const file_content = FileUtils.getFileContent(file_name);
        let ast;
        try {
            ast = parser.parse(file_content, { loc: true, range: true });
        } catch (e) {
            Logger.error("Exception during AST parsing for " + file_name);
            console.log(e);
        }
        return ast;
    }

}

export default SolidityAntlr;