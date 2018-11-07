import Location from './location';
import Node from './node';

class Contract extends Location {
    name:string;
    subNodes:Node; 
    kind:string;
    baseContracts:string[];

    constructor(name:string,  kind:string, baseContracts:string[], subNodes:Node, loc:any, range:any){
        super(loc,range);
        this.name = name;
        this.kind = kind;
        this.baseContracts = baseContracts;
        this.subNodes = subNodes;
    }
    
}

export default Contract;

