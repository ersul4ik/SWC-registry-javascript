import Description from "./description";

class MythXIssue {
    "swcID": string;
    "swcTitle": string;
    description: Description;
    locations: MythXLocation[] = [];
    severity: string;
    extra: {};

    constructor(id: string, title: string, description: Description, location: MythXLocation) {
        this["swcID"] = id;
        this["swcTitle"] = title;
        this.description = description;
        this.locations.push(location);
        // Fix me
        this.severity = "";
        this.extra = {};
    }
}

class MythXLocation {
    sourceMap: string;

    constructor(sourceMap: string) {
        this.sourceMap = sourceMap;
    }
}

export { MythXIssue, MythXLocation };
