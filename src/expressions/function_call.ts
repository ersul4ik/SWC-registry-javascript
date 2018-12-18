import Expression from "./expression";
import Location from "../misc/location";
import Node from "../misc/node";

class FunctionCall extends Expression {
    name: string;
    type: string;
    member_name: string;
    member_type: string;

    constructor(location: Location, name: string, type: string, member_name: string, member_type: string) {
        super(location);
        this.name = name;
        this.type = type;
        this.member_name = member_name;
        this.member_type = member_type;
    }
}

export default FunctionCall;
