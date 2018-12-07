import logger from "../logger/logger";
import Contract from "../declarations/contract";

class ContractUtils {
    static getBaseContracts(name: string, contracts: Contract[]) {
        let baseContracts: Contract[] = [];
        for (const c of contracts) {
            if (c.name === name) {
                return c;
            }
        }
        const error: string = `Contract not found ${name}`;
        logger.debug(error);
        return error;
    }
}

export default ContractUtils;
