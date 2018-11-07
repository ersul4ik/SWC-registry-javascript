const parser = require("solidity-parser-antlr");

import Contract from '../declarations/contract'
import Import from '../declarations/import'
import Node from '../declarations/node'

class SolidityAntlr {
    static parseContracts(ast:any): Contract[]{
        let contracts:Contract [] = [];
        parser.visit(ast, {
            ContractDefinition(node: any) { 
                const name:string = node.name;
                const kind:string = node.kind;
                const baseContracts:string[] = SolidityAntlr.parseInheritance(node.baseContracts);
                const subNodes:Node = new Node(node.subNodes);
                const loc:any = node.loc;
                const range:any = node.range;

                contracts.push(new Contract(name,kind,baseContracts,subNodes,loc,range));
             
            }
        });   
        return contracts; 
    }

    // TODO: hanlde URLs 
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

    

}

export default SolidityAntlr;