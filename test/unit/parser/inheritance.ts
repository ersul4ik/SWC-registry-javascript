const c3 = require("c3-linearization");
const assert = require("assert");
const expect = require("expect");

import Contract from "../../../src/declarations/contract";
import SolFile from "../../../src/maru/sol_file";

describe("Inheritance linearization", () => {
    const file_name = "./test/sol_files/inheritance/simple_three_contract.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case - Resolves inheritance in correct order for contracts in ${file_name}`, async () => {
        let contracts: Contract[] = sol_file.contracts_current;

        for (const c of contracts) {
            c.normalizeBaseContracts(contracts);
        }

        expect(contracts[0].name).toEqual("D");
        expect(contracts[0].baseContractsNormalized).toEqual([]);

        expect(contracts[1].name).toEqual("C");
        expect(contracts[1].baseContractsNormalized).toEqual([]);

        expect(contracts[2].name).toEqual("B");
        expect(contracts[2].baseContractsNormalized).toEqual(["C"]);

        expect(contracts[3].name).toEqual("A");
        expect(contracts[3].baseContractsNormalized).toEqual(["D", "B", "C"]);
    });
});
