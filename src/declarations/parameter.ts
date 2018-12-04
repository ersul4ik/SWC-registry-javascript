import Node from "../misc/node";
import Location from "../misc/location";
import Delcaration from "./declaration";
import ElementaryType from "../types/elementary_type";
import Type from "../types/type";

class Parameter extends Delcaration {
    name: string;
    type: Type;
    isStateVar: boolean;
    storageLocation: string;

    constructor(
        location: Location,
        name: string,
        type: Type,
        isStateVar: boolean,
        storageLocation: string
    ) {
        super(location);
        this.name = name;
        this.type = type;
        this.isStateVar = isStateVar;
        this.storageLocation = storageLocation;
    }

}

export default Parameter;
