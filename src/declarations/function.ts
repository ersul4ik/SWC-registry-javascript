import Node from "../misc/node";
import Location from "../misc/location";
import Delcaration from "./declaration";
import Parameter from "./parameter";

class CFunction extends Delcaration {
    name: string;
    isConstructor: boolean;
    visibility: string;
    stateMutability: string;
    isImplemented: boolean;
    function_parameters: Parameter[];
    returnParameters: Parameter[];
    modifiers: any[];

    constructor(
        location: Location,
        scope: number,
        name: string,
        isConstructor: boolean,
        visibility: string,
        stateMutability: string,
        isImplemented: boolean,
        function_parameters: Parameter[],
        returnParameters: Parameter[],
        modifiers: any
    ) {
        super(location, scope);
        this.name = name;
        this.isConstructor = isConstructor;
        this.visibility = visibility;
        this.stateMutability = stateMutability;
        this.isImplemented = isImplemented;
        this.function_parameters = function_parameters;
        this.returnParameters = returnParameters;
        this.modifiers = modifiers;
    }
}

export default CFunction;
