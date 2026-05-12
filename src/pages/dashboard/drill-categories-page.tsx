import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CategoryFormModal } from '@/features/categories/category-form-modal'
import { AccessBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Pagination } from '@/components/ui/pagination'
import { StableImage } from '@/components/ui/stable-image'
import { Table, type Column } from '@/components/ui/table'
import { categoryIconOptions } from '@/constants/options'
import { categoryService } from '@/services/category-service'
import type { Category } from '@/types/entities'
import { isImageReference } from '@/utils/asset-url'

const pageSize = 6

export const DrillCategoriesPage = () => {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<'All' | 'Free' | 'Locked'>('All')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [error, setError] = useState<string | null>(null)

  const accessLevel =
    filter === 'All'
      ? 'all'
      : filter === 'Locked'
        ? 'locked'
        : filter.toLowerCase()

  const { data, isLoading } = useQuery({
    queryKey: ['categories', page, accessLevel],
    queryFn: () =>
      categoryService.getPage({
        page,
        limit: pageSize,
        accessLevel: accessLevel as 'all' | 'free' | 'locked',
      }),
    placeholderData: (previousData) => previousData,
  })

  const saveMutation = useMutation({
    mutationFn: (
      values: Pick<
        Category,
        'name' | 'subtitle' | 'cover' | 'icon' | 'accentIcon' | 'accessLevel'
      > & { id?: string },
    ) => categoryService.save(values),
    onSuccess: async () => {
      setError(null)
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
      setOpen(false)
      setEditing(null)
    },
    onError: (mutationError) => {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : 'Category save failed',
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.remove(id),
    onSuccess: async () => {
      setError(null)
      setDeleting(null)
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (mutationError) => {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : 'Category delete failed',
      )
    },
  })

  const rows = data?.items ?? []
  const totalPages = data?.pagination.totalPages ?? 1
  const total = data?.pagination.total ?? 0

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Category Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-navy text-lg text-white">
            {isImageReference(row.icon) ? (
              <StableImage
                alt={`${row.name} icon`}
                className="size-10 rounded-xl"
                fallback={
                  <span className="text-xs font-semibold">
                    {row.name.slice(0, 2).toUpperCase()}
                  </span>
                }
                src={row.icon}
              />
            ) : (
              <span className="truncate px-1 text-xs font-semibold">
                {row.icon || row.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <span className="font-medium text-[#9aa1b1]">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'accentIcon',
      header: 'Mobile Icon',
      render: (row) => (
        <span className="inline-flex rounded-full bg-[#f7f4ef] px-3 py-1 text-xs font-semibold text-brand-ink">
          {categoryIconOptions.find((icon) => icon.value === row.accentIcon)
            ?.label ?? row.accentIcon}
        </span>
      ),
    },
    {
      key: 'totalDrills',
      header: 'Total Drills',
      render: (row) => <span className="font-semibold">{row.totalDrills}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <AccessBadge value={row.accessLevel} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-3 text-[#9aa1b1]">
          <button
            onClick={() => {
              setEditing(row)
              setOpen(true)
            }}
            type="button"
          >
            <Pencil className="size-4" />
          </button>
          <button onClick={() => setDeleting(row)} type="button">
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 px-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[30px] font-medium text-brand-ink">
          Drill Category
        </h1>
        <div className="flex gap-3">
          <Link
            className="inline-flex h-12 items-center rounded-2xl border border-brand-line px-4 text-sm font-semibold text-brand-ink"
            to="/drills"
          >
            View Drills
          </Link>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 size-4" />
            Add New Category
          </Button>
        </div>
      </div>
      <Card className="px-4 py-4">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5b6171]">
          Status
        </div>
        <div className="inline-flex rounded-xl bg-[#ece9e7] p-1">
          {(['All', 'Free', 'Locked'] as const).map((item) => (
            <button
              key={item}
              className={
                item === filter
                  ? 'rounded-lg bg-white px-5 py-2 text-sm font-semibold text-brand-ink'
                  : 'px-5 py-2 text-sm font-medium text-[#6c7180]'
              }
            onClick={() => {
              setFilter(item)
              setPage(1)
            }}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </Card>
      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : null}
      {isLoading ? (
        <div className="rounded-[24px] border border-[#ebe7e0] bg-white px-6 py-12 text-center text-sm font-semibold text-brand-body shadow-[0_10px_30px_rgba(17,31,90,0.04)]">
          Loading data...
        </div>
      ) : (
        <Table
          columns={columns}
          emptyMessage="No drill categories found. Categories added from the dashboard will appear here."
          rows={rows}
        />
      )}
      <div className="flex flex-col gap-4 rounded-b-[18px] bg-[#f7f4ef] px-6 py-4 text-sm text-[#686f80] sm:flex-row sm:items-center sm:justify-between">
        <div>
          Showing {rows.length} of {total} categories
        </div>
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      </div>
      <CategoryFormModal
        initialData={editing}
        onClose={() => {
          setOpen(false)
          setEditing(null)
        }}
        onSubmit={(values) =>
          saveMutation.mutateAsync({ ...values, id: editing?.id })
        }
        open={open}
      />
      <ConfirmDialog
        description={
          deleting
            ? `Delete "${deleting.name}"? This cannot be undone. If this category has drills, the backend will block the delete.`
            : ''
        }
        isPending={deleteMutation.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) deleteMutation.mutate(deleting.id)
        }}
        open={Boolean(deleting)}
        title="Delete Category"
      />
    </div>
  )
}
