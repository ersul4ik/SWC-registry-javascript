import FileUtils from "../utils/file";
import Node from "../misc/node";
import SolcUtility from "../utils/solc";
import AstUtility from "../utils/ast";
import Location from "../misc/location";

const AstWalker = require('remix-lib').AstWalker
type AstType = any;

class Solc {

    static parseLocation(loc: any, range: any): Location {
        const r_start: number = range[0];
        const r_end: number = range[1];
        let src_2: number = r_end - r_start + 1;
        let src = `${r_start}:${src_2}:0`

        return new Location(
            loc.start.line,
            loc.end.line,
            loc.start.column,
            loc.end.column,
            src
        );
    }

    static walkAST(file_name: string) {
        const compilation_result = SolcUtility.compile(file_name);
        let walker = new AstWalker();
        let nodes: any[] = [];

        const callback = (node: any) => {
            nodes.push(node)
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
        })
        return nodes;
    }
}
export default Solc;
