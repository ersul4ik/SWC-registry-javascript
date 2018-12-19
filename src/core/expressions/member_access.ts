import Location from "../../misc/location";
import Expression from "./expression";
import Node from "../../misc/node";

class MemberAccess extends Expression {
    member_name: string;
    type: string;

    constructor(location: Location, member_name: string, type: string) {
        super(location);
        this.member_name = member_name;
        this.type = type;
    }
}

export default MemberAccess;
