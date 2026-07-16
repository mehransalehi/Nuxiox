import type { AnyTable } from "drizzle-orm";

/**
 * Cross-driver UPSERT helper for Drizzle ORM.
 * Supports:
 * - SQLite / Cloudflare D1 -> onConflictDoUpdate()
 * - MySQL / MariaDB        -> onDuplicateKeyUpdate()
 */
export async function upsert<
  TTable extends AnyTable<any>,
  TValues extends Record<string, any>,
  TUpdate extends Partial<TValues>
>(
  db: any,                 // drizzle DB instance (any dialect)
  table: TTable,
  values: TValues,
  conflictTarget: any,     // usually table.primaryKey or table.column
  updateValues: TUpdate
) {
  const insertQuery = db.insert(table).values(values);
  // MySQL / MariaDB dialect
  if (typeof insertQuery.onDuplicateKeyUpdate === "function") {
    return insertQuery.onDuplicateKeyUpdate({
      set: updateValues,
    });
  }

  // SQLite / D1 dialect
  if (typeof insertQuery.onConflictDoUpdate === "function") {
    return insertQuery.onConflictDoUpdate({
      target: conflictTarget,
      set: updateValues,
    });
  }

  throw new Error(
    "upsert(): This database driver does not support UPSERT operations."
  );
}
