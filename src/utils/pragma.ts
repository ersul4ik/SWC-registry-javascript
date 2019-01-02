import logger from "../logger/logger";
import Contract from "../core/declarations/contract";
import NodeUtility from "./node";
import Constants from "../misc/constants";

class PragmaUtils {
    static isVersion04(version: string): boolean {
        if (NodeUtility.matchString(version.split(".")[1], "4")) {
            return true;
        } else {
            return false;
        }
    }

    static isVersion05(version: string): boolean {
        if (NodeUtility.matchString(version.split(".")[1], "5")) {
            return true;
        } else {
            return false;
        }
    }

    static isSupportedVersion(version: string): boolean {
        if (PragmaUtils.isVersion05(version)) {
            for (const v of Constants.supported_solc_version_05) {
                if (NodeUtility.matchString(v, version)) {
                    return true;
                }
            }
        } else if (PragmaUtils.isVersion04(version)) {
            for (const v of Constants.supported_solc_version_04) {
                if (NodeUtility.matchString(v, version)) {
                    return true;
                }
            }
        }
        return false;
    }

    static isVersionFixed(version: string): boolean {
        return !version.match(/\^/);
    }

    static getVersionWithoutCaret(version: string): string {
        return version.replace(/\^/, "");
    }
}

export default PragmaUtils;
