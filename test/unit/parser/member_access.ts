const assert = require("assert");
const expect = require("expect");
const parser = require("solidity-parser-antlr");

import Contract from "../../../src/declarations/contract";
import BinaryOperation from "../../../src/expressions/binary_operation";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";
import Identifier from "../../../src/expressions/identifier";
import CFunction from "../../../src/declarations/function";
import MemberAccess from "../../../src/expressions/member_access";

describe("MemberAccess", () => {
    const file_name = "./test/sol_files/variable/statements.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case: Memberaccess in function rofl() of ${file_name}`, async () => {
        const functions: CFunction[] = sol_file.contracts_current[0].functions;

        const members: MemberAccess[] = sol_file.parseMemberAccess(functions[1].location.id);

        expect(members.length).toEqual(1);

        expect(members[0].member_name).toEqual("blockhash");
        expect(members[0].type).toEqual("function (uint256) view returns (bytes32)");
    });
});
