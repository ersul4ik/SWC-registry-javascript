const c3 = require("c3-linearization");

import Location from '../misc/location';
import Node from '../misc/node';
import CFunction from './cfunction';
import SolidityAntlr from '../parser/solidity_antlr';
import Delcaration from './declaration';
import Variable from './variable';

class Contract extends Delcaration {
    name: string;
    block: Node;
    kind: string;
    baseContracts: string[];
    baseContractsNormalized: string[];
    functions: CFunction[];
    variables: Variable[];

    constructor(
        name: string,
        kind: string,
        baseContracts: string[],
        block: Node,
        location: Location
    ) {
        super(location)
        this.name = name;
        this.kind = kind;
        this.baseContracts = baseContracts;
        this.baseContractsNormalized = [];
        this.block = block;
        this.functions = SolidityAntlr.parseCFunction(block.branch);
        this.variables = SolidityAntlr.parseVariables(block.branch)
    }

    normalizeBaseContracts(contracts: Contract[]): void {
        let inheritance: any = {};

        for (const c of contracts) {
            inheritance[c.name] = c.baseContracts;
        }
        let inheritance_lin = c3.linearize(inheritance, { reverse: true });

        // the first item is the current contract itself, so remove it 
        inheritance_lin[this.name].shift();

        this.baseContractsNormalized = inheritance_lin[this.name];
    }

}

export default Contract;
