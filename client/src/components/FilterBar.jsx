/**
 * fields: [{ key, label, type: 'text' | 'select', options? }]
 * values, onChange(key, value) are controlled by the parent page.
 */
export default function FilterBar({ fields, values, onChange }) {
  return (
    <div className="filter-bar">
      {fields.map((f) =>
        f.type === 'select' ? (
          <select
            key={f.key}
            value={values[f.key] || ''}
            onChange={(e) => onChange(f.key, e.target.value)}
          >
            <option value="">{f.label}</option>
            {f.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            key={f.key}
            placeholder={f.label}
            value={values[f.key] || ''}
            onChange={(e) => onChange(f.key, e.target.value)}
          />
        )
      )}
    </div>
  );
}
