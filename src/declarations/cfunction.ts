import Node from "../misc/node";
import Location from "../misc/location";
import Delcaration from "./declaration";

class CFunction extends Delcaration {
    name: string;
    parameters: any;
    block: Node;
    visibility: string;
    modifiers: any;
    isConstructor: boolean;
    stateMutability: string;

    constructor(
        name: string,
        parameters: any,
        block: Node,
        visibility: string,
        modifiers: any,
        isConstructor: boolean,
        stateMutability: string,
        location: Location
    ) {
        super(location);
        this.name = name;
        this.parameters = parameters;
        this.block = block;
        this.visibility = visibility;
        this.modifiers = modifiers;
        this.isConstructor = isConstructor;
        this.stateMutability = stateMutability;
        this.location = location;
    }
}

export default CFunction;