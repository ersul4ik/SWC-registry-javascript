import Location from "../misc/location";
import Delcaration from "./declaration";

interface Pragma {
    name: string;
    value: string;
}

class Pragma extends Delcaration {
    name: string;
    value: string;

    constructor(location: Location, name: string, value: string, ) {
        super(location)
        this.name = name;
        this.value = value;

    }
}

export default Pragma;