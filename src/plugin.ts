import { IssuePointer } from "./issue";

export interface Plugin {
    (ast: any): IssuePointer[];
}
