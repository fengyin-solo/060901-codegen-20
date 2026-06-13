import { ref } from 'vue'
import type { GoldenQuote, MemorialAlbum } from '@/types'
import { 
  getRoomById, 
  saveRoom, 
  getGoldenQuotesByRoom, 
  saveGoldenQuote, 
  deleteGoldenQuote,
  getMemorialAlbumByRoom,
  saveMemorialAlbum,
  getMemorialAlbums,
  getMemorialAlbumById
} from '@/utils/storage'
import { generateId } from '@/utils/helpers'

export function useMemorial() {
  const goldenQuotes = ref<GoldenQuote[]>([])
  const memorialAlbums = ref<MemorialAlbum[]>([])
  const currentAlbum = ref<MemorialAlbum | null>(null)
  const loading = ref(false)

  const loadGoldenQuotes = (roomId: string) => {
    goldenQuotes.value = getGoldenQuotesByRoom(roomId)
  }

  const addGoldenQuote = (
    roomId: string, 
    content: string, 
    author: string, 
    topicId?: string
  ): GoldenQuote | null => {
    const room = getRoomById(roomId)
    if (!room || !content.trim()) return null

    const quote: GoldenQuote = {
      id: generateId(),
      roomId,
      content: content.trim(),
      author: author.trim() || '匿名',
      createdAt: new Date().toISOString(),
      topicId
    }

    saveGoldenQuote(quote)
    loadGoldenQuotes(roomId)
    return quote
  }

  const removeGoldenQuote = (quoteId: string): boolean => {
    deleteGoldenQuote(quoteId)
    goldenQuotes.value = goldenQuotes.value.filter(q => q.id !== quoteId)
    return true
  }

  const toggleTopicFeatured = (roomId: string, topicId: string): boolean => {
    const room = getRoomById(roomId)
    if (!room) return false

    const topic = room.topics.find(t => t.id === topicId)
    if (topic) {
      topic.isFeatured = !topic.isFeatured
      saveRoom(room)
      return true
    }
    return false
  }

  const generateMemorialAlbum = (roomId: string): MemorialAlbum | null => {
    const room = getRoomById(roomId)
    if (!room) return null

    const existingAlbum = getMemorialAlbumByRoom(roomId)
    const quotes = getGoldenQuotesByRoom(roomId)
    const featuredTopics = room.topics.filter(t => t.isFeatured)
    
    const album: MemorialAlbum = {
      id: existingAlbum?.id || generateId(),
      roomId: room.id,
      roomName: room.name,
      roomCode: room.code,
      createdAt: room.createdAt,
      endedAt: new Date().toISOString(),
      members: [...room.members],
      featuredTopics: featuredTopics.length > 0 ? [...featuredTopics] : [...room.topics.filter(t => t.isFlipped).slice(0, 5)],
      goldenQuotes: [...quotes],
      totalTopics: room.topics.length,
      totalTurns: room.currentTurn
    }

    saveMemorialAlbum(album)
    loadMemorialAlbums()
    currentAlbum.value = album
    return album
  }

  const loadMemorialAlbums = () => {
    memorialAlbums.value = getMemorialAlbums()
  }

  const loadMemorialAlbum = (id: string): boolean => {
    const album = getMemorialAlbumById(id)
    if (album) {
      currentAlbum.value = album
      return true
    }
    return false
  }

  const loadMemorialAlbumByRoom = (roomId: string): boolean => {
    const album = getMemorialAlbumByRoom(roomId)
    if (album) {
      currentAlbum.value = album
      return true
    }
    return false
  }

  return {
    goldenQuotes,
    memorialAlbums,
    currentAlbum,
    loading,
    loadGoldenQuotes,
    addGoldenQuote,
    removeGoldenQuote,
    toggleTopicFeatured,
    generateMemorialAlbum,
    loadMemorialAlbums,
    loadMemorialAlbum,
    loadMemorialAlbumByRoom
  }
}
