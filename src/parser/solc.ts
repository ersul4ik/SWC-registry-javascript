import FileUtils from "../utils/file";
import Node from "../misc/node";

class Solc {
    static generateAST(file_name: string): Node {
        const file_content = FileUtils.getFileContent(file_name);

        return ast;
    }

}

export default Solc;
