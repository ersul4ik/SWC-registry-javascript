
const assert = require("assert");
const expect = require("expect");

import Contract from '../../../src/declarations/contract';
import SolFile from '../../../src/maru/sol_file';
import StringUtility from '../../../src/utils/ast';

describe("Locations", () => {
    const file_name = "./test/sol_files/contracts/simple.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case - get the function location from ${file_name}`, async () => {

        StringUtility.printNode(sol_file.parsePragma())

    });

});
