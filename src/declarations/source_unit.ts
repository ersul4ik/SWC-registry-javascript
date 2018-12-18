import Location from "../misc/location";
import Delcaration from "./declaration";

class SourceUnit {
    id: number;
    absolutePath: string;

    constructor(id: number, absolutePath: string) {
        this.id = id;
        this.absolutePath = absolutePath;
    }
}

export default SourceUnit;
