class Location {
    lineNumberStart: number;
    lineNumberEnd: number;
    columnStart: number;
    columnEnd: number;
    src: string;

    constructor(lineNumberStart: number, lineNumberEnd: number, columnStart: number, columnEnd: number, src: string) {
        this.lineNumberStart = lineNumberStart;
        this.lineNumberEnd = lineNumberEnd;
        this.columnStart = columnStart;
        this.columnEnd = columnEnd;
        this.src = src;
    }
}

export default Location;
