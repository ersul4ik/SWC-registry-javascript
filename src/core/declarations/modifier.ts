import Location from "../../misc/location";
import Node from "../../misc/node";
import Delcaration from "./declaration";
import Parameter from "./parameter";
import Variable from "./variable";

class Modifier extends Delcaration {
    name: string;
    visibility: string;
    variables: Variable[];
    function_parameters: Variable[];

    constructor(
        location: Location,
        scope: number,
        name: string,
        visibility: string,
        variables: Variable[],
        function_parameters: Variable[]
    ) {
        super(location, scope);
        this.name = name;
        this.visibility = visibility;
        this.variables = variables;
        this.function_parameters = function_parameters;
    }
}

export default Modifier;
