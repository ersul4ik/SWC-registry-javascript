import Description from "../maru/description";

const string_template = require("string-template");

class DescriptionUtils {
    static formatParameters(description_unformatted: Description, params: string[]): Description {
        return new Description(description_unformatted.head, string_template(description_unformatted.tail, params));
    }
}

export default DescriptionUtils;
