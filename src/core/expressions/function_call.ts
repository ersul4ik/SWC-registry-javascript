import Expression from "./expression";
import Location from "../../misc/location";
import Node from "../../misc/node";

class FunctionCall extends Expression {
    identifier_name: string;
    identifier_type: string;
    member_name1: string;
    member_type1: string;
    member_name2: string;
    member_type2: string;

    constructor(
        location: Location,
        identifier_name: string,
        identifier_type: string,
        member_name1: string,
        member_type1: string,
        member_name2: string,
        member_type2: string
    ) {
        super(location);
        this.identifier_name = identifier_name;
        this.identifier_type = identifier_type;
        this.member_name1 = member_name1;
        this.member_type1 = member_type1;
        this.member_name2 = member_name2;
        this.member_type2 = member_type2;
    }
}

export default FunctionCall;
