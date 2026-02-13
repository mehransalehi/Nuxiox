<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, refresh } = await useFetch(() => `/api/blog/posts/${slug.value}`)
const { data: publicSettings } = await useFetch('/api/settings/public')

const commentForm = reactive({
  content: '',
  authorName: '',
  authorEmail: '',
  captchaToken: 'dev-token',
})

const replyTo = ref<number | null>(null)

const postComment = async () => {
  await $fetch(`/api/blog/posts/${slug.value}/comments`, {
    method: 'POST',
    body: {
      ...commentForm,
      parentId: replyTo.value,
    },
  })
  commentForm.content = ''
  replyTo.value = null
  await refresh()
}

const likeComment = async (id: number) => {
  await $fetch(`/api/blog/comments/${id}/like`, { method: 'POST' })
  await refresh()
}
</script>

<template>
  <article v-if="data" class="space-y-8">
    <header class="space-y-3">
      <h1 class="text-4xl font-bold">{{ data.post.title }}</h1>
      <p class="opacity-70">{{ data.post.excerpt }}</p>
      <img v-if="data.post.featuredImage" :src="data.post.featuredImage" :alt="data.post.title" class="w-full rounded-xl" />
    </header>

    <div class="prose max-w-none" v-html="data.post.content" />

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">Comments</h2>

      <div class="card bg-base-100 shadow">
        <div class="card-body space-y-3">
          <textarea v-model="commentForm.content" class="textarea textarea-bordered w-full" rows="4" placeholder="Write your comment..." />
          <div class="grid gap-3 md:grid-cols-2">
            <input v-model="commentForm.authorName" class="input input-bordered" placeholder="Your name (guest)" />
            <input v-model="commentForm.authorEmail" class="input input-bordered" placeholder="Your email (guest)" />
          </div>
          <input
            v-if="publicSettings?.blog?.recaptchaSiteKey"
            v-model="commentForm.captchaToken"
            class="input input-bordered"
            placeholder="Google Captcha token"
          />
          <div class="flex items-center gap-2">
            <button class="btn btn-primary" @click="postComment">Submit comment</button>
            <button v-if="replyTo" class="btn" @click="replyTo = null">Cancel reply</button>
          </div>
        </div>
      </div>

      <div v-for="comment in data.comments" :key="comment.id" class="card bg-base-100 shadow">
        <div class="card-body space-y-2">
          <p class="font-semibold">{{ comment.authorName || 'User' }}</p>
          <p>{{ comment.content }}</p>
          <div class="flex gap-2">
            <button class="btn btn-xs" @click="likeComment(comment.id)">👍 {{ comment.likeCount }}</button>
            <button class="btn btn-xs" @click="replyTo = comment.id">Reply</button>
          </div>

          <div v-if="comment.replies?.length" class="ms-4 border-s ps-4 space-y-2">
            <div v-for="reply in comment.replies" :key="reply.id" class="rounded-lg bg-base-200 p-3">
              <p class="font-semibold">{{ reply.authorName || 'User' }}</p>
              <p>{{ reply.content }}</p>
              <button class="btn btn-xs" @click="likeComment(reply.id)">👍 {{ reply.likeCount }}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>
