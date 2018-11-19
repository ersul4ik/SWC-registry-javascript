import { IssuePointer } from "./issue";
import SolFile from "./sol_file";
import PluginConfig from "./plugin_config";

export interface Plugin {
    (sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[];
}
