import Location from "../misc/location";
import Expression from "./expression";

class Identifier extends Expression {
    name: string;
    type: string;
    referencedDeclaration: number;

    constructor(location: Location, name: string, type: string, referencedDeclaration: number) {
        super(location);
        this.name = name;
        this.type = type;
        this.referencedDeclaration = referencedDeclaration;
    }
}

export default Identifier;
