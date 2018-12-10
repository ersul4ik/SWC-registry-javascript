import Location from "../misc/location";

class Delcaration {
    location: Location;
    scope: number;

    constructor(location: Location, scope: number) {
        this.location = location;
        this.scope = scope;
    }
}

export default Delcaration;
