import Description from "./description";

class PluginConfig {
    active: boolean;
    swcID: string;
    description: Description[];

    constructor(active: boolean, swcID: string, description: Description[]) {
        this.active = active;
        this.swcID = swcID;
        this.description = description;
    }
}

export default PluginConfig;
