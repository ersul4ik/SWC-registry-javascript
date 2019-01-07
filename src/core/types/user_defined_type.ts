import Type from "./type";
import Location from "../../misc/location";
import ElementaryType from "./elementary_type";

class UserDefinedType extends Type {
    name: string;
    referencedDeclaration: number;

    constructor(location: Location, name: string, referencedDeclaration: number) {
        super(location);
        this.name = name;
        this.referencedDeclaration = referencedDeclaration;
    }
}

export default UserDefinedType;
