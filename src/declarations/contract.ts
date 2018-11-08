import Location from './location';
import Node from './node';

class Contract {
    name:string;
    subNodes:Node; 
    kind:string;
    baseContracts:string[];
    location:Location;

    constructor(
        name:string, 
        kind:string, 
        baseContracts:string[], 
        subNodes:Node, 
        location:Location
        ){
            this.name = name;
            this.kind = kind;
            this.baseContracts = baseContracts;
            this.subNodes = subNodes;
            this.location = location;
    }
    
}

export default Contract;

