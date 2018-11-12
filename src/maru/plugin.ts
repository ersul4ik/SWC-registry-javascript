import { IssuePointer } from "./issue";

export interface Plugin {
    (ast: any, plugin_config: any): IssuePointer[];
}
