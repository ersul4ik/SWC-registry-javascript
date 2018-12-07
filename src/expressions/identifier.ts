import Location from "../misc/location";
import Expression from "./expression";

class Identifier extends Expression {
    name: string;
    constructor(name: string, location: Location) {
        super(location);
        this.name = name;
    }
}

export default Identifier;
