import { api, unwrap, unwrapPaginated } from '@/services/api'
import type { Category } from '@/types/entities'

export type CategoryPayload = Pick<
  Category,
  'name' | 'subtitle' | 'cover' | 'icon' | 'accentIcon' | 'accessLevel'
> & {
  id?: string
}

export type CategoryQuery = {
  page?: number
  limit?: number
  accessLevel?: 'all' | 'free' | 'premium' | 'locked'
  search?: string
}

const normalizeAccessLevel = (value: string) =>
  (value.charAt(0).toUpperCase() + value.slice(1)) as Category['accessLevel']

const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '')

const mapCategory = (item: Record<string, unknown>): Category => ({
  id: String(item.id),
  name: toStringValue(item.name),
  subtitle: toStringValue(item.subtitle),
  cover: toStringValue(item.cover || item.coverUrl || item.coverPhotoUrl),
  coverUrl: toStringValue(item.coverUrl),
  coverPhoto: toStringValue(item.coverPhoto),
  coverPhotoUrl: toStringValue(item.coverPhotoUrl),
  icon: toStringValue(item.icon || item.iconUrl),
  iconUrl: toStringValue(item.iconUrl),
  accentIcon: toStringValue(item.accentIcon) || 'baseball-outline',
  imageUrl: toStringValue(item.imageUrl),
  accessLevel: normalizeAccessLevel(String(item.accessLevel)),
  totalDrills: Number(item.totalDrills),
})

const fetchAllCategoryPages = async () => {
  const firstPage = await categoryService.getPage({ page: 1, limit: 100 })
  const items = [...firstPage.items]

  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const nextPage = await categoryService.getPage({ page, limit: 100 })
    items.push(...nextPage.items)
  }

  return items
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => fetchAllCategoryPages(),
  getPage: async (query: CategoryQuery) =>
    unwrapPaginated<Record<string, unknown>>(
      api.get('/drill-categories', { params: query }),
    ).then((result) => ({
      items: result.items.map(mapCategory),
      pagination: result.pagination,
    })),
  save: async (payload: CategoryPayload): Promise<Category> => {
    const body = {
      name: payload.name,
      subtitle: payload.subtitle,
      cover: payload.cover,
      icon: payload.icon,
      accentIcon: payload.accentIcon,
      accessLevel: payload.accessLevel.toLowerCase(),
    }
    const request = payload.id
      ? api.patch(`/drill-categories/${payload.id}`, body)
      : api.post('/drill-categories', body)

    return unwrap(request)
  },
  remove: async (id: string): Promise<void> =>
    unwrap(api.delete(`/drill-categories/${id}`)),
}
