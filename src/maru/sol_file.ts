import Contract from "../declarations/contract";
import Import from "../declarations/import";

class SolFile {
    imports:Import[];
    contracts:Contract[];

    constructor(imports: Import[], contracts: Contract[], ){

        this.imports = imports;
        this.contracts = contracts;
    }
}

export default SolFile;