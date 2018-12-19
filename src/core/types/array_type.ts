import Type from "./type";
import Location from "../../misc/location";
import ElementaryType from "./elementary_type";

class ArrayType extends Type {
    type: Type;
    length: string;

    constructor(location: Location, type: Type, length: string) {
        super(location);
        this.type = type;
        this.length = length;
    }
}

export default ArrayType;
