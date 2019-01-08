import Location from "../../misc/location";
import Node from "../../misc/node";
import SolidityAntlr from "../../parser/solidity_antlr";
import Declaration from "./declaration";
import CFunction from "./function";
import Variable from "./variable";
import UserDefinedType from "../types/user_defined_type";

class Contract extends Declaration {
    name: string;
    kind: string;
    linearizedBaseContracts: number[];
    inheritedContracts: UserDefinedType[];
    isImplemented: boolean;
    functions: CFunction[];
    state_variables: Variable[];

    constructor(
        location: Location,
        scope: number,
        name: string,
        kind: string,
        isImplemented: boolean,
        linearizedBaseContracts: number[],
        inheritedContracts: UserDefinedType[],
        functions: CFunction[],
        variables: Variable[]
    ) {
        super(location, scope);
        this.name = name;
        this.kind = kind;
        this.linearizedBaseContracts = linearizedBaseContracts;
        this.inheritedContracts = inheritedContracts;
        this.isImplemented = isImplemented;
        this.functions = functions;
        this.state_variables = variables;
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
