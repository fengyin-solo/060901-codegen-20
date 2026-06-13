<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMemorial } from '@/composables/useMemorial'
import { TOPIC_EMOJIS, TOPIC_NAMES } from '@/types'
import { formatDate } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()
const { 
  currentAlbum, 
  loadMemorialAlbum, 
  loadMemorialAlbumByRoom,
  generateMemorialAlbum,
  loadMemorialAlbums 
} = useMemorial()

const notFound = ref(false)

const albumId = computed(() => route.params.id as string)
const isRoomRoute = computed(() => route.name === 'room-album')

const durationText = computed(() => {
  if (!currentAlbum.value) return ''
  const start = new Date(currentAlbum.value.createdAt)
  const end = new Date(currentAlbum.value.endedAt)
  const diffMs = end.getTime() - start.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMins / 60)
  
  if (diffHours > 0) {
    const remainingMins = diffMins % 60
    return `聚会时长 ${diffHours} 小时 ${remainingMins} 分钟`
  }
  return `聚会时长 ${diffMins} 分钟`
})

onMounted(() => {
  loadMemorialAlbums()
  
  let success = false
  if (isRoomRoute.value) {
    success = loadMemorialAlbumByRoom(albumId.value)
    if (!success) {
      const album = generateMemorialAlbum(albumId.value)
      success = !!album
    }
  } else {
    success = loadMemorialAlbum(albumId.value)
  }
  
  if (!success) {
    notFound.value = true
  }
})

const goBack = () => {
  if (isRoomRoute.value) {
    router.push(`/room/${albumId.value}`)
  } else {
    router.push('/')
  }
}

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div 
    v-if="notFound"
    class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4"
  >
    <div class="text-center">
      <div class="text-6xl mb-4">📭</div>
      <h2 class="text-xl font-bold text-gray-800 mb-2">纪念册不存在</h2>
      <p class="text-gray-500 mb-6">这个纪念册可能已经过期或被删除了</p>
      <button 
        class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        @click="goToHome"
      >
        返回首页
      </button>
    </div>
  </div>

  <div 
    v-else-if="currentAlbum"
    class="memorial-album-page min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
  >
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-10 text-6xl opacity-10">✨</div>
      <div class="absolute top-20 right-20 text-5xl opacity-10">🌟</div>
      <div class="absolute bottom-20 left-20 text-5xl opacity-10">💫</div>
      <div class="absolute bottom-10 right-10 text-6xl opacity-10">📖</div>
    </div>

    <div class="relative z-10 max-w-4xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <button 
          class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          @click="goBack"
        >
          <span>←</span>
          <span>返回</span>
        </button>
        <div class="text-center">
          <div class="text-sm text-amber-600 font-medium">🎁 聚会纪念册</div>
        </div>
        <div class="w-20"></div>
      </div>

      <div class="text-center mb-12">
        <div class="inline-block mb-4">
          <div class="text-7xl mb-2">📖</div>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          {{ currentAlbum.roomName }}
        </h1>
        <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <span class="flex items-center gap-1">
            <span>📅</span>
            {{ formatDate(currentAlbum.createdAt) }}
          </span>
          <span class="flex items-center gap-1">
            <span>⏱️</span>
            {{ durationText }}
          </span>
          <span class="flex items-center gap-1">
            <span>🎫</span>
            <span class="font-mono">{{ currentAlbum.roomCode }}</span>
          </span>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-10">
        <div class="bg-white rounded-2xl p-5 shadow-md text-center">
          <div class="text-3xl font-bold text-amber-600 mb-1">
            {{ currentAlbum.members.length }}
          </div>
          <div class="text-sm text-gray-500">👥 位成员</div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-md text-center">
          <div class="text-3xl font-bold text-orange-600 mb-1">
            {{ currentAlbum.totalTopics }}
          </div>
          <div class="text-sm text-gray-500">📝 个话题</div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-md text-center">
          <div class="text-3xl font-bold text-pink-600 mb-1">
            {{ currentAlbum.totalTurns }}
          </div>
          <div class="text-sm text-gray-500">🎴 轮翻牌</div>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-6 shadow-lg mb-8">
        <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span>👥</span> 聚会成员
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            v-for="member in currentAlbum.members" 
            :key="member.id"
            class="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl"
          >
            <div class="text-4xl mb-2">{{ member.avatar }}</div>
            <div class="font-medium text-gray-800 text-center">{{ member.name }}</div>
            <div 
              v-if="member.isHost"
              class="text-xs text-amber-600 mt-1"
            >
              👑 房主
            </div>
          </div>
        </div>
      </div>

      <div 
        v-if="currentAlbum.featuredTopics.length > 0"
        class="bg-white rounded-3xl p-6 shadow-lg mb-8"
      >
        <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span>⭐</span> 精选话题
        </h2>
        <div class="space-y-4">
          <div 
            v-for="topic in currentAlbum.featuredTopics" 
            :key="topic.id"
            class="p-5 rounded-2xl border-l-4 bg-gradient-to-r from-amber-50/50 to-transparent hover:from-amber-50 transition-all"
            :style="{ borderLeftColor: topic.color }"
          >
            <div class="flex items-start justify-between mb-2">
              <span 
                class="px-3 py-1 rounded-full text-xs font-medium text-white"
                :style="{ backgroundColor: topic.color }"
              >
                {{ TOPIC_EMOJIS[topic.type] }} {{ TOPIC_NAMES[topic.type] || topic.type }}
              </span>
              <span class="text-xs text-gray-400">
                {{ formatDate(topic.createdAt) }}
              </span>
            </div>
            <p class="text-gray-800 font-medium text-lg leading-relaxed mb-3">
              「{{ topic.content }}」
            </p>
            <div class="text-sm text-gray-500">
              —— {{ topic.isAnonymous ? '🎭 匿名' : `👤 ${topic.author}` }}
            </div>
          </div>
        </div>
      </div>

      <div 
        v-if="currentAlbum.goldenQuotes.length > 0"
        class="bg-white rounded-3xl p-6 shadow-lg mb-8"
      >
        <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span>💬</span> 现场金句
        </h2>
        <div class="space-y-4">
          <div 
            v-for="quote in currentAlbum.goldenQuotes" 
            :key="quote.id"
            class="relative p-5 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl"
          >
            <div class="absolute top-3 left-3 text-3xl opacity-20">❝</div>
            <div class="relative z-10">
              <p class="text-gray-800 font-medium text-lg leading-relaxed mb-3 pl-4">
                {{ quote.content }}
              </p>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">
                  —— {{ quote.author }}
                </span>
                <span class="text-gray-400 text-xs">
                  {{ formatDate(quote.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        v-if="currentAlbum.goldenQuotes.length === 0 && currentAlbum.featuredTopics.length === 0"
        class="bg-white rounded-3xl p-8 shadow-lg mb-8 text-center"
      >
        <div class="text-5xl mb-4">📝</div>
        <p class="text-gray-500">
          这次聚会还没有留下精选话题和金句，下次记得标记哦！
        </p>
      </div>

      <div class="text-center pb-8">
        <div class="inline-block px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
          <span class="text-amber-700 text-sm">
            🎉 感谢大家的参与，让我们记住这次美好的聚会！
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
