import logger from "../logger/logger";
import Contract from "../core/declarations/contract";

class ContractUtils {
    static getBaseContract(name: string, contracts: Contract[]): Contract[] {
        let baseContract: Contract[] = [];
        for (const c of contracts) {
            if (c.name === name) {
                baseContract.push(c);
            }
        }
        return baseContract;
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
