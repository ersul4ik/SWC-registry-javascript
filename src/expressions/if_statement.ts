import Location from "../misc/location";
import Expression from "./expression";

class IfStatement extends Expression {
    constructor(location: Location) {
        super(location);
    }
}

export default IfStatement;
