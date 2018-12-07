import Location from "../misc/location";
import Expression from "./expression";
import Node from "../misc/node";

class MemberAccess extends Expression {
    name: string;
    expression: Node;

    constructor(location: Location, name: string, expression: Node) {
        super(location);
        this.name = name;
        this.expression = expression;
    }
}

export default MemberAccess;
