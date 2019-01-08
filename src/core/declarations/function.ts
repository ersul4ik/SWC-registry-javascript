import Location from "../../misc/location";
import Node from "../../misc/node";
import Declaration from "./declaration";
import Parameter from "./parameter";
import Variable from "./variable";

class CFunction extends Declaration {
    name: string;
    isConstructor: boolean;
    visibility: string;
    stateMutability: string;
    isImplemented: boolean;
    variables: Variable[];
    function_parameters: Variable[];
    modifiers: any[];

    constructor(
        location: Location,
        scope: number,
        name: string,
        isConstructor: boolean,
        visibility: string,
        stateMutability: string,
        isImplemented: boolean,
        variables: Variable[],
        function_parameters: Variable[],
        modifiers: any
    ) {
        super(location, scope);
        this.name = name;
        this.isConstructor = isConstructor;
        this.visibility = visibility;
        this.stateMutability = stateMutability;
        this.isImplemented = isImplemented;
        this.variables = variables;
        this.function_parameters = function_parameters;
        this.modifiers = modifiers;
    }
}

export default CFunction;
