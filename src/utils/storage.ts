import type { Room, GoldenQuote, MemorialAlbum } from '@/types'

const STORAGE_KEY = 'party_topic_bag_rooms'
const QUOTES_STORAGE_KEY = 'party_topic_bag_quotes'
const ALBUMS_STORAGE_KEY = 'party_topic_bag_albums'

export function getRooms(): Room[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveRooms(rooms: Room[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms))
}

export function getRoomById(id: string): Room | undefined {
  return getRooms().find(room => room.id === id)
}

export function getRoomByCode(code: string): Room | undefined {
  return getRooms().find(room => room.code === code)
}

export function saveRoom(room: Room): void {
  const rooms = getRooms()
  const index = rooms.findIndex(r => r.id === room.id)
  if (index >= 0) {
    rooms[index] = room
  } else {
    rooms.push(room)
  }
  saveRooms(rooms)
}

export function deleteRoom(id: string): void {
  const rooms = getRooms().filter(room => room.id !== id)
  saveRooms(rooms)
}

export function getGoldenQuotes(): GoldenQuote[] {
  try {
    const data = localStorage.getItem(QUOTES_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveGoldenQuotes(quotes: GoldenQuote[]): void {
  localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes))
}

export function getGoldenQuotesByRoom(roomId: string): GoldenQuote[] {
  return getGoldenQuotes().filter(q => q.roomId === roomId)
}

export function saveGoldenQuote(quote: GoldenQuote): void {
  const quotes = getGoldenQuotes()
  quotes.push(quote)
  saveGoldenQuotes(quotes)
}

export function deleteGoldenQuote(quoteId: string): void {
  const quotes = getGoldenQuotes().filter(q => q.id !== quoteId)
  saveGoldenQuotes(quotes)
}

export function getMemorialAlbums(): MemorialAlbum[] {
  try {
    const data = localStorage.getItem(ALBUMS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveMemorialAlbums(albums: MemorialAlbum[]): void {
  localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(albums))
}

export function getMemorialAlbumById(id: string): MemorialAlbum | undefined {
  return getMemorialAlbums().find(album => album.id === id)
}

export function getMemorialAlbumByRoom(roomId: string): MemorialAlbum | undefined {
  return getMemorialAlbums().find(album => album.roomId === roomId)
}

export function saveMemorialAlbum(album: MemorialAlbum): void {
  const albums = getMemorialAlbums()
  const index = albums.findIndex(a => a.id === album.id)
  if (index >= 0) {
    albums[index] = album
  } else {
    albums.push(album)
  }
  saveMemorialAlbums(albums)
}

export function deleteMemorialAlbum(albumId: string): void {
  const albums = getMemorialAlbums().filter(a => a.id !== albumId)
  saveMemorialAlbums(albums)
}
