"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swc_definition_json_1 = __importDefault(require("./swc-definition.json"));
class SWC {
    constructor() {
        this.entries = swc_definition_json_1.default;
    }
    jsonValueForId(swcId) {
        return this.entries[swcId] ? this.entries[swcId] : {};
    }
    printForId(swcId) {
        if (this.entries[swcId]) {
            console.log(this.entries[swcId].markdown);
        }
    }
    getTitle(swcId) {
        return this.entries[swcId]['content'];
    }
}
exports.default = SWC;
