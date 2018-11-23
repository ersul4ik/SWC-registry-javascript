import Expression from "./expression";
import Location from "../misc/location";
import Node from "../misc/node";

class FunctionCall extends Expression {
    name: string;
    expression: Node;
    args: Node;
    type: string

    constructor(location: Location, name: string, expression: Node, args: Node, type: string) {
        super(location);
        this.name = name;
        this.expression = expression;
        this.args = args;
        this.type = type;
    }

}

export default FunctionCall;