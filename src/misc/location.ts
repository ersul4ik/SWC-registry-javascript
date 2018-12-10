class Location {
    id: number;
    src: string;
    lineNumberStart: number;
    lineNumberEnd: number;
    columnStart: number;
    columnEnd: number;

    constructor(id: number, src: string, lineNumberStart: number, lineNumberEnd: number, columnStart: number, columnEnd: number) {
        this.id = id;
        this.src = src;
        this.lineNumberStart = lineNumberStart;
        this.lineNumberEnd = lineNumberEnd;
        this.columnStart = columnStart;
        this.columnEnd = columnEnd;
        this.src = src;
    }
}

export default Location;
