import Node from "./node";
import Location from "./location";

class StateVariable {
    name: string;
    type: string;
    expression: Node;
    visibility: string;
    isStateVar: boolean;
    isConstant: boolean;
    location: Location;

    constructor(
        name: string,
        type: string,
        expression: Node,
        visibility: string,
        isStateVar: boolean,
        isConstant: boolean,
        location: Location
    ) {
        this.name = name;
        this.type = type;
        this.expression = expression;
        this.visibility = visibility;
        this.isStateVar = isStateVar;
        this.isConstant = isConstant;
        this.location = location;
    }

}

export default StateVariable;
