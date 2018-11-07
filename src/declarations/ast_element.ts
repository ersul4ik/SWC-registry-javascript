class ASTElement {
    loc:any 
    range:any 
    
    constructor(loc:any, range:any){
        this.loc = loc;
        this.range = range;
    }
}

export default ASTElement;