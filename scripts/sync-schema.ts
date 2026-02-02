import fs from 'node:fs';
import path from 'node:path';
// Use relative imports to your schema files
import * as mainSchema from '../server/database/schema';
// Add your layer imports here
// import * as authLayer from '../layers/auth/server/database/schema';

const allSchemas: any[] = [
  mainSchema,
  // authLayer 
];

const generateSchema = () => {
  const registry = new Map<string, { tableVar: string, importPath: string, priority: number }>();

  // Identify winners based on priority
  // Note: We are tracking which VARIABLE name won
  for (const schemaModule of allSchemas) {
    for (const [exportName, def] of Object.entries(schemaModule)) {
      const val = def as any;
      if (val.name && val.priority !== undefined) {
        const existing = registry.get(val.name);
        if (!existing || val.priority > existing.priority) {
          // We find the file path of the module to create the import string
          registry.set(val.name, { 
            tableVar: exportName, 
            importPath: './schema', // In a real script, map this to the actual file
            priority: val.priority 
          });
        }
      }
    }
  }

  // Build the static file content
  let content = `// AUTO-GENERATED FILE - DO NOT EDIT\n`;
  content += `import * as main from './schema';\n`;
  // Add other layer imports here if needed
  
  for (const [tableName, info] of registry) {
    content += `export const ${info.tableVar} = main.${info.tableVar}.table;\n`;
    console.log(`✅ Included table [${tableName}] from Main Schema (Priority ${info.priority})`);
  }

  fs.writeFileSync(path.join(process.cwd(), 'server/database/schema.gen.ts'), content);
};

generateSchema();