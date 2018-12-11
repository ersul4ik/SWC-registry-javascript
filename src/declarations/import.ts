const fs = require("fs");
import Delcaration from "./declaration";
import Location from "../misc/location";

class Import extends Delcaration {
    path: string;

    constructor(location: Location, path: string) {
        // stub scope as it does not exist in the antlr AST
        super(location, -1);
        this.path = path;
    }
}

export default Import;
