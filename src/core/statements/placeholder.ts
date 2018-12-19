import Location from "../../misc/location";
import Statement from "./statement";

class PlaceHolder extends Statement {
    constructor(location: Location) {
        super(location);
    }
}

export default PlaceHolder;
