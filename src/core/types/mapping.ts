import Type from "./type";
import Location from "../../misc/location";
import ElementaryType from "./elementary_type";

class Mapping extends Type {
    key: ElementaryType;
    value: Type;

    constructor(location: Location, key: ElementaryType, value: Type) {
        super(location);
        this.key = key;
        this.value = value;
    }
}

export default Mapping;
