import Constants from "../misc/constants";
import Logger from "../logger/logger";
import Expression from "../expressions/expression";
import Location from "../misc/location";
import Type from "./type";

// TODO: Add https://solidity.readthedocs.io/en/develop/types.html#fixed-point-numbers

class ElementaryType extends Type {
    name: string;

    constructor(location: Location, type: string) {
        super(location);
        const types: string[] = ElementaryType.getTypes();

        if (!types.includes(type)) {
            Logger.debug(`Elementary type ${type} not found`);
        }

        if (type === "uint") {
            this.name = "uint256";
        } else if (type === "int") {
            this.name = "int256";
        } else if (type === "bytes1") {
            this.name = "bytes1";
        } else {
            this.name = type;
            //  Logger.debug(`Elementary type found ${type}`)
        }
    }

    static getTypes(): string[] {
        let _types: string[] = Constants.TypeNames.concat(Constants.Ints, Constants.Uints, Constants.Bytes);
        return _types;
    }
}

export default ElementaryType;
