import { api, unwrap, unwrapPaginated } from '@/services/api'
import type { Situation } from '@/types/entities'

export type SituationPayload = Omit<Situation, 'id' | 'createdAt'> & {
  id?: string
}

const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '')

const mapSituation = (item: Record<string, unknown>): Situation => ({
  id: String(item.id),
  title: toStringValue(item.title),
  category: toStringValue(item.category || 'Specific Situations'),
  shortLabel: toStringValue(item.shortLabel || String(item.title || '').slice(0, 2).toUpperCase()),
  image: toStringValue(item.image || item.imageUrl),
  imageUrl: toStringValue(item.imageUrl),
  displayOrder: Number(item.displayOrder),
  featured: Boolean(item.featured),
  diagramVariant: String(item.diagramVariant || 'infield') as 'infield' | 'outfield',
  instructions: Array.isArray(item.instructions)
    ? item.instructions.map((instruction) => instruction as Situation['instructions'][number])
    : [],
  createdAt: toStringValue(item.createdAt),
})

export const situationService = {
  getAll: async (): Promise<Situation[]> => {
    const firstPage = await situationService.getPage({ page: 1, limit: 100 })
    const items = [...firstPage.items]

    for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
      const nextPage = await situationService.getPage({ page, limit: 100 })
      items.push(...nextPage.items)
    }

    return items
  },
  getPage: async (query: { page?: number; limit?: number; featured?: string; search?: string }) =>
    unwrapPaginated<Record<string, unknown>>(
      api.get('/situations', { params: query }),
    ).then((result) => ({
      items: result.items.map(mapSituation),
      pagination: result.pagination,
    })),
  save: async (payload: SituationPayload): Promise<unknown> => {
    const request = payload.id
      ? api.patch(`/situations/${payload.id}`, payload)
      : api.post('/situations', payload)

    return unwrap(request)
  },
  remove: async (id: string): Promise<void> =>
    unwrap(api.delete(`/situations/${id}`)),
}
