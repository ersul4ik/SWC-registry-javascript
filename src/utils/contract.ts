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

    static getContractNameFromID(contracts: Contract[], id: number): string {
        for (const c of contracts) {
            if (c.location.id == id) {
                return c.name;
            }
        }
        return "";
    }
}

export default ContractUtils;
