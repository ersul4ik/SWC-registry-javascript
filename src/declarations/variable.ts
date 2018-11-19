import Node from "../misc/node";
import Location from "../misc/location";
import Delcaration from "./declaration";

class Variable extends Delcaration {
    name: string;
    type: Node;
    expression: Node;
    visibility: string;
    isStateVar: boolean;
    isConstant: boolean;
    storageLocation: string;
    location: Location;

    constructor(
        name: string,
        type: Node,
        expression: Node,
        visibility: string,
        isStateVar: boolean,
        isConstant: boolean,
        storageLocation: string,
        location: Location
    ) {
        super(location);
        this.name = name;
        this.type = type;
        this.expression = expression;
        this.visibility = visibility;
        this.isStateVar = isStateVar;
        this.isConstant = isConstant;
        this.storageLocation = storageLocation;
        this.location = location;
    }

}

export default Variable;
