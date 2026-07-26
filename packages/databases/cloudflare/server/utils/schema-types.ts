import type { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";

export interface TableDefinition {
  name: string;
  priority: number;
  layer: {
    source : string;
    name : string
  },
  table: SQLiteTableWithColumns<any>;
}

// Helper to ensure type safety in layers
export const defineTable = (def: TableDefinition) => def;