import swcDefinition from "./swc-definition.json";

class SWC {
  entries = swcDefinition as any;

  jsonValueForId(swcId: string) {
    return this.entries[swcId] || {};
  }

  printForId(swcId: string) {
    if (this.entries[swcId]) {
      console.log(this.entries[swcId].markdown);
    }
  }

  getTitle(swcId: string) {
    const { content } = this.entries[swcId];
    return content && content.Title;
  }

  getRelationships(swcId: string) {
    const { content } = this.entries[swcId];
    return content && content.Relationships;
  }
  getDescription(swcId: string) {
    const { content } = this.entries[swcId];
    return content && content.Description;
  }
  getRemediation(swcId: string) {
    const { content } = this.entries[swcId];
    return content && content.Remediation;
  }
  getReferences(swcId: string) {
    const { content } = this.entries[swcId];
    return content && content.References;
  }
  getSeverity(swcId: string) {
    const { content } = this.entries[swcId];
    return content && content.Severity;
  }

}

export default SWC;
