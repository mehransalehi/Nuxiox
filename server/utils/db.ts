import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../database/index'

export const useDb = (event: any) => {
  // This 'DB' must match the 'binding' name in your wrangler.toml
  const d1 = event.context.cloudflare.env.DB
  return drizzle(d1, { schema })
}