import swcDefinition from "./swc-definition.json";

class SWC {
  entry: any;
  content: any;
  entries = swcDefinition as any;

  constructor(id: string) {
    this.entry = this.entries[id] || {};
    this.content = this.entry.content || {};
  }

  getEntry = () => this.entry;

  getTitle = () => this.content && this.content.Title;

  getRelationships = () => this.content && this.content.Relationships;

  getDescription = () => this.content && this.content.Description;

  getRemediation = () => this.content && this.content.Remediation;

  getReferences = () => this.content && this.content.References;

  getSeverity = () => "Critical"; // this.content && this.content.Severity;

  displaySWC = () => ({
    "swc-title": this.getTitle(),
    "swc-relationships": this.getRelationships(),
    "swc-description": this.getDescription(),
    "swc-remediation": this.getRemediation(),
    "swc-references": this.getReferences(),
    "severity": this.getSeverity(),
  })

}

export default SWC;
