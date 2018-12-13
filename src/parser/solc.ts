import NodeUtility from "../utils/node";
import SolcUtility from "../utils/solc";
import Import from "../declarations/import";

const AstWalker = require("remix-lib").AstWalker;

class Solc {
    static getNodeOfType(nodes: any[], type?: string, id?: number) {
        let filter_nodes_types: any[] = [];
        let filter_nodes_ids: any[] = [];

        // filter types
        for (const n of nodes) {
            if (type) {
                if (NodeUtility.matchString(n.name, type)) {
                    filter_nodes_types.push(n);
                }
            } else {
                filter_nodes_types.push(n);
            }
        }

        // filter ids
        for (const n of filter_nodes_types) {
            if (id) {
                if (NodeUtility.hasProperty(n.attributes, "scope") && id == n.attributes.scope) {
                    filter_nodes_ids.push(n);
                }
            } else {
                filter_nodes_ids.push(n);
            }
        }

        return filter_nodes_ids;
    }

    static walkAST(file_name: string, version: string, imports: Import[]) {
        const compilation_result = SolcUtility.compile(file_name, version, imports);
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
