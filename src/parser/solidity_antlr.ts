const parser = require("solidity-parser-antlr");
const path = require("path");

import Contract from '../declarations/contract'
import Import from '../declarations/import'
import Node from '../declarations/node'
import Location from '../declarations/location'
import CFunction from '../declarations/cfunction'
import SolFile from '../maru/sol_file';
import Logger from '../logger/logger'
import Pragma from '../declarations/pragma';
import AstUtility from '../utils/ast';
import FileUtils from '../utils/file';

class SolidityAntlr {

    static parseSolFile(file_name:string){
        const ast = SolidityAntlr.generateAST(file_name);

        const pragma:Pragma = SolidityAntlr.parsePragma(ast);
        const constracts_current:Contract[] = SolidityAntlr.parseContracts(ast);
        const imports:Import[] = SolidityAntlr.parseImports(ast);

        for (const i of imports){
        }   
    }

    static parseContracts(ast:any): Contract[]{
        let contracts:Contract [] = [];
        parser.visit(ast, {
            ContractDefinition(node: any) { 
                const name:string = node.name;
                const kind:string = node.kind;
                const baseContracts:string[] = SolidityAntlr.parseInheritance(node.baseContracts);
                const subNodes:Node = new Node(node.subNodes);
                const location = SolidityAntlr.parseLocation(node.loc,node.range)

                contracts.push(new Contract(name,kind,baseContracts,subNodes,location));
             
            }
        });   
        return contracts; 
    }

    // TODO: FIX me, I am going into an endless loop 
    static parseAllImports(ast:any, file_name:string){
        let imports_all:Import[] = [];
        let imports_work:Import [] = SolidityAntlr.parseImports(ast)
        let dir:string = path.dirname(file_name);

        while (imports_work.length != 0){
            let imp:any = imports_work.pop();
            file_name = path.resolve(dir, imp.path)
            dir = path.dirname(file_name);

            let _ast = SolidityAntlr.generateAST(file_name);
            let _imports:Import [] = SolidityAntlr.parseImports(_ast)
        
            imports_work = imports_work.concat(_imports);
            imports_all.push(new Import(file_name));
        }
        console.log(imports_all)
    }

    // TODO: handle URLs 
    // TODO: Imports in Imports
    static parseImports(ast:any): Import[] {
        let imports:Import [] = [];
        parser.visit(ast, {
            ImportDirective(node: any) { 
                const path:string = node.path;
                imports.push(new Import(path));  
            }
        }); 
        return imports;
    }    

    static parsePragma(ast:any):Pragma {
        let pragma:any;
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

    static parseInheritance(ast:any): string[] {
        let baseContracts:string [] = [];
        parser.visit(ast, {
            InheritanceSpecifier(node: any) { 
                const name:string = node.baseName.namePath;
                baseContracts.push(name);  
            }
        }); 
        return baseContracts;
    }  

    static parseLocation(loc:any, range:any): Location {
        const r_start:number = range[0];
        const r_end:number = range[1];
        let src_2:number = r_end - r_start + 1;
        let src = `${r_start}:${src_2}:0`

        return new Location (
            loc.start.line,
            loc.end.line,
            loc.start.column,
            loc.end.column,
            src
        );
    }

    static parseCFunction(ast:any): CFunction[] {

        let functions:CFunction [] = [];
        parser.visit(ast, {
            FunctionDefinition(node: any) { 

                let name:string  = node.name;
                const parameters:any = node.parameters;
                const subNodes:Node = node.body;
                const visibility:string = node.visibility;
                const modifiers:any  = node.modifiers;
                const isConstructor:boolean = node.isConstructor;
                let stateMutability:string  = node.stateMutability
                const location:Location = SolidityAntlr.parseLocation(node.loc, node.range)

                // rename constructor consistenly 
                if (isConstructor) {name = "constructor";}

                // stateMutability is null if it is not set specifically 
                if (stateMutability === null) {stateMutability = "nonpayable"}

                functions.push(
                    new CFunction (
                        name,
                        parameters,
                        subNodes,
                        visibility,
                        modifiers,
                        isConstructor,
                        stateMutability,
                        location
                    )
                ) ;
            }
        });    

        return functions;
    }

    static generateAST(file_name:string){
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