import { api, unwrap, unwrapPaginated } from '@/services/api'
import type { Drill } from '@/types/entities'

export type DrillPayload = Pick<
  Drill,
  | 'name'
  | 'categoryId'
  | 'description'
  | 'cover'
  | 'youtubeUrl'
  | 'listIcon'
  | 'accessLevel'
  | 'steps'
  | 'equipment'
  | 'focusPoints'
> & {
  id?: string
}

export type DrillRow = Drill & { categoryName: string }
export type DrillQuery = {
  page?: number
  limit?: number
  categoryId?: string
  accessLevel?: 'all' | 'free' | 'premium' | 'locked'
  search?: string
}

const normalizeAccessLevel = (value: string) =>
  (value.charAt(0).toUpperCase() + value.slice(1)) as Drill['accessLevel']

const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '')
const toStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value
        .map((item) => String(item).trim())
        .filter(Boolean)
    : []

const toFocusPoints = (value: unknown): Drill['focusPoints'] =>
  Array.isArray(value)
    ? value
        .map((item) => {
          if (typeof item === 'string') {
            const [title = '', ...rest] = item.split(':')
            return {
              title: title.trim(),
              description: rest.join(':').trim(),
            }
          }

          if (item && typeof item === 'object') {
            const point = item as Record<string, unknown>
            return {
              title: toStringValue(point.title).trim(),
              description: toStringValue(point.description).trim(),
            }
          }

          return { title: '', description: '' }
        })
        .filter((item) => item.title || item.description)
    : []

const mapDrill = (item: Record<string, unknown>): DrillRow => ({
  id: String(item.id),
  name: toStringValue(item.name),
  categoryId: toStringValue(item.categoryId),
  description: toStringValue(item.description),
  cover: toStringValue(item.cover || item.coverUrl || item.coverPhotoUrl),
  youtubeUrl: toStringValue(item.youtubeUrl) || null,
  listIcon: toStringValue(item.listIcon) || 'baseball-outline',
  coverUrl: toStringValue(item.coverUrl),
  coverPhoto: toStringValue(item.coverPhoto),
  coverPhotoUrl: toStringValue(item.coverPhotoUrl),
  imageUrl: toStringValue(item.imageUrl),
  steps: toStringArray(item.steps),
  equipment: toStringArray(item.equipment),
  focusPoints: toFocusPoints(item.focusPoints),
  accessLevel: normalizeAccessLevel(String(item.accessLevel)),
  createdAt: toStringValue(item.createdAt),
  categoryName: toStringValue(item.categoryName),
})

const fetchAllDrillPages = async () => {
  const firstPage = await drillService.getPage({ page: 1, limit: 100 })
  const items = [...firstPage.items]

  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const nextPage = await drillService.getPage({ page, limit: 100 })
    items.push(...nextPage.items)
  }

  return items
}

export const drillService = {
  getAll: async (): Promise<DrillRow[]> => fetchAllDrillPages(),
  getPage: async (query: DrillQuery) =>
    unwrapPaginated<Record<string, unknown>>(
      api.get('/drills', { params: query }),
    ).then((result) => ({
      items: result.items.map(mapDrill),
      pagination: result.pagination,
    })),
  save: async (payload: DrillPayload): Promise<unknown> => {
    const body = {
      name: payload.name,
      categoryId: payload.categoryId,
      description: payload.description,
      cover: payload.cover,
      youtubeUrl: payload.youtubeUrl?.trim() || null,
      listIcon: payload.listIcon,
      accessLevel: payload.accessLevel.toLowerCase(),
      steps: payload.steps,
      equipment: payload.equipment,
      focusPoints: payload.focusPoints,
    }
    const request = payload.id
      ? api.patch(`/drills/${payload.id}`, body)
      : api.post('/drills', body)

    return unwrap(request)
  },
  remove: async (id: string): Promise<void> => unwrap(api.delete(`/drills/${id}`)),
}
