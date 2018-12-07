import FileUtils from "../utils/file";
import Node from "../misc/node";
import SolcUtility from "../utils/solc";
import StringUtility from "../utils/ast";
import Location from "../misc/location";
import Pragma from "../declarations/pragma";
import NodeTypes from "../maru/node_types";

const AstWalker = require("remix-lib").AstWalker;

class Solc {
    static getNodeOfType(nodes: any[], type: string) {
        let filter_nodes: any[] = [];
        for (const n of nodes) {
            if (StringUtility.matchString(n.name, type)) {
                filter_nodes.push(n);
            }
        }
        return filter_nodes;
    }

    static walkAST(file_name: string) {
        const compilation_result = SolcUtility.compile(file_name);
        let walker = new AstWalker();
        let nodes: any[] = [];

        const callback = (node: any) => {
            nodes.push(node);
            if ("children" in node) {
                for (const child of node.children) {
                    walker.walk(child, callback);
                }
            }
        };

        Object.entries(compilation_result.sources).forEach(([pathName, source]) => {
            let bar = <any>{};
            bar = source;
            //  AstUtility.printNode(bar.legacyAST)

            walker = new AstWalker();
            walker.walk(bar.legacyAST, callback);
        });
        return nodes;
    }
}
export default Solc;
