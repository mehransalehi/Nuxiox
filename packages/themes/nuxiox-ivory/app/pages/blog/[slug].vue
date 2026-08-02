<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Calendar, User, ThumbsUp, MessageSquare, CornerDownRight, Send, CheckCircle2 } from 'lucide-vue-next';

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

interface PostRecord {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  publishedAt: string;
}

const route = useRoute();
const slug = computed(() => route.params.slug as string);

const post = ref<PostRecord | null>(null);
const comments = ref<CommentNode[]>([]);
const isLoading = ref(true);

const commentContent = ref('');
const authorName = ref('');
const authorEmail = ref('');
const replyTo = ref<number | null>(null);

const statusMsg = ref('');
const errorMsg = ref('');
const recaptchaSiteKey = ref('');

const fetchPost = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(`/api/blog/posts/${slug.value}`);
    if (res.ok) {
      const data = await res.json();
      post.value = data.post;
      comments.value = data.comments || [];
      if (post.value?.title) {
        document.title = `${post.value.title} | Ivory Dental Blog`;
      }
    }

    const settingsRes = await fetch('/api/settings/public');
    if (settingsRes.ok) {
      const settingsData = await settingsRes.json();
      recaptchaSiteKey.value = settingsData.blog?.recaptchaSiteKey || '';
    }
  } catch (e) {
    console.error('Failed to load post', e);
  } finally {
    isLoading.value = false;
  }
};

const postComment = async () => {
  if (!commentContent.value.trim()) {
    errorMsg.value = 'Please enter your comment content.';
    return;
  }

  statusMsg.value = '';
  errorMsg.value = '';

  try {
    const body: Record<string, any> = {
      content: commentContent.value.trim(),
      authorName: authorName.value.trim() || 'Anonymous Patient',
      authorEmail: authorEmail.value.trim() || undefined, // CRITICAL: send undefined when empty string
      parentId: replyTo.value
    };

    if (recaptchaSiteKey.value) {
      body.captchaToken = 'dev-token';
    }

    const res = await fetch(`/api/blog/posts/${slug.value}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      commentContent.value = '';
      authorName.value = '';
      authorEmail.value = '';
      replyTo.value = null;
      statusMsg.value = 'Your comment has been published!';
      await fetchPost();
    } else {
      const errData = await res.json();
      errorMsg.value = errData.message || 'Could not post comment.';
    }
  } catch (e) {
    errorMsg.value = 'Network error posting comment.';
  }
};

const likeComment = async (id: number) => {
  try {
    const res = await fetch(`/api/blog/comments/${id}/like`, { method: 'POST' });
    if (res.ok) {
      await fetchPost();
    }
  } catch (e) {
    console.error('Failed to like comment', e);
  }
};

onMounted(() => {
  fetchPost();
});
</script>

<template>
  <div class="py-16 bg-white dark:bg-slate-900 transition-colors">
    <div class="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
      
      <div v-if="isLoading" class="text-center py-20 text-slate-500">
        Loading post...
      </div>

      <template v-else-if="post">
        <!-- Article Header -->
        <div class="space-y-4">
          <router-link to="/blog" class="text-xs font-bold text-[#00C4DF] hover:underline">
            ← Back to All Articles
          </router-link>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            {{ post.title }}
          </h1>

          <div class="flex items-center gap-4 text-xs text-slate-500">
            <span class="flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-[#00C4DF]" />
              {{ new Date(post.publishedAt).toLocaleDateString() }}
            </span>
            <span>•</span>
            <span class="font-medium text-slate-700 dark:text-slate-300">Ivory Clinical Advisory</span>
          </div>
        </div>

        <!-- Featured Image -->
        <div class="aspect-video rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
          <img 
            :src="post.featuredImage" 
            :alt="post.title"
            class="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <!-- HTML Article Body -->
        <div class="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-4" v-html="post.content"></div>

        <!-- Patient Discussion & Comments Section -->
        <div class="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-8">
          <div class="flex items-center justify-between">
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare class="w-6 h-6 text-[#00C4DF]" />
              <span>{{ $t('comments.title') }}</span>
            </h3>
            <span class="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {{ comments.length }} Comments
            </span>
          </div>

          <!-- Comment Submission Form -->
          <div class="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700 space-y-4">
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">
              {{ replyTo ? 'Replying to comment' : 'Leave a comment or question' }}
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                v-model="authorName"
                type="text" 
                :placeholder="$t('comments.authorName')"
                class="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
              <input 
                v-model="authorEmail"
                type="email" 
                :placeholder="$t('comments.authorEmail')"
                class="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <textarea 
              v-model="commentContent"
              rows="3"
              :placeholder="$t('comments.contentPlaceholder')"
              class="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            ></textarea>

            <div v-if="statusMsg" class="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-500" />
              <span>{{ statusMsg }}</span>
            </div>

            <div v-if="errorMsg" class="p-3 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs">
              {{ errorMsg }}
            </div>

            <div class="flex items-center justify-between">
              <button 
                v-if="replyTo"
                @click="replyTo = null"
                class="text-xs text-slate-500 hover:underline"
              >
                Cancel Reply
              </button>

              <button 
                @click="postComment"
                class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00C4DF] hover:bg-[#0284C7] text-white text-xs font-bold shadow-md ml-auto"
              >
                <Send class="w-3.5 h-3.5" />
                <span>{{ $t('comments.submit') }}</span>
              </button>
            </div>
          </div>

          <!-- Comment Tree -->
          <div class="space-y-6">
            <div 
              v-for="c in comments" 
              :key="c.id"
              class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-[#00C4DF] font-bold text-xs">
                    {{ (c.authorName || 'A')[0] }}
                  </div>
                  <div>
                    <h5 class="text-xs font-bold text-slate-900 dark:text-white">{{ c.authorName || 'Anonymous' }}</h5>
                    <span class="text-[10px] text-slate-400">{{ new Date(c.createdAt).toLocaleDateString() }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <button 
                    @click="likeComment(c.id)"
                    class="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#00C4DF]"
                  >
                    <ThumbsUp class="w-3.5 h-3.5" />
                    <span>{{ c.likeCount || 0 }}</span>
                  </button>

                  <button 
                    @click="replyTo = c.id"
                    class="text-[11px] font-semibold text-[#00C4DF] hover:underline"
                  >
                    Reply
                  </button>
                </div>
              </div>

              <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {{ c.content }}
              </p>

              <!-- Nested Replies -->
              <div v-if="c.replies?.length" class="pl-6 border-l-2 border-cyan-200 dark:border-cyan-900 space-y-4 pt-2">
                <div 
                  v-for="r in c.replies" 
                  :key="r.id"
                  class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CornerDownRight class="w-3.5 h-3.5 text-[#00C4DF]" />
                      {{ r.authorName }}
                    </span>
                    <button 
                      @click="likeComment(r.id)"
                      class="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#00C4DF]"
                    >
                      <ThumbsUp class="w-3 h-3" />
                      <span>{{ r.likeCount || 0 }}</span>
                    </button>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300">
                    {{ r.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </template>

    </div>
  </div>
</template>
