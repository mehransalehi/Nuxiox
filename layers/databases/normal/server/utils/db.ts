import mysql from "mysql2/promise"
import { drizzle } from "drizzle-orm/mysql2"
import * as schema from "../database/schema.gen"

let pool: mysql.Pool

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 10,
    })
  }

  return pool
}

export const useDb = (event: any) => {
  const db = drizzle(getPool(), { schema,mode: "default" })
  return db
}
