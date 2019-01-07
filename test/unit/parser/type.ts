const assert = require("assert");
const expect = require("expect");

import Variable from "../../../src/core/declarations/variable";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";
import Solc from "../../../src/parser/solc";
import NodeTypes from "../../../src/maru/node_types";
import MemberAccess from "../../../src/core/expressions/member_access";
import Mapping from "../../../src/core/types/mapping";
import ElementaryType from "../../../src/core/types/elementary_type";
import ArrayType from "../../../src/core/types/array_type";
import UserDefinedType from "../../../src/core/types/user_defined_type";

describe("Types", () => {
    const file_name = "./test/sol_files/type/storage.sol";
    const sol_file = new SolFile(file_name);
    const variables_f: Variable[] = sol_file.contracts[0].variables;

    it(`Test case - get correct number of variables in the contract in ${file_name}`, async () => {
        expect(variables_f.length).toEqual(11);
    });

    it(`Test case - parse Mapping type in ${file_name}`, async () => {
        expect(variables_f[10].type instanceof Mapping).toEqual(true);

        expect((<Mapping>variables_f[10].type).key instanceof ElementaryType).toEqual(true);
        expect((<Mapping>variables_f[10].type).value instanceof ElementaryType).toEqual(true);
        expect((<Mapping>variables_f[10].type).key.name).toEqual("address");

        expect((<ElementaryType>(<Mapping>variables_f[10].type).value).name).toEqual("uint256");
    });

    it(`Test case - parse ArrayType in ${file_name}`, async () => {
        expect(variables_f[9].type instanceof ArrayType).toEqual(true);

        expect((<ArrayType>variables_f[9].type).type instanceof UserDefinedType).toEqual(true);
        expect((<ArrayType>variables_f[9].type).length).toEqual("null");
    });

    it(`Test case - parse ElementaryType in ${file_name}`, async () => {
        expect(variables_f[5].type instanceof ElementaryType).toEqual(true);

        expect((<ElementaryType>variables_f[5].type).name).toEqual("string");
    });
});
