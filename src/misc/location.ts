class Location {
    id: number;
    file_name: string;
    src: string;
    lineNumberStart: number;
    lineNumberEnd: number;
    columnStart: number;
    columnEnd: number;

    constructor(
        id: number,
        file_name: string,
        src: string,
        lineNumberStart: number,
        lineNumberEnd: number,
        columnStart: number,
        columnEnd: number
    ) {
        this.id = id;
        this.file_name = file_name;
        this.src = src;
        this.lineNumberStart = lineNumberStart;
        this.lineNumberEnd = lineNumberEnd;
        this.columnStart = columnStart;
        this.columnEnd = columnEnd;
    }
}

export default Location;
