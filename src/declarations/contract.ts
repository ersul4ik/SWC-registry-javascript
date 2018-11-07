import ASTElement from './ast_element';

class Contract extends ASTElement {
    name:string;
    subNodes:any;
    kind:string;
    baseContracts:any;

    constructor(name:string, subNodes:any, kind:string, baseContracts:any, loc:any, range:any){
        super(loc,range);
        this.name = name;
        this.subNodes = subNodes;
        this.kind = kind;
        this.baseContracts = baseContracts;
    }
    
}

export default Contract;

