import Description from "./description";

class MythXIssue {
    "swc-id": string;
    "swc-title": string;
    description: Description;
    locations: MythXLocation[] = [];

    constructor(id: string, title: string, description: Description, location: MythXLocation) {
        this["swc-id"] = id;
        this["swc-title"] = title;
        this.description = description;
        this.locations.push(location);
    }
}

class MythXLocation {
    sourceMap: string;

    constructor(sourceMap: string) {
        this.sourceMap = sourceMap;
    }
}

export { MythXIssue, MythXLocation };
