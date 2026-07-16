import { and, desc, eq, like, sql, asc } from 'drizzle-orm'
import {
  blogCategories,
  blogCategoriesLocales,
  blogPostCategories,
  blogPosts,
  blogPostsLocales,
} from '~~/server/database/schema.gen'
import { getLocale } from "~~/server/utils/getLocale";

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const locale = getLocale(event)

  const page = Math.max(1, Number(query.page ?? 1))
  const pageSize = Math.min(20, Math.max(1, Number(query.pageSize ?? 6)))

  const search = String(query.search ?? '').trim()
  const category = String(query.category ?? '').trim()
  const sort = String(query.sort ?? 'newest')

  const db = useDb(event)

  const conditions = [
    eq(blogPosts.status, 'published'),
    eq(blogPostsLocales.locale, locale),
  ]

  if (search) {
    conditions.push(like(blogPostsLocales.title, `%${search}%`))
  }

  const base = db
    .select({
      id: blogPosts.id,
      title: blogPostsLocales.title,
      slug: blogPostsLocales.slug,
      excerpt: blogPostsLocales.excerpt,
      featuredImage: blogPosts.featuredImage,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
    })
    .from(blogPosts)
    .innerJoin(
      blogPostsLocales,
      eq(blogPostsLocales.postId, blogPosts.id),
    )

  const withCategory = category
    ? base
      .innerJoin(blogPostCategories, eq(blogPostCategories.postId, blogPosts.id))
      .innerJoin(blogCategories, eq(blogCategories.id, blogPostCategories.categoryId))
      .innerJoin(
        blogCategoriesLocales,
        and(
          eq(blogCategoriesLocales.categoryId, blogCategories.id),
          eq(blogCategoriesLocales.locale, locale),
        ),
      )
      .where(and(...conditions, eq(blogCategoriesLocales.slug, category)))
    : base.where(and(...conditions))

  const orderBy = sort === 'oldest'
    ? asc(blogPosts.publishedAt)
    : sort === 'title'
      ? asc(blogPostsLocales.title)
      : desc(blogPosts.publishedAt)

  const items = await withCategory
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .orderBy(orderBy)

  const countRows = category
    ? await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts)
      .innerJoin(blogPostsLocales, eq(blogPostsLocales.postId, blogPosts.id))
      .innerJoin(blogPostCategories, eq(blogPostCategories.postId, blogPosts.id))
      .innerJoin(blogCategories, eq(blogCategories.id, blogPostCategories.categoryId))
      .innerJoin(
        blogCategoriesLocales,
        and(
          eq(blogCategoriesLocales.categoryId, blogCategories.id),
          eq(blogCategoriesLocales.locale, locale),
        ),
      )
      .where(and(...conditions, eq(blogCategoriesLocales.slug, category)))
    : await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts)
      .innerJoin(blogPostsLocales, eq(blogPostsLocales.postId, blogPosts.id))
      .where(and(...conditions))

  const total = Number(countRows[0]?.count ?? 0)

  const categories = await db
    .select({
      id: blogCategories.id,
      name: blogCategoriesLocales.name,
      slug: blogCategoriesLocales.slug,
      count: sql<number>`count(${blogPostCategories.postId})`,
    })
    .from(blogCategories)
    .innerJoin(
      blogCategoriesLocales,
      and(
        eq(blogCategoriesLocales.categoryId, blogCategories.id),
        eq(blogCategoriesLocales.locale, locale),
      ),
    )
    .leftJoin(blogPostCategories, eq(blogPostCategories.categoryId, blogCategories.id))
    .groupBy(
      blogCategories.id,
      blogCategoriesLocales.name,
      blogCategoriesLocales.slug,
    )
    .orderBy(asc(blogCategoriesLocales.name))

  return {
    items,
    categories,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  }
})
