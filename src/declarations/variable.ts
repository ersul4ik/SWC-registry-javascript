import Node from "../misc/node";
import Location from "../misc/location";
import Delcaration from "./declaration";
import ElementaryType from "../types/elementary_type";
import Type from "../types/type";

class Variable extends Delcaration {
    name: string;
    type: Type;
    expression: Node;
    initialValue: Node;
    visibility: string;
    isStateVar: boolean;
    isConstant: boolean;
    storageLocation: string;

    constructor(
        location: Location,
        name: string,
        type: Type,
        expression: Node,
        initialValue: Node,
        visibility: string,
        isStateVar: boolean,
        isConstant: boolean,
        storageLocation: string
    ) {
        super(location);
        this.name = name;
        this.type = type;
        this.expression = expression;
        this.initialValue = initialValue;
        this.visibility = visibility;
        this.isStateVar = isStateVar;
        this.isConstant = isConstant;
        this.storageLocation = storageLocation;
    }

}

export default Variable;
