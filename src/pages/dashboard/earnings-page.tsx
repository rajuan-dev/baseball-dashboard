import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Banknote, ReceiptText, ShoppingCart } from 'lucide-react'
import { PriceManagementModal } from '@/features/earnings/price-management-modal'
import { Pagination } from '@/components/ui/pagination'
import { Table, type Column } from '@/components/ui/table'
import { earningService } from '@/services/earning-service'
import { StatsCard } from '@/components/shared/stats-card'
import type { Earning } from '@/types/entities'
import { formatCurrency, formatDateTime, formatNumber } from '@/utils/format'

const pageSize = 10

export const EarningsPage = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['earnings', page],
    queryFn: () => earningService.getPage({ page, limit: pageSize }),
  })

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['earnings-summary'],
    queryFn: earningService.getSummary,
  })

  const updateMutation = useMutation({
    mutationFn: (price: number) => earningService.updatePrice(price),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['earnings'] }),
        queryClient.invalidateQueries({ queryKey: ['earnings-summary'] }),
      ])
      setOpen(false)
    },
  })

  const rows = data?.transactions ?? []
  const totalPages = data?.pagination?.totalPages ?? 1
  const total = data?.pagination?.total ?? 0

  const columns: Column<Earning>[] = [
    {
      key: 'userEmail',
      header: 'User Email',
      render: (row) => (
        <span className="block truncate font-semibold text-brand-ink" title={row.userEmail}>
          {row.userEmail}
        </span>
      ),
    },
    {
      key: 'purchaseType',
      header: 'Access',
      render: (row) => (
        <span className="inline-flex rounded-full bg-[#f6d4c8] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#7d4a2b]">
          {row.purchaseType}
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      render: (row) => {
        const sourceLabel =
          row.source === 'revenuecat'
            ? `RevenueCat${row.environment ? ` ${row.environment}` : ''}`
            : row.source ?? 'manual'

        return (
          <span className="inline-flex rounded-full bg-[#eef2ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-navy">
            {sourceLabel}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className="inline-flex rounded-full bg-[#fff4e8] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-orange">
          {row.status ?? 'paid'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row) => (
        <span className="font-bold text-brand-orange">
          {formatCurrency(row.amount, row.currency ?? 'USD')}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date/Time',
      render: (row) => (
        <span className="text-[#7b8292]">{formatDateTime(row.date)}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6 px-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[30px] font-medium text-brand-ink">Transactions</h1>
          <p className="mt-1 text-sm text-brand-body">
            Review recorded premium purchase activity and the current unlock price from backend.
          </p>
        </div>
        {/* <Button onClick={() => setOpen(true)}>Price Management</Button> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          icon={ShoppingCart}
          loading={isSummaryLoading}
          title="Total Purchases"
          value={summary ? formatNumber(summary.totalPurchases) : ''}
        />
        <StatsCard
          icon={Banknote}
          loading={isSummaryLoading}
          title="Total Revenue"
          value={summary ? formatCurrency(summary.totalRevenue) : ''}
        />
        <StatsCard
          dark
          icon={ReceiptText}
          loading={isLoading}
          title="Current Unlock Price"
          value={formatCurrency(data?.fullUnlockPrice ?? 0)}
        />
      </div>

      <Table
        columns={columns}
        rows={rows}
        emptyMessage="No recorded transactions yet."
        gridTemplate="2.5fr 1.2fr 1.2fr 0.8fr 0.8fr 1.2fr"
      />

      <div className="flex flex-col gap-4 rounded-b-[18px] bg-[#f7f4ef] px-6 py-4 text-sm text-[#686f80] sm:flex-row sm:items-center sm:justify-between">
        <div>
          Showing {rows.length} of {total} transactions
        </div>
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      </div>

      <PriceManagementModal
        onClose={() => setOpen(false)}
        onSubmit={(price) => updateMutation.mutateAsync(price)}
        open={open}
        price={data?.fullUnlockPrice ?? 99.99}
      />
    </div>
  )
}
