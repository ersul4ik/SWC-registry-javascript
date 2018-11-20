import Type from "./type";
import Location from "../misc/location";
import ElementaryType from "./elementary_type";

class ArrayType extends Type {

    elementaryType: ElementaryType;
    length: string;

    constructor(location: Location, elementaryType: ElementaryType, length: string) {
        super(location);
        this.elementaryType = elementaryType;
        this.length = length;
    }
}

export default ArrayType;