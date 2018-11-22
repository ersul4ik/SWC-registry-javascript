import Expression from "./expression";
import Location from "../misc/location";
import Node from "../misc/node";
import Type from "../types/type";

class BinaryOperation extends Expression {
    operator: string;
    left: Node;
    right: Node;

    constructor(location: Location, operator: string, left: Node, right: Node) {
        super(location);
        this.operator = operator;
        this.left = left;
        this.right = right;
    }

}

export default BinaryOperation;