import Expression from "./expression";
import Location from "../../misc/location";
import Node from "../../misc/node";
import Type from "../types/type";
import UserDefinedType from "../types/user_defined_type";

class InheritanceSpecifier extends Expression {
    type: UserDefinedType;

    constructor(location: Location, type: UserDefinedType) {
        super(location);
        this.type = type;
    }
}

export default InheritanceSpecifier;
