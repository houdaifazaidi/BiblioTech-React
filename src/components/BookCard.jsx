import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  const isAvailable = book.available_copies > 0;

  return (
    <Link to={`/books/${book.id}`} style={{ display: 'block' }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        height: '100%'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.15)';
        e.currentTarget.style.borderColor = 'var(--accent)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}>
        {book.cover_image ? (
          <img src={book.cover_image} alt={book.title} style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block', background: 'var(--surface2)' }} />
        ) : (
          <div style={{ width: '100%', aspectRatio: '2/3', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            📚
          </div>
        )}
        <div style={{ padding: '0.875rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {book.title}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
            {book.author}
          </div>
          {book.genre && (
            <div style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.65rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: 999, background: 'rgba(99,102,241,0.12)', color: 'var(--accent)' }}>
              {book.genre}
            </div>
          )}
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: isAvailable ? 'var(--success)' : 'var(--danger)' }}>
            {isAvailable ? `${book.available_copies} Available` : 'Out of Stock'}
          </div>
        </div>
      </div>
    </Link>
  );
}
