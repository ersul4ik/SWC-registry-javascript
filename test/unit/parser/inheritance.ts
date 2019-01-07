const assert = require("assert");
const expect = require("expect");

import Contract from "../../../src/core/declarations/contract";
import ContractUtils from "../../../src/utils/contract";
import SolFile from "../../../src/maru/sol_file";
import NodeUtility from "../../../src/utils/node";

describe("Inheritance linearization", () => {
    const file_name = "./test/sol_files/inheritance/simple_three_contract.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case - Resolves inheritance in correct order with linearizedBaseContracts for contracts in ${file_name}`, async () => {
        let contracts: Contract[] = sol_file.contracts;

        expect(contracts[0].name).toEqual("D");
        expect(contracts[0].linearizedBaseContracts).toEqual([]);

        expect(contracts[1].name).toEqual("C");
        expect(contracts[1].linearizedBaseContracts).toEqual([]);

        expect(ContractUtils.getContractNameFromID(sol_file.contracts, 23)).toEqual("C");
        expect(contracts[2].name).toEqual("B");
        expect(contracts[2].linearizedBaseContracts).toEqual([23]);

        expect(ContractUtils.getContractNameFromID(sol_file.contracts, 12)).toEqual("D");
        expect(ContractUtils.getContractNameFromID(sol_file.contracts, 34)).toEqual("B");
        expect(ContractUtils.getContractNameFromID(sol_file.contracts, 23)).toEqual("C");
        expect(contracts[3].name).toEqual("A");
        expect(contracts[3].linearizedBaseContracts).toEqual([12, 34, 23]);
    });

    it(`Test case - Resolves inheritance in correct order with inheritedContracts attribute for contracts in ${file_name}`, async () => {
        let contracts: Contract[] = sol_file.contracts;

        expect(contracts[0].name).toEqual("D");
        expect(contracts[0].inheritedContracts.length).toEqual(0);

        expect(contracts[1].name).toEqual("C");
        expect(contracts[1].inheritedContracts.length).toEqual(0);

        expect(contracts[2].name).toEqual("B");
        expect(contracts[2].inheritedContracts.length).toEqual(1);

        expect(contracts[3].name).toEqual("A");
        expect(contracts[3].inheritedContracts.length).toEqual(2);

        expect(contracts[3].inheritedContracts[0].name).toEqual("D");
        expect(contracts[3].inheritedContracts[1].name).toEqual("B");
    });
});
