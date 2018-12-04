#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var analyzer_1 = require("./src/analyzer");
// Set this for debugging
var debug = false;
function usage() {
    console.log("usage: " + process.argv[1] + " truffle-ast-JSON");
    process.exit(1);
}
if (process.argv.length !== 3) {
    usage();
}
var astPath = process.argv[2];
analyzer_1.Analyzer(astPath, debug);
