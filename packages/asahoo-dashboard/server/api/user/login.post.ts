import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { users } from "~~/server/database/schema.gen";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues?.[0]?.message ?? "Invalid input",
    });
  }

  const { email, password } = parsed.data;
  const db = useDb(event);

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !user.password_hash || user.role !== "user") {
    throw createError({
      statusCode: 401,
      message: "Invalid credentials",
    });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw createError({
      statusCode: 401,
      message: "Invalid credentials",
    });
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      role: "user",
    },
  });

  return {
    success: true,
    user: {
      name: user.username,
      email: user.email,
    },
  };
});