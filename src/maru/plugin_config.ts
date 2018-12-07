class PluginConfig {
    active: boolean;
    swcID: string;
    descriptionShort: string[];

    constructor(active: boolean, swcID: string, descriptionShort: string[]) {
        this.active = active;
        this.swcID = swcID;
        this.descriptionShort = descriptionShort;
    }
}

export default PluginConfig;
