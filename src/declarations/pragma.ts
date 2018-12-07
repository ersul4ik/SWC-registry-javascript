import Location from "../misc/location";
import Delcaration from "./declaration";

interface Pragma {
    location: Location;
    name: string;
    value: string;
}

class Pragma {
    location: Location;
    name: string;
    value: string;

    constructor(location: Location, name: string, value: string) {
        this.location = location;
        this.name = name;
        this.value = value;
    }
}

export default Pragma;
