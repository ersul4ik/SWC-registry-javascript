const c3 = require("c3-linearization");

import Location from './location';
import Node from './node';

class Contract {
    name: string;
    subNodes: Node;
    kind: string;
    baseContracts: string[];
    baseContractsNormalized: string[];
    location: Location;

    constructor(
        name: string,
        kind: string,
        baseContracts: string[],
        subNodes: Node,
        location: Location
    ) {
        this.name = name;
        this.kind = kind;
        this.baseContracts = baseContracts;
        this.baseContractsNormalized = [];
        this.subNodes = subNodes;
        this.location = location;
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
