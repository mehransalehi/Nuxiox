<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, refresh } = await useFetch(() => `/api/blog/posts/${slug.value}`)
const { data: publicSettings } = await useFetch('/api/settings/public')
const seo = computed(() => (data.value?.post?.seo ?? {}) as Record<string, string>)

useHead(() => ({
  title: seo.value.title || data.value?.post?.title || publicSettings.value?.seo?.defaultTitle || 'Blog',
  meta: [
    { name: 'description', content: seo.value.description || data.value?.post?.excerpt || publicSettings.value?.seo?.defaultDescription || '' },
    { property: 'og:title', content: seo.value.ogTitle || seo.value.title || data.value?.post?.title || '' },
    { property: 'og:description', content: seo.value.ogDescription || seo.value.description || data.value?.post?.excerpt || '' },
    { property: 'og:image', content: seo.value.ogImage || data.value?.post?.featuredImage || publicSettings.value?.seo?.defaultOgImage || '' },
  ].filter((item) => item.content),
}))

const commentForm = reactive({ content: '', authorName: '', authorEmail: '', captchaToken: 'dev-token' })
const replyTo = ref<number | null>(null)
const toastStore = useToastStore()

const postComment = async () => {
  if (!commentForm.content.trim() || !commentForm.authorName.trim() || !commentForm.authorEmail.trim()) {
    toastStore.push($t('sections.comments.required'), 'error')
    return
  }
  const response = await $fetch<{ status: 'pending' | 'approved' }>(`/api/blog/posts/${slug.value}/comments`, {
    method: 'POST',
    body: { ...commentForm, parentId: replyTo.value },
  })
  commentForm.content = ''
  commentForm.authorName = ''
  commentForm.authorEmail = ''
  replyTo.value = null
  toastStore.push(response.status === 'pending' ? 'Comment sent successfully. It will be shown after admin approval.' : 'Comment sent successfully.', 'success')
  await refresh()
}

const likeComment = async (id: number) => {
  await $fetch(`/api/blog/comments/${id}/like`, { method: 'POST' })
  await refresh()
}
</script>

<template>
  <article v-if="data" class="space-y-8 pt-24 pb-12 px-6 max-w-4xl mx-auto">
    <!-- Post Header -->
    <header data-reveal class="clay-card !rounded-[24px] !p-8 md:!p-10" style="background: white;">
      <div class="inline-block clay-card !rounded-full !px-4 !py-1 text-sm font-semibold mb-4"
        style="background: var(--kids-bg-alt); color: var(--kids-primary-dark);">
        📖 Article
      </div>
      <h1 class="font-fredoka text-3xl md:text-5xl font-bold leading-tight" style="color: var(--kids-text);">
        {{ data.post.title }}
      </h1>
      <p class="mt-3 text-lg" style="color: var(--kids-text-muted);">{{ data.post.excerpt }}</p>
      <img
        v-if="data.post.featuredImage"
        :src="data.post.featuredImage"
        :alt="data.post.title"
        class="mt-6 w-full rounded-[20px] clay-card"
        loading="lazy"
      />
    </header>

    <!-- Post Content -->
    <div class="clay-card !rounded-[24px] !p-8 md:!p-10 leading-relaxed" style="background: white;" v-html="data.post.content" />

    <!-- Comments Section -->
    <section v-if="publicSettings?.blog?.commentsEnabled" class="space-y-6">
      <h2 class="font-fredoka text-3xl font-bold" style="color: var(--kids-text);">💬 Comments</h2>

      <!-- Comment Form -->
      <div class="clay-card !rounded-[20px] !p-6" style="background: white;" data-reveal>
        <textarea
          v-model="commentForm.content"
          class="w-full rounded-xl border-2 !outline-none p-4 text-sm min-h-[120px]"
          style="border-color: var(--kids-border); background: var(--kids-bg);"
          rows="4"
          placeholder="Write your comment..."
        />
        <div class="mt-3 grid gap-3 md:grid-cols-2">
          <input
            v-model="commentForm.authorName"
            class="rounded-xl border-2 !outline-none px-4 py-3 text-sm"
            style="border-color: var(--kids-border); background: var(--kids-bg);"
            placeholder="Your name"
          />
          <input
            v-model="commentForm.authorEmail"
            class="rounded-xl border-2 !outline-none px-4 py-3 text-sm"
            style="border-color: var(--kids-border); background: var(--kids-bg);"
            placeholder="Your email"
          />
        </div>
        <input
          v-if="publicSettings?.blog?.recaptchaSiteKey"
          v-model="commentForm.captchaToken"
          class="rounded-xl border-2 !outline-none px-4 py-3 text-sm mt-3 w-full"
          style="border-color: var(--kids-border); background: var(--kids-bg);"
          placeholder="Google Captcha token"
        />
        <div class="mt-4 flex items-center gap-3">
          <button class="clay-btn clay-btn-accent text-sm" @click="postComment">
            Submit Comment →
          </button>
          <button v-if="replyTo" class="clay-btn clay-btn-outline text-sm !py-2" @click="replyTo = null">
            Cancel Reply
          </button>
        </div>
      </div>

      <!-- Comments List -->
      <div
        v-for="comment in data.comments"
        :key="comment.id"
        class="clay-card !rounded-[20px] !p-5"
        style="background: white;"
        data-reveal
      >
        <div class="flex items-center gap-3 mb-2">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
            style="background: var(--kids-bg-alt);">
            👤
          </div>
          <div>
            <p class="font-fredoka font-bold text-sm" style="color: var(--kids-text);">{{ comment.authorName || 'User' }}</p>
          </div>
        </div>
        <p class="text-sm leading-relaxed" style="color: var(--kids-text-muted);">{{ comment.content }}</p>
        <div class="mt-3 flex gap-3">
          <button class="clay-btn !rounded-full !py-1 !px-3 text-xs clay-btn-outline" @click="likeComment(comment.id)">
            👍 {{ comment.likeCount }}
          </button>
          <button class="clay-btn !rounded-full !py-1 !px-3 text-xs clay-btn-outline" @click="replyTo = comment.id">
            💬 Reply
          </button>
        </div>

        <!-- Replies -->
        <div v-if="comment.replies?.length" class="mt-4 space-y-3 ps-5 border-s-2" style="border-color: var(--kids-border);">
          <div
            v-for="reply in comment.replies"
            :key="reply.id"
            class="clay-card !rounded-xl !p-4"
            style="background: var(--kids-bg-alt);"
          >
            <p class="font-fredoka font-bold text-sm" style="color: var(--kids-text);">{{ reply.authorName || 'User' }}</p>
            <p class="text-sm mt-1" style="color: var(--kids-text-muted);">{{ reply.content }}</p>
            <button class="clay-btn !rounded-full !py-1 !px-3 text-xs clay-btn-outline mt-2" @click="likeComment(reply.id)">
              👍 {{ reply.likeCount }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>