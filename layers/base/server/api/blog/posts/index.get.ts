import { and, desc, eq, like, sql, asc } from 'drizzle-orm'
import { blogCategories, blogPostCategories, blogPosts } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page ?? 1))
  const pageSize = Math.min(20, Math.max(1, Number(query.pageSize ?? 6)))
  const search = String(query.search ?? '').trim()
  const category = String(query.category ?? '').trim()
  const sort = String(query.sort ?? 'newest')

  const db = useDb(event)

  const conditions = [eq(blogPosts.status, 'published')]
  if (search) {
    conditions.push(like(blogPosts.title, `%${search}%`))
  }

  const base = db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      featuredImage: blogPosts.featuredImage,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
    })
    .from(blogPosts)

  const withCategory = category
    ? base
      .innerJoin(blogPostCategories, eq(blogPostCategories.postId, blogPosts.id))
      .innerJoin(blogCategories, eq(blogCategories.id, blogPostCategories.categoryId))
      .where(and(...conditions, eq(blogCategories.slug, category)))
    : base.where(and(...conditions))

  const orderBy = sort === 'oldest'
    ? asc(blogPosts.publishedAt)
    : sort === 'title'
      ? asc(blogPosts.title)
      : desc(blogPosts.publishedAt)

  const items = await withCategory.limit(pageSize).offset((page - 1) * pageSize).orderBy(orderBy)

  const countRows = category
    ? await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts)
      .innerJoin(blogPostCategories, eq(blogPostCategories.postId, blogPosts.id))
      .innerJoin(blogCategories, eq(blogCategories.id, blogPostCategories.categoryId))
      .where(and(...conditions, eq(blogCategories.slug, category)))
    : await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts)
      .where(and(...conditions))

  const total = Number(countRows[0]?.count ?? 0)

  const categories = await db
    .select({
      id: blogCategories.id,
      name: blogCategories.name,
      slug: blogCategories.slug,
      count: sql<number>`count(${blogPostCategories.postId})`,
    })
    .from(blogCategories)
    .leftJoin(blogPostCategories, eq(blogPostCategories.categoryId, blogCategories.id))
    .groupBy(blogCategories.id)
    .orderBy(asc(blogCategories.name))

  return {
    items,
    categories,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  }
})
