import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export type Column<T> = {
  key: string
  header: string
  className?: string
  render: (row: T, index: number) => ReactNode
}

type TableProps<T> = {
  columns: Column<T>[]
  rows: T[]
  emptyMessage?: string
  gridTemplate?: string
}

export const Table = <T,>({
  columns,
  rows,
  emptyMessage = 'No results found.',
  gridTemplate,
}: TableProps<T>) => {
  const template = gridTemplate || `repeat(${columns.length}, minmax(0, 1fr))`

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#ebe7e0] bg-white shadow-[0_10px_30px_rgba(17,31,90,0.04)]">
      <div className="grid bg-brand-navy px-4 py-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white sm:px-6 xl:px-7">
        <div
          className="grid items-center gap-4"
          style={{
            gridTemplateColumns: template,
          }}
        >
          {columns.map((column) => (
            <div key={column.key} className={cn('truncate', column.className)}>
              {column.header}
            </div>
          ))}
        </div>
      </div>
      {rows.length ? (
        rows.map((row, index) => (
          <div
            key={index}
            className="grid border-t border-[#f3efe8] px-4 py-5 text-sm text-brand-ink sm:px-6 xl:px-7"
          >
            <div
              className="grid items-center gap-4 xl:min-h-[48px]"
              style={{
                gridTemplateColumns: template,
              }}
            >
              {columns.map((column) => (
                <div key={column.key} className={cn('min-w-0', column.className)}>
                  {column.render(row, index)}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="px-6 py-12 text-center text-sm text-brand-body">
          {emptyMessage}
        </div>
      )}
    </div>
  )
}
