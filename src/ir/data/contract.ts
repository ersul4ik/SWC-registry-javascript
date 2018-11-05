class Contract {
    name:string;
    subNodes:any;
    kind:string;
    baseContracts:any;

    constructor(name:string, subNodes:any, kind:string, baseContracts:any ){
        this.name = name;
        this.subNodes = subNodes;
        this.kind = kind;
        this.baseContracts = baseContracts;
    }

    
}