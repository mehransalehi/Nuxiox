import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { z } from 'zod'
import { useDb } from '~~/server/utils/db'
import { users } from "~~/server/database/schema.gen";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // 1️⃣ Validate input
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            statusMessage:
                parsed.error.issues?.[0]?.message ?? "Invalid input",
        })
    }

    const { email, password } = parsed.data
    const db = useDb(event)

    // 2️⃣ Check if any admin exists
    const existingAdmin = await db.query.users.findFirst({
        where: eq(users.role, 'admin'),
    })

    // 3️⃣ FIRST LOGIN BOOTSTRAP
    if (!existingAdmin) {
        const passwordHash = await bcrypt.hash(password, 10)

        const [admin] = await db
            .insert(users)
            .values({
                username: email.split('@')[0],
                email,
                passwordHash,
                role: 'admin',
            })
            .returning()

        if (admin) {
            await setUserSession(event, {
                user: {
                    id: admin.id,
                    email: admin.email,
                    role: admin.role,
                },
            })

            return {
                firstLogin: true,
                user: {
                    id: admin.id,
                    email: admin.email,
                    role: admin.role,
                },
            }
        } else {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid credentials',
            })
        }
    }

    // 4️⃣ Normal login flow
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    })

    if (!user || !user.passwordHash) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials',
        })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials',
        })
    }

    // 5️⃣ Create session
    await setUserSession(event, {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    })

    return {
        success: true,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    }
})
