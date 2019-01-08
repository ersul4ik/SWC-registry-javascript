import Constants from "../misc/constants";

const niv = require("npm-install-version");

for (const version of Constants.supported_solc_version_04) {
    const solc_version_string: string = "solc@" + version;
    niv.install(solc_version_string, { quiet: false });
}

for (const version of Constants.supported_solc_version_05) {
    const solc_version_string: string = "solc@" + version;
    niv.install(solc_version_string, { quiet: false });
}
