import Description from "../maru/description";

const string_template = require("string-template");

class DescriptionUtils {
    static formatParameters(description_unformatted: Description, params: string[]): Description {
        for (let x = 0; x < params.length; x++) {
            params[x] = `"${params[x]}"`;
        }

        return new Description(description_unformatted.head, string_template(description_unformatted.tail, params));
    }
}

export default DescriptionUtils;
