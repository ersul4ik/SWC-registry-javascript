const fs = require("fs");
import logger from "../logger/logger";

class ImportDirective{
    path:string;
    code:string;

    constructor(path:string){
        this.path = path;
        this.code = this.getCode(path);
    }

    getCode(path:string) {
        const stats = fs.statSync(path);

        if (stats.isFile()) {
            return stats.readFileSync(path).toString();
        } else {
            logger.debug("Import file not found " + path)
        }
    }
}

