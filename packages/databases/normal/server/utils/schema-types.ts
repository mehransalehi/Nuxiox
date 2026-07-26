import type { MySqlTable } from "drizzle-orm/mysql-core";

export interface TableDefinition {
  name: string;
  priority: number;
  layer: {
    source: string;
    name: string;
  };
  table: MySqlTable;
}

// Helper to ensure type safety in layers
export const defineTable = (def: TableDefinition) => def;
