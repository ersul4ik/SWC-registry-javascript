import Location from "../../misc/location";
import Node from "../../misc/node";
import ElementaryType from "../types/elementary_type";
import Type from "../types/type";
import Declaration from "./declaration";

class Parameter extends Declaration {
    name: string;
    type: Type;
    isStateVar: boolean;
    storageLocation: string;

    constructor(location: Location, name: string, type: Type, isStateVar: boolean, storageLocation: string) {
        super(location, 1);
        this.name = name;
        this.type = type;
        this.isStateVar = isStateVar;
        this.storageLocation = storageLocation;
    }
}

export default Parameter;
