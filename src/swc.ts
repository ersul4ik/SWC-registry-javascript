import swcDefinition from "./swc-definition.json";

class SWC {
  entries = swcDefinition as any;
  jsonValueForId(swcId: string) {
    return this.entries[swcId] ? this.entries[swcId] : {};
  }
  printForId(swcId: string) {
    if (this.entries[swcId]) {
      console.log("weekness detail:");
      console.log(this.entries[swcId].markdown);
    }
  }
}

export default SWC;
