<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Calendar, Heart, MessageSquare, Send, ArrowLeft, User, CheckCircle2 } from 'lucide-vue-next';

interface CommentNode {
  id: number;
  postId: number;
  userId: number | null;
  parentId: number | null;
  authorName: string | null;
  content: string;
  likeCount: number;
  createdAt: string;
  replies: CommentNode[];
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  publishedAt: string | null;
  createdAt: string;
}

const route = useRoute();
const post = ref<BlogPost | null>(null);
const comments = ref<CommentNode[]>([]);
const loading = ref(true);

const authorName = ref('');
const authorEmail = ref('');
const commentContent = ref('');
const replyingToId = ref<number | null>(null);
const submittingComment = ref(false);
const statusMessage = ref('');

const { data: publicSettings } = await useFetch('/api/settings/public')

const fetchPost = async (slugParam: string) => {
  try {
    loading.value = true;
    const res = await fetch(`/api/blog/posts/${slugParam}`);
    if (res.ok) {
      const data = await res.json();
      post.value = data.post;
      comments.value = data.comments || [];
    }
  } catch (err) {
    console.error('Error fetching blog post:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const slug = route.params.slug as string;
  if (slug) fetchPost(slug);
});

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) fetchPost(newSlug as string);
});

const submitComment = async () => {
  if (!commentContent.value || !post.value) return;
  statusMessage.value = '';

  try {
    submittingComment.value = true;
    const res = await fetch(`/api/blog/posts/${post.value.slug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authorName: authorName.value || 'Patient Guest',
        authorEmail: authorEmail.value || undefined,
        content: commentContent.value,
        parentId: replyingToId.value,
        ...(publicSettings?.value?.blog?.recaptchaSiteKey ? { captchaToken: 'dev-token' } : {}),
      })
    });

    const body = await res.json().catch(() => ({}));

    if (res.ok) {
      commentContent.value = '';
      authorName.value = '';
      authorEmail.value = '';
      replyingToId.value = null;
      statusMessage.value = 'Comment submitted successfully.';
      fetchPost(post.value.slug);
    } else {
      statusMessage.value = body?.message || body?.statusMessage || `Failed to post comment (${res.status})`;
    }
  } catch (err) {
    console.error('Error posting comment:', err);
    statusMessage.value = 'Network error — could not post comment.';
  } finally {
    submittingComment.value = false;
  }
};

const likeComment = async (commentId: number) => {
  try {
    const res = await fetch(`/api/blog/comments/${commentId}/like`, { method: 'POST' });
    if (res.ok && post.value) {
      fetchPost(post.value.slug);
    }
  } catch (err) {
    console.error('Error liking comment:', err);
  }
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};
</script>

<template>
  <div class="py-12 px-4 sm:px-8 max-w-4xl mx-auto space-y-10">
    <a href="/#blog" class="inline-flex items-center gap-2 text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline">
      <ArrowLeft class="w-4 h-4" />
      <span>Back to Dental Articles</span>
    </a>

    <div v-if="loading" class="space-y-6 animate-pulse">
      <div class="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4"></div>
      <div class="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
    </div>

    <article v-else-if="post" class="space-y-8">
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
          <Calendar class="w-4 h-4" />
          <span>Published {{ formatDate(post.publishedAt) }}</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {{ post.title }}
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-300 italic border-l-4 border-teal-500 pl-4 py-1">
          {{ post.excerpt }}
        </p>
      </div>

      <img 
        v-if="post.featuredImage" 
        :src="post.featuredImage" 
        :alt="post.title"
        class="w-full h-80 sm:h-96 object-cover rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md"
      />

      <div class="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-4" v-html="post.content"></div>

      <!-- Threaded Comments Section -->
      <div class="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-8">
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare class="w-6 h-6 text-teal-600" />
            <span>Patient Discussions & Comments ({{ comments.length }})</span>
          </h3>
        </div>

        <!-- Add Comment Form -->
        <div class="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h4 class="font-bold text-slate-900 dark:text-white text-base">
            {{ replyingToId ? 'Replying to Comment' : 'Leave a Comment / Question' }}
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input 
              v-model="authorName"
              type="text" 
              placeholder="Your Name" 
              class="px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
            />
            <input 
              v-model="authorEmail"
              type="email" 
              placeholder="Your Email (Optional)" 
              class="px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
            />
          </div>

          <textarea 
            v-model="commentContent"
            rows="3" 
            placeholder="Write your comment or question about this procedure..."
            class="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
          ></textarea>

          <div class="flex items-center justify-between">
            <button 
              v-if="replyingToId" 
              @click="replyingToId = null" 
              class="text-xs text-slate-500 underline"
            >
              Cancel Reply
            </button>
            <div class="flex items-center gap-3 ml-auto">
              <span v-if="statusMessage" class="text-xs font-medium" :class="statusMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'">{{ statusMessage }}</span>
              <button 
                type="button"
                @click="submitComment"
                :disabled="submittingComment"
                class="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition ml-auto flex items-center gap-2"
              >
                <Send class="w-3.5 h-3.5" />
                <span>{{ submittingComment ? 'Submitting...' : 'Post Comment' }}</span>
              </button>
          </div>
        </div>
        </div>

        <!-- Comments List -->
        <div class="space-y-4">
          <div v-for="c in comments" :key="c.id" class="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center">
                  {{ (c.authorName || 'P')[0] }}
                </div>
                <div>
                  <span class="font-bold text-sm text-slate-900 dark:text-white">{{ c.authorName || 'Visitor' }}</span>
                  <span class="text-[10px] text-slate-400 block">{{ formatDate(c.createdAt) }}</span>
                </div>
              </div>

              <button 
                @click="likeComment(c.id)"
                class="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-xs font-semibold rounded-lg transition"
              >
                <Heart class="w-3.5 h-3.5 fill-current" />
                <span>{{ c.likeCount }}</span>
              </button>
            </div>

            <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{{ c.content }}</p>

            <!-- Nested Replies -->
            <div v-if="c.replies && c.replies.length" class="pl-6 border-l-2 border-teal-500/30 space-y-3 pt-2">
              <div v-for="reply in c.replies" :key="reply.id" class="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs text-teal-600 dark:text-teal-400">{{ reply.authorName }}</span>
                  <button @click="likeComment(reply.id)" class="text-[11px] text-slate-500 flex items-center gap-1">
                    <Heart class="w-3 h-3" /> {{ reply.likeCount }}
                  </button>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300">{{ reply.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
