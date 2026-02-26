<script setup lang="ts">
import { useToastStore } from '~~/layers/base/app/stores/toast'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, refresh } = await useFetch(() => `/api/blog/posts/${slug.value}`)
const { data: publicSettings } = await useFetch('/api/settings/public')
const seo = computed(() => (data.value?.post?.seo ?? {}) as Record<string, string>)

useHead(() => ({
  title: seo.value.title || data.value?.post?.title || publicSettings.value?.seo?.defaultTitle || 'Blog',
  link: [seo.value.canonical ? { rel: 'canonical', href: seo.value.canonical } : undefined].filter(Boolean),
  meta: [
    { name: 'description', content: seo.value.description || data.value?.post?.excerpt || publicSettings.value?.seo?.defaultDescription || '' },
    { property: 'og:title', content: seo.value.ogTitle || seo.value.title || data.value?.post?.title || '' },
    { property: 'og:description', content: seo.value.ogDescription || seo.value.description || data.value?.post?.excerpt || '' },
    { property: 'og:image', content: seo.value.ogImage || data.value?.post?.featuredImage || publicSettings.value?.seo?.defaultOgImage || '' },
    { name: 'robots', content: seo.value.robots || publicSettings.value?.seo?.robots || 'index,follow' },
  ].filter((item) => item.content),
}))

const commentForm = reactive({
  content: '',
  authorName: '',
  authorEmail: '',
  captchaToken: 'dev-token',
})

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
  <article v-if="data" class="space-y-8">
    <header class="space-y-4 rounded-[2rem] bg-[#eaf6ff] p-6 md:p-8">
      <h1 class="text-4xl font-extrabold">{{ data.post.title }}</h1>
      <p class="opacity-75">{{ data.post.excerpt }}</p>
      <img v-if="data.post.featuredImage" :src="data.post.featuredImage" :alt="data.post.title" class="w-full rounded-2xl" loading="lazy">
    </header>

    <div class="prose max-w-none prose-img:rounded-xl" v-html="data.post.content" />

    <section v-if="publicSettings?.blog?.commentsEnabled" class="space-y-4">
      <h2 class="text-3xl font-bold">Comments</h2>

      <div class="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
        <textarea v-model="commentForm.content" class="textarea textarea-bordered w-full rounded-2xl" rows="4" placeholder="Write your comment..." />
        <div class="mt-3 grid gap-3 md:grid-cols-2">
          <input v-model="commentForm.authorName" class="input input-bordered rounded-full" placeholder="Your name" />
          <input v-model="commentForm.authorEmail" class="input input-bordered rounded-full" placeholder="Your email" />
        </div>
        <input v-if="publicSettings?.blog?.recaptchaSiteKey" v-model="commentForm.captchaToken" class="input input-bordered mt-3 w-full rounded-full" placeholder="Google Captcha token" />
        <div class="mt-4 flex items-center gap-2">
          <button class="btn rounded-full border-none bg-sky-600 text-white hover:bg-sky-700" @click="postComment">Submit comment</button>
          <button v-if="replyTo" class="btn" @click="replyTo = null">Cancel reply</button>
        </div>
      </div>

      <div v-for="comment in data.comments" :key="comment.id" class="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
        <p class="font-semibold">{{ comment.authorName || 'User' }}</p>
        <p class="mt-1">{{ comment.content }}</p>
        <div class="mt-3 flex gap-2">
          <button class="btn btn-xs" @click="likeComment(comment.id)">👍 {{ comment.likeCount }}</button>
          <button class="btn btn-xs" @click="replyTo = comment.id">Reply</button>
        </div>

        <div v-if="comment.replies?.length" class="mt-4 space-y-2 border-s-2 border-sky-200 ps-4">
          <div v-for="reply in comment.replies" :key="reply.id" class="rounded-2xl bg-sky-50 p-3">
            <p class="font-semibold">{{ reply.authorName || 'User' }}</p>
            <p>{{ reply.content }}</p>
            <button class="btn btn-xs mt-2" @click="likeComment(reply.id)">👍 {{ reply.likeCount }}</button>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>
