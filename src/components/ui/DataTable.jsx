import { useState, useMemo } from 'react'
import { Fragment } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

export default function DataTable({ columns, data, keyField, renderExpanded, emptyMessage = 'No records found.' }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [expandedRow, setExpandedRow] = useState(null)

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      let aV = a[sortKey] ?? ''
      let bV = b[sortKey] ?? ''
      if (typeof aV === 'string' && /\d{4}-\d{2}-\d{2}T/.test(aV)) {
        aV = new Date(aV).getTime()
        bV = new Date(bV).getTime()
      } else {
        aV = String(aV).toLowerCase()
        bV = String(bV).toLowerCase()
      }
      if (aV < bV) return sortDir === 'asc' ? -1 : 1
      if (aV > bV) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortKey, sortDir])

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(10, 25, 47, 0.04)' }}>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#94A3B8',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: col.sortable ? 'pointer' : 'default',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  width: col.width,
                  backgroundColor: '#ffffff',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { if (col.sortable) e.currentTarget.style.color = '#0A192F' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8' }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {col.label}
                  {col.sortable && (
                    sortKey === col.key
                      ? sortDir === 'asc'
                        ? <ChevronUp size={11} color="#0D9488" />
                        : <ChevronDown size={11} color="#0D9488" />
                      : <ChevronsUpDown size={10} color="#CBD5E1" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: '48px 16px', textAlign: 'center', color: '#94A3B8', fontSize: '13.5px' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map(row => {
              const rowKey = row[keyField]
              const isExpanded = expandedRow === rowKey
              return (
                <Fragment key={rowKey}>
                  <tr
                    onClick={() => setExpandedRow(isExpanded ? null : rowKey)}
                    style={{
                      borderBottom: '1px solid rgba(10, 25, 47, 0.03)',
                      backgroundColor: isExpanded ? '#F0FDFA' : 'transparent',
                      cursor: renderExpanded ? 'pointer' : 'default',
                      transition: 'background-color 0.1s',
                    }}
                    onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.backgroundColor = '#FAFBFD' }}
                    onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    {columns.map(col => (
                      <td
                        key={col.key}
                        className={col.mono ? 'font-mono' : ''}
                        style={{
                          padding: '14px 16px',
                          fontSize: '13.5px',
                          color: '#334155',
                          whiteSpace: col.nowrap ? 'nowrap' : 'normal',
                          verticalAlign: 'middle',
                        }}
                      >
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                  {isExpanded && renderExpanded && (
                    <tr style={{ backgroundColor: '#F0FDFA' }}>
                      <td
                        colSpan={columns.length}
                        style={{ padding: '24px 32px', borderBottom: '1px solid #CCFBF1' }}
                      >
                        {renderExpanded(row)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
