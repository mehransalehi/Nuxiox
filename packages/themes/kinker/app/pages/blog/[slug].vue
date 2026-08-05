<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data } = await useFetch<any>(() => `/api/blog/posts/${slug.value}`)
const post = computed(() => data.value?.post ?? null)
const comments = ref(data.value?.comments ?? [])

const commentAuthor = ref('')
const commentText = ref('')

async function handleCommentSubmit(e: Event) {
  e.preventDefault()
  if (!commentText.value) return
  try {
    await $fetch(`/api/blog/posts/${slug.value}/comments`, {
      method: 'POST',
      body: { authorName: commentAuthor.value || undefined, content: commentText.value },
    })
    comments.value.unshift({ id: Date.now(), authorName: commentAuthor.value || $t('blog.yourName'), content: commentText.value, createdAt: new Date().toISOString(), likeCount: 0, replies: [] })
    commentAuthor.value = ''
    commentText.value = ''
  } catch (e) {
    // Comment failed — silently keep local state
  }
}

useHead(() => ({
  title: post.value?.title || '',
}))
</script>

<template>
  <div class="py-24">
    <div class="max-w-4xl mx-auto px-6 sm:px-12 space-y-10">
      <NuxtLink :to="$localePath('/blog')" class="text-sm font-bold hover:underline">
        &larr; {{ $t('blog.readMore') }}
      </NuxtLink>

      <div v-if="post">
        <h1 class="text-3xl sm:text-5xl font-bold">{{ post.title }}</h1>
        <img v-if="post.featuredImage" :src="post.featuredImage" :alt="post.title" class="w-full h-96 object-cover rounded-2xl my-8" />
        <div v-html="post.content" class="prose max-w-none" />
      </div>

      <div class="border-t pt-8 space-y-6">
        <h2 class="text-2xl font-bold">{{ $t('blog.comments') }} ({{ comments.length }})</h2>

        <form @submit="handleCommentSubmit" class="space-y-4">
          <input v-model="commentAuthor" :placeholder="$t('blog.yourName')" class="input input-bordered w-full" />
          <textarea v-model="commentText" :placeholder="$t('blog.yourComment')" class="textarea textarea-bordered w-full" rows="4" required></textarea>
          <button type="submit" class="btn btn-primary">{{ $t('blog.postComment') }}</button>
        </form>

        <div v-for="comment in comments" :key="comment.id" class="border p-4 rounded-xl space-y-1">
          <div class="flex items-center justify-between text-sm">
            <span class="font-bold">{{ comment.authorName || $t('blog.yourName') }}</span>
            <span class="text-gray-400">{{ comment.createdAt }}</span>
          </div>
          <p class="text-sm">{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
