import Expression from "./expression";
import Location from "../../misc/location";
import Node from "../../misc/node";
import Type from "../types/type";

class UnaryOperation extends Expression {
    operator: string;
    type: string;
    isPure: boolean;

    constructor(location: Location, operator: string, type: string, isPure: boolean) {
        super(location);
        this.operator = operator;
        this.type = type;
        this.isPure = isPure;
    }
}

export default UnaryOperation;
