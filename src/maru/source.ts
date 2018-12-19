class Source {
    file_name: string;
    nodes: any[];

    constructor(file_name: string, nodes: any[]) {
        this.file_name = file_name;
        this.nodes = nodes;
    }
}

export default Source;
