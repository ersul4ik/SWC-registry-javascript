const string_template = require("string-template");
class Description {
    head: string;
    tail: string;

    constructor(head: string, tail: string) {
        this.head = head;
        this.tail = tail;
    }

    formatParameters(description_unformatted: Description, params: string[]) {
        return new Description(description_unformatted.head, string_template(description_unformatted.tail, params));
    }
}

export default Description;
