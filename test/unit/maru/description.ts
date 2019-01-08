const assert = require("assert");
const expect = require("expect");

import CFunction from "../../../src/core/declarations/function";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";
import NodeTypes from "../../../src/maru/node_types";
import Config from "../../../config/config.json";
import PluginConfig from "../../../src/maru/plugin_config";
import Description from "../../../src/maru/description";
import DescriptionUtils from "../../../src/utils/description";

describe("Description", () => {
    let config: { [plugins: string]: any } = {};
    config = Config;

    it(`Test case - format a description with parameters`, async () => {
        let description_lock_pragma: Description = config.plugins["LockPragma"].description[0];

        const description_lock_pragma_formatted: Description = DescriptionUtils.formatParameters(description_lock_pragma, ["0.4.10"]);

        expect(description_lock_pragma_formatted.tail).toContain("0.4.10");
    });
});
