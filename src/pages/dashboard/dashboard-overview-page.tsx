import { useQuery } from '@tanstack/react-query'
import { Banknote, Crown, ShoppingCart, Users } from 'lucide-react'
import { PageTitle } from '@/components/shared/page-title'
import { StatsCard } from '@/components/shared/stats-card'
import { Table, type Column } from '@/components/ui/table'
import { dashboardService } from '@/services/dashboard-service'
import type { Earning } from '@/types/entities'
import { formatCurrency, formatDateTime, formatNumber } from '@/utils/format'

const columns: Column<Earning>[] = [
  {
    key: 'userEmail',
    header: 'User Account',
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
      <span className="inline-flex rounded-full bg-[#f1f4f8] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#75809b]">
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

export const DashboardOverviewPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: dashboardService.getOverview,
  })

  return (
    <div className="space-y-7 px-0.5 lg:px-1 xl:space-y-8 xl:px-1.5">
      <PageTitle
        description="Track RevenueCat-linked users, premium access adoption, and recorded purchase revenue from synced transaction data."
        eyebrow="Subscription Overview"
        title="Users & Revenue"
      />
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4 xl:gap-5">
        <StatsCard
          icon={Users}
          loading={isLoading}
          title="RevenueCat Users"
          value={data ? formatNumber(data.totalUsers ?? 0) : ''}
        />
        <StatsCard
          accent="Premium"
          icon={Crown}
          loading={isLoading}
          title="Premium Users"
          value={data ? formatNumber(data.premiumUsers ?? 0) : ''}
        />
        <StatsCard
          accent="Recorded"
          icon={ShoppingCart}
          loading={isLoading}
          title="Total Purchases"
          value={data ? formatNumber(data.totalPurchases) : ''}
        />
        <StatsCard
          dark
          icon={Banknote}
          accent={data ? `This month ${formatCurrency(data.monthlyRevenue)}` : undefined}
          loading={isLoading}
          title="Total Revenue"
          value={data ? formatCurrency(data.totalRevenue) : ''}
        />
      </div>
      <section className="space-y-3">
        <div className="section-kicker">Latest Premium Activity</div>
        {isLoading ? (
          <div className="dashboard-panel h-[236px]" />
        ) : (
          <Table
            columns={columns}
            rows={data?.recentActivity ?? []}
            emptyMessage="No recorded premium purchases yet."
            gridTemplate="2.5fr 1.2fr 1.2fr 0.8fr 0.8fr 1.2fr"
          />
        )}
      </section>
    </div>
  )
}
