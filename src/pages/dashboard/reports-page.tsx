import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye, Search } from 'lucide-react'
import { ReportDetailsModal } from '@/features/reports/report-details-modal'
import { Pagination } from '@/components/ui/pagination'
import { Select } from '@/components/ui/select'
import { Table, type Column } from '@/components/ui/table'
import { cityOptions } from '@/constants/options'
import { reportService } from '@/services/report-service'
import type { Report } from '@/types/entities'
import { formatDate } from '@/utils/format'

const pageSize = 10

export const ReportsPage = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [city, setCity] = useState('All')
  const [page, setPage] = useState(1)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const { data } = useQuery({
    queryKey: ['reports', page, status, city, search],
    queryFn: () =>
      reportService.getPage({
        page,
        limit: pageSize,
        status,
        city,
        search,
      }),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: 'open' | 'resolved' }) =>
      reportService.updateStatus(id, nextStatus),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['reports'] })
      setSelectedReport(null)
    },
  })

  const rows = data?.items ?? []
  const totalPages = data?.pagination.totalPages ?? 1
  const total = data?.pagination.total ?? 0

  const columns: Column<Report>[] = [
    {
      key: 'id',
      header: 'S.ID',
      render: () => <span>01</span>,
    },
    {
      key: 'name',
      header: 'Full Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#e4e7ef] text-xs font-bold text-brand-navy">
            {row.user
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <span className="font-semibold text-brand-navy">{row.user}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (row) => (
        <span className="block truncate font-medium text-brand-ink" title={row.email}>
          {row.email}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined Date',
      render: (row) => (
        <span className="font-semibold text-brand-navy">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: 'city',
      header: 'City',
      render: (row) => <span>{row.city}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className="font-semibold text-brand-navy">{row.status}</span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <button
          className="text-brand-navy"
          onClick={() => setSelectedReport(row)}
          type="button"
        >
          <Eye className="size-5" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6 px-1">
      <h1 className="text-[30px] font-medium text-brand-ink">
        Report Management
      </h1>
      <div className="dashboard-panel grid gap-3 p-3 lg:grid-cols-4">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#a4adbc]" />
          <input
            className="h-12 w-full rounded-xl border border-[#e6e0d5] bg-white pl-11 pr-4 text-sm outline-none"
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search by name, email..."
            value={search}
          />
        </label>
        <Select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value)
            setPage(1)
          }}
        >
          <option value="All">Status: All</option>
          <option value="Open">Open</option>
          <option value="Resolved">Resolved</option>
        </Select>
        <Select
          value={city}
          onChange={(event) => {
            setCity(event.target.value)
            setPage(1)
          }}
        >
          {cityOptions.map((item) => (
            <option key={item} value={item}>
              City: {item}
            </option>
          ))}
        </Select>
        <Select defaultValue="points" disabled>
          <option value="points">Points Range</option>
          <option value="0-100">0-100</option>
          <option value="100-500">100-500</option>
        </Select>
      </div>
      <Table columns={columns} rows={rows} gridTemplate="0.5fr 1.8fr 2fr 1.2fr 1fr 1fr 0.5fr" />
      <div className="flex flex-col gap-4 rounded-b-[18px] border border-t-0 border-[#ebe7e0] bg-white px-6 py-4 text-sm text-[#686f80] sm:flex-row sm:items-center sm:justify-between">
        <div>
          Showing {rows.length} of {total} results
        </div>
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      </div>
      <ReportDetailsModal
        onClose={() => setSelectedReport(null)}
        open={Boolean(selectedReport)}
        report={selectedReport}
        onStatusChange={(nextStatus) =>
          selectedReport
            ? statusMutation.mutate({
                id: selectedReport.id,
                nextStatus,
              })
            : undefined
        }
      />
    </div>
  )
}
