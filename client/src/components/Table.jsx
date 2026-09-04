/**
 * Generic sortable table.
 * columns: [{ key, label, sortable }]
 * sort: { sortBy, order } and onSort(key) toggles asc/desc — sorting is delegated
 * to the parent, which re-fetches from the server with the new params.
 */
export default function Table({ columns, rows, sort, onSort, renderCell, emptyMessage }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => {
            const isActive = sort?.sortBy === col.key;
            const arrow = isActive ? (sort.order === 'asc' ? ' ▲' : ' ▼') : '';
            return (
              <th
                key={col.key}
                onClick={() => col.sortable && onSort && onSort(col.key)}
                style={{ cursor: col.sortable ? 'pointer' : 'default' }}
              >
                {col.label}
                {col.sortable && arrow}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length} style={{ color: '#64748b', textAlign: 'center', padding: 24 }}>
              {emptyMessage || 'No records found'}
            </td>
          </tr>
        )}
        {rows.map((row, idx) => (
          <tr key={row.id ?? idx}>
            {columns.map((col) => (
              <td key={col.key}>{renderCell ? renderCell(col.key, row) : row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
