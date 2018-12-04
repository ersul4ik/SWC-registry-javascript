"use strict";
// Class for Issues that are reported back.
exports.__esModule = true;
var Severity;
(function (Severity) {
    Severity[Severity["Info"] = 0] = "Info";
    Severity[Severity["Warning"] = 1] = "Warning";
    Severity[Severity["Error"] = 2] = "Error";
})(Severity = exports.Severity || (exports.Severity = {}));
exports.Issues = [];
var Issue = /** @class */ (function () {
    function Issue(srcmap, swcId, severity, description, followDescription) {
        if (followDescription === void 0) { followDescription = ""; }
        this.followDescription = "";
        this.srcmap = srcmap;
        this.swcId = swcId;
        this.severity = severity;
        this.description = description;
        this.followDescription = followDescription;
    }
    // Normally we give JSON output, so the below is not
    // used. However for debugging
    // we have plain-ol' console logging.
    Issue.prototype.print = function () {
        console.log("SWC-ID: " + this.swcId);
        console.log("Description: " + this.description);
        console.log("Follow Description: " + this.followDescription);
        console.log("srcmap: " + this.srcmap);
    };
    return Issue;
}());
exports.Issue = Issue;
