import NodeUtility from "../utils/node";
import SolcUtility from "../utils/solc";

const AstWalker = require("remix-lib").AstWalker;

class Solc {
    static getNodeOfType(nodes: any[], type: string) {
        let filter_nodes: any[] = [];
        for (const n of nodes) {
            if (NodeUtility.matchString(n.name, type)) {
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
            walker = new AstWalker();
            walker.walk((<any>source).legacyAST, callback);
        });
        return nodes;
    }
}
export default Solc;
