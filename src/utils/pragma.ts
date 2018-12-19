import logger from "../logger/logger";
import Contract from "../core/declarations/contract";
import NodeUtility from "./node";

class PragmaUtils {
    static isVersion04(version: string) {
        if (NodeUtility.matchString(version.split(".")[1], "4")) {
            return true;
        } else {
            return false;
        }
    }

    static isVersion05(version: string) {
        if (NodeUtility.matchString(version.split(".")[1], "5")) {
            return true;
        } else {
            return false;
        }
    }
}

export default PragmaUtils;
