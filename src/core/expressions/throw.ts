import Expression from "./expression";
import Location from "../../misc/location";

class Throw extends Expression {
    constructor(location: Location) {
        super(location);
    }
}

export default Throw;
