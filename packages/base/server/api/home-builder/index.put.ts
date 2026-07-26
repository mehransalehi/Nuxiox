import { settings } from "~~/server/database/schema.gen";
import { defaultHomeBuilder } from "~~/packages/base/utils/page-builder";
import type { HomeBuilder } from "~~/packages/base/types/page-builder";
import { upsert } from "~~/server/utils/db/upsert";
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const body = (await readBody(event)) as Partial<HomeBuilder>;

  console.log(typeof body)
  console.log(body)
  const payload: HomeBuilder = {
    version: body.version ?? defaultHomeBuilder.version,
    sections: Array.isArray(body.sections)
      ? body.sections
      : defaultHomeBuilder.sections,
  };

  const db = useDb(event);
  const now = new Date();
  await upsert(
    db,
    settings,
    {
      key: "home_sections",
      value: payload,
      description: "Home page sections builder",
      isPublic: true,
      updatedAt: now,
    },
    settings.key,
    {
      value: payload,
      description: "Home page sections builder",
      isPublic: true,
      updatedAt: now,
    },
  );

  return { success: true };
});
