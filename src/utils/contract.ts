import Contract from "../declarations/contract";
import logger from "../logger/logger";

class ContractHelper {
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

export default ContractHelper;