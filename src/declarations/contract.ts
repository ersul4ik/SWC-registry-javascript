const c3 = require("c3-linearization");

import Location from "../misc/location";
import Node from "../misc/node";
import CFunction from "./function";
import SolidityAntlr from "../parser/solidity_antlr";
import Delcaration from "./declaration";
import Variable from "./variable";

class Contract extends Delcaration {
    name: string;
    kind: string;
    linearizedBaseContracts: number[];
    isImplemented: boolean;
    functions: CFunction[];
    variables: Variable[];

    constructor(
        location: Location,
        scope: number,
        name: string,
        kind: string,
        isImplemented: boolean,
        linearizedBaseContracts: number[],
        functions: CFunction[]
    ) {
        super(location, scope);
        this.name = name;
        this.kind = kind;
        this.linearizedBaseContracts = linearizedBaseContracts;
        this.isImplemented = isImplemented;
        this.functions = functions;
        this.variables = [];
    }

    hasConstructor(): boolean {
        for (const f of this.functions) {
            if (f.isConstructor) {
                return true;
            }
        }
        return false;
    }
}

export default Contract;
