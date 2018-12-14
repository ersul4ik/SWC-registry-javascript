import Location from "../misc/location";
import Expression from "./expression";

class Identifier extends Expression {
    name: string;
    referencedDeclaration: number;

    constructor(location: Location, name: string, referencedDeclaration: number) {
        super(location);
        this.name = name;
        this.referencedDeclaration = referencedDeclaration;
    }
}

export default Identifier;
