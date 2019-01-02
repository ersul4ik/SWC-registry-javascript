import Location from "../../misc/location";
import Declaration from "./declaration";

const fs = require("fs");
class Import extends Declaration {
    path: string;

    constructor(location: Location, path: string) {
        // stub scope as it does not exist in the antlr AST
        super(location, -1);
        this.path = path;
    }
}

export default Import;
