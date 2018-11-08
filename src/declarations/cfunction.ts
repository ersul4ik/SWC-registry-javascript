import Node from "./node";
import Location from "./location";

class CFunction {
    name:string;
    parameters:any;
    subNodes:Node;
    visibility:string;
    modifiers:any;
    isConstructor:boolean;
    stateMutability:string;
    location:Location;

    constructor (
        name:string, 
        parameters:any, 
        subNodes:Node, 
        visibility:string, 
        modifiers:any, 
        isConstructor:boolean, 
        stateMutability:string,
        location:Location
        ){
            this.name = name;
            this.parameters = parameters;
            this.subNodes = subNodes;
            this.visibility = visibility;
            this.modifiers = modifiers;
            this.isConstructor = isConstructor;
            this.stateMutability = stateMutability;
            this.location = location;
        }
}

export default CFunction;