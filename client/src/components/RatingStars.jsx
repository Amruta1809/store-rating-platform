/**
 * Interactive when onChange is provided (used to submit/modify a rating);
 * read-only display otherwise (used to show an average rating).
 */
export default function RatingStars({ value, onChange, size = 18 }) {
  const stars = [1, 2, 3, 4, 5];
  const rounded = value ? Math.round(value) : 0;

  return (
    <span className="stars" style={{ fontSize: size }}>
      {stars.map((s) => (
        <span
          key={s}
          onClick={onChange ? () => onChange(s) : undefined}
          style={{ cursor: onChange ? 'pointer' : 'default' }}
          title={onChange ? `Rate ${s}` : undefined}
        >
          {s <= rounded ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}
