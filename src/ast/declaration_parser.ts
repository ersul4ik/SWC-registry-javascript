const parser = require("solidity-parser-antlr");

import Contract from '../declarations/contract'

class ASTDeclarationParser {
    static parseContracts(ast:any): Contract[]{
        let contracts:Contract [] = [];
        parser.visit(ast, {
            ContractDefinition(node: any) { 
                const name:string = node.name;
                const subNodes:any = node.subNodes;
                const kind:string = node.kind;
                const baseContracts:string = node.baseContracts;
                const loc:any = node.loc;
                const range:any = node.range;

                contracts.push(new Contract(name,subNodes,kind,baseContracts,loc,range));
             
            }
        });   
        return contracts; 
    }
}

export default ASTDeclarationParser;