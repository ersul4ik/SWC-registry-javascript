/**
 * Parse SWC entries cotnent from SWC - registry repo and generate 'src/swc-definition.json' file
 */

const path = require("path");
const fs = require("fs");

const entriesPath = path.resolve(__dirname, "test", "SWC-registry", "entries");
const templatePath = path.resolve(__dirname, "test", "SWC-registry", "entries", "SWC-100.md"); //chocie one of the file as template
const outputPath = path.resolve(__dirname, "src", "swc-definition.json");

/**
 * get SWC entries markdown titles for each section
 *
 * @param templatePath template file location
 */
const parseTemplateFile = (templateFilePath: string) => {
  const templateContent = fs.readFileSync(templateFilePath).toString();
  return templateContent
    .split("\n")
    .filter((line: string) => {
      return line.trim().startsWith("#");
    });
};

/**
 *
 * parse SWC entries 's content, and store each section by titles and return json object
 *
 * @param entriesPath  SWC entries's location
 * @param titles       SWC template.md's titles
 */
const parseDefinetionFile = (entriesFilePath: string, titles: string[]) => {
  const entries: { [key: string]: any } = {};
  fs
    .readdirSync(entriesPath)
    .forEach((file: string) => {
      if (file.match(/^SWC\-[0-9]+\.md$/)) {
        const swcId = file.replace(".md", "");
        const swcContent = fs.readFileSync(path.join(entriesFilePath, file)).toString();

        const content: any = {};
        let currentSectionIndex: number = 0;
        const lines = swcContent.split("\n");
        const indexs: any = {};

        lines.forEach((line: string, index: number) => {
          if (line === titles[currentSectionIndex]) {
            indexs[currentSectionIndex] = index;
            currentSectionIndex = currentSectionIndex + 1;
          }
        });

        titles.forEach((key: string, index: number) => {
          if (index < titles.length - 1) {
            const keys = key
              .replace(/\#/g, "")
              .trim();
            content[keys] = lines.slice(indexs[index] + 1, indexs[index + 1])
              .join("\n")
              .trim();
          }
        });

        entries[swcId] = {
          markdown: swcContent,
          content,
        };
      }
    });
  return entries;
};

const titles = parseTemplateFile(templatePath);
const entries = parseDefinetionFile(entriesPath, titles);
console.log(`Scan ${entriesPath} and found these entries:`);
console.log(Object.keys(entries));
fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
console.log(`Generate swc-definition.json successfully`);
