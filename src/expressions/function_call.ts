import Expression from "./expression";
import Location from "../misc/location";
import Node from "../misc/node";

class FunctionCall extends Expression {
    identifier_name: string;
    identifier_type: string;
    member_name: string;
    member_type: string;

    constructor(location: Location, identifier_name: string, identifier_type: string, member_name: string, member_type: string) {
        super(location);
        this.identifier_name = identifier_name;
        this.identifier_type = identifier_type;
        this.member_name = member_name;
        this.member_type = member_type;
    }
}

export default FunctionCall;
