import Node from "../misc/node";
import Location from "../misc/location";
import Delcaration from "./declaration";
import Parameter from "./parameter";

class CFunction extends Delcaration {
    name: string;
    function_parameters: Parameter[];
    returnParameters: Parameter[];
    block: Node;
    visibility: string;
    modifiers: any;
    isConstructor: boolean;
    stateMutability: string;

    constructor(
        name: string,
        function_parameters: Parameter[],
        returnParameters: Parameter[],
        block: Node,
        visibility: string,
        modifiers: any,
        isConstructor: boolean,
        stateMutability: string,
        location: Location
    ) {
        super(location);
        this.name = name;
        this.function_parameters = function_parameters;
        this.returnParameters = returnParameters;
        this.block = block;
        this.visibility = visibility;
        this.modifiers = modifiers;
        this.isConstructor = isConstructor;
        this.stateMutability = stateMutability;
        this.location = location;
    }
}

export default CFunction;
