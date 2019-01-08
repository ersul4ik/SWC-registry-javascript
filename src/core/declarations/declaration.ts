import Location from "../../misc/location";

class Declaration {
    location: Location;
    scope: number;

    constructor(location: Location, scope: number) {
        this.location = location;
        this.scope = scope;
    }
}

export default Declaration;
