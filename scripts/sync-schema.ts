import fs from 'node:fs';
import path from 'node:path';
// Use relative imports to your schema files
import * as mainSchema from '../server/database/schema';
// Add your layer imports here
import * as baseLayer from '../layers/base/server/database/schema';

const allSchemas: any[] = [
  mainSchema,
  baseLayer
];

const generateSchema = () => {
  const registry = new Map<string, { tableVar: string, importPath: string, layerName: string, priority: number }>();

  let content = `// AUTO-GENERATED FILE - DO NOT EDIT\n`;
  // Identify winners based on priority
  // Note: We are tracking which VARIABLE name won
  for (const schemaModule of allSchemas) {
    let moduleImported = false;
    for (const [exportName, def] of Object.entries(schemaModule)) {
      const val = def as any;
      if (val.name && val.priority !== undefined) {
        const existing = registry.get(val.name);
        if (!existing || val.priority > existing.priority) {
          // We find the file path of the module to create the import string
          registry.set(val.name, {
            tableVar: exportName,
            importPath: val.layer.source, // In a real script, map this to the actual file
            layerName: val.layer.name,
            priority: val.priority
          });
          //just import the schema module once
          if (!moduleImported) {
            // Build the static file content
            content += `import * as ${val.layer.name} from '${val.layer.source}';\n`;
            moduleImported = true;
          }
        }
      }
    }
  }

  // Add other layer imports here if needed

  for (const [tableName, info] of registry) {
    content += `export const ${info.tableVar} = ${info.layerName}.${info.tableVar}.table;\n`;
    console.log(`✅ Included table [${tableName}] from ${info.layerName} Schema (Priority ${info.priority})`);
  }

  fs.writeFileSync(path.join(process.cwd(), 'server/database/schema.gen.ts'), content);
};

generateSchema();