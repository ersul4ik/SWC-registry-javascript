const fs = require("fs");
import Delcaration from "./declaration";
import Location from "../misc/location";

class Import extends Delcaration {
    path: string;

    constructor(location: Location, path: string) {
        super(location);
        this.path = path;
    }
}

export default Import;
