"use strict";
//"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var remix = require("remix-lib");
/**
 * Reads a plugins directory for rules associated with specific solc AST nodes
 * The file names in plugins is the name of the node.
 *
 * @param {any} reg a map from AST nodename to a violation plugin name
 *
 *  FIXME: create a type for this kind of map
 */
function readViolationPlugins(reg) {
    var violationDir = path.join(path.dirname(fs.realpathSync(__filename)), "./plugins");
    var paths = fs.readdirSync(violationDir);
    paths.forEach(function (pathName) {
        var extIndex = pathName.length - 3;
        if (pathName.substring(extIndex) === ".js") {
            // console.log(file); // XXX
            var mod = require(violationDir + "/" + pathName);
            var name_1 = pathName.substr(0, extIndex);
            reg[name_1] = mod.register();
        }
    });
}
/**
 * This walks a JSON file that contains information like
 * you might find in a truffle built/contracts file. In there
 * is file information a solc-compatible AST for each
 * contract.
 *
 * @param {any} buildJsonPath the name of the JSON file that
 * has source-code information.
 * @param {boolean} debug verbose debug output
 */
function Analyzer(buildJsonPath, debug) {
    var registry = {};
    readViolationPlugins(registry);
    fs.readFile(buildJsonPath, "utf8", function (err, truffleJson) {
        if (err) {
            throw err;
        }
        var truffleAst = JSON.parse(truffleJson);
        var issues = [];
        var sources = truffleAst.sources;
        var astWalker;
        var callback = function (node) {
            if (debug) {
                console.log("Node name is " + node.name);
            }
            if (node.name in registry) {
                for (var _i = 0, _a = registry[node.name]; _i < _a.length; _i++) {
                    var checkerFn = _a[_i];
                    if (debug) {
                        console.log("For " + node.name + " calling is " + checkerFn.name);
                    }
                    checkerFn(node, issues);
                }
            }
            if ("children" in node) {
                for (var _b = 0, _c = node.children; _b < _c.length; _b++) {
                    var child = _c[_b];
                    astWalker.walk(child, callback);
                }
            }
        };
        Object.entries(sources).forEach(function (_a) {
            var pathName = _a[0], source = _a[1];
            astWalker = new remix.AstWalker();
            var ast = source.AST;
            astWalker.walk(ast, callback);
        });
        // console.log(JSON.stringify(ast, null, 4))
        var util = require("util");
        console.log(util.inspect(issues));
    });
}
exports.Analyzer = Analyzer;
