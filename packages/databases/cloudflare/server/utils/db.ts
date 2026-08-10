import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../database/schema.gen'
import { getCloudflareEnv } from '../../../../../server/utils/cloudflare'

export const useDb = (event: any) => {
  // This 'DB' must match the 'binding' name in your wrangler.toml
  const d1 = getCloudflareEnv(event).DB
  return drizzle(d1, { schema })
}