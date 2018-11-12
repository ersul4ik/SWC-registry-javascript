class PluginConfig {
    active: boolean;
    swcID: string;
    shortDescription: string;

    constructor(active: boolean, swcID: string, shortDescription: string) {
        this.active = active;
        this.swcID = swcID;
        this.shortDescription = shortDescription;
    }

}

export default PluginConfig;