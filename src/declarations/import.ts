const fs = require("fs");
import logger from "../logger/logger";

class Import{
    path:string;

    constructor(path:string){
        this.path = path;
    }
}

export default Import;
