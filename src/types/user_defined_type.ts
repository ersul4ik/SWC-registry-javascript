import Type from "./type";
import Location from "../misc/location";
import ElementaryType from "./elementary_type";

class UserDefinedType extends Type {

    name: string;

    constructor(location: Location, name: string) {
        super(location);
        this.name = name;
    }
}

export default UserDefinedType;