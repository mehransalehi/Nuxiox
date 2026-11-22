import { defineEventHandler } from 'h3'
import { eq } from 'drizzle-orm'
import { users, userData } from '~~/server/database/schema.gen'
import { getCloudflareEnv } from '~~/server/utils/cloudflare'

const SUCCESS_HTML = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head><meta charset="utf-8"><title>اتصال اینستاگرام</title>
<style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f5f5f5}.card{background:#fff;padding:2rem;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.1);text-align:center;max-width:400px}.success{color:#16a34a;font-size:3rem}.title{font-size:1.25rem;font-weight:600;margin:.5rem 0}.text{color:#666;margin-bottom:1.5rem}.btn{display:inline-block;padding:.5rem 1.5rem;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none}</style></head>
<body><div class="card"><div class="success">✅</div><div class="title">حساب اینستاگرام با موفقیت متصل شد</div><div class="text">اکنون می‌توانید از پنل مدیریت استفاده کنید.</div><a href="/" class="btn">بازگشت به داشبورد</a></div></body></html>`

const ERROR_HTML = (msg: string) => `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head><meta charset="utf-8"><title>خطا</title>
<style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f5f5f5}.card{background:#fff;padding:2rem;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.1);text-align:center;max-width:400px}.error{color:#dc2626;font-size:3rem}.title{font-size:1.25rem;font-weight:600;margin:.5rem 0}.text{color:#666;margin-bottom:1.5rem}.btn{display:inline-block;padding:.5rem 1.5rem;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none}</style></head>
<body><div class="card"><div class="error">❌</div><div class="title">خطا در اتصال اینستاگرام</div><div class="text">${msg}</div><a href="/" class="btn">بازگشت به داشبورد</a></div></body></html>`

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { status, message, username, account_id, id } = query as Record<
    string,
    string | undefined
  >

  // ── 1. Check status ────────────────────────────────────────────────────
  if (status !== 'success') {
    console.warn('[instagram/callback] OAuth failed or was cancelled', {
      status,
      message,
    })
    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    return ERROR_HTML(message || 'مجوز دسترسی رد شد یا انصراف داده شد')
  }

  // ── 2. Validate required params ────────────────────────────────────────
  if (!account_id || !id) {
    console.warn('[instagram/callback] Missing account_id or user id', {
      account_id,
      id,
    })
    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    return ERROR_HTML('اطلاعات حساب کامل نیست')
  }

  const userId = Number(id)
  if (isNaN(userId)) {
    console.warn('[instagram/callback] Invalid user id', { id })
    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    return ERROR_HTML('شناسه کاربر نامعتبر است')
  }

  // ── 3. Look up user and upsert account data ────────────────────────────
  try {
    const db = useDb(event)

    // Verify user exists before upserting
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      console.warn('[instagram/callback] User not found', { userId })
      setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
      return ERROR_HTML('کاربر یافت نشد')
    }

    // Fetch full account details from BoxAPI to get IG user ID and internal token
    const cloudflareEnv = getCloudflareEnv(event)
    const boxApiKey = (cloudflareEnv as any).BOXAPI_API_KEY || process.env.BOXAPI_API_KEY
    let igUserId: string | null = username || null
    let internalToken: string | null = null

    if (boxApiKey) {
      try {
        const infoRes = await fetch('https://api.sendbox.chat/api/v1/service/info', {
          headers: { 'X-Api-Key': boxApiKey },
        })
        if (infoRes.ok) {
          const infoData = await infoRes.json() as any
          const accounts: any[] = infoData?.data?.accounts || []
          const matched = accounts.find((a: any) => a.id === account_id)
          if (matched) {
            igUserId = matched.instagram_user_id || igUserId
            internalToken = matched.internal_token || null
          }
        }
      } catch {
        // Best-effort — use what we have from the callback
      }
    }

    // Upsert Instagram account info into user_data
    await db
      .insert(userData)
      .values({
        user_id: userId,
        instagram_account_id: account_id,
        instagram_user_id: igUserId,
        instagram_access_token: internalToken,
        instagram_is_active: true,
      })
      .onConflictDoUpdate({
        target: (userData as any).user_id,
        set: {
          instagram_account_id: account_id,
          instagram_user_id: igUserId,
          instagram_access_token: internalToken,
          instagram_is_active: true,
          updated_at: new Date(),
        },
      })

    console.log('[instagram/callback] Instagram account saved', {
      userId,
      account_id,
      username,
      igUserId,
      hasToken: !!internalToken,
    })

    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    return SUCCESS_HTML
  } catch (error: any) {
    console.error('[instagram/callback] Error saving Instagram account', {
      error: error?.message || error,
      userId,
    })
    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    return ERROR_HTML('خطا در ذخیره اطلاعات حساب اینستاگرام')
  }
})