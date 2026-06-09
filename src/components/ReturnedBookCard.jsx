export default function ReturnedBookCard({ loan }) {
  const isForceReturned = loan.status === 'force_returned';

  return (
    <div className="returned-book-card">
      {/* Cover */}
      <div className="returned-book-cover">
        {loan.cover_image ? (
          <img src={loan.cover_image} alt={loan.book_title} />
        ) : (
          <div className="returned-book-cover-placeholder">📚</div>
        )}
        <div className={`returned-book-badge ${isForceReturned ? 'badge-force' : 'badge-returned-ok'}`}>
          {isForceReturned ? '⚡' : '✓'}
        </div>
      </div>

      {/* Info */}
      <div className="returned-book-info">
        <div className="returned-book-title" title={loan.book_title}>{loan.book_title}</div>
        <div className="returned-book-author">{loan.book_author}</div>

        <div className="returned-book-dates">
          <span>📅 {new Date(loan.borrowed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span className="returned-arrow">→</span>
          <span className="returned-date">
            ✅ {loan.returned_at
              ? new Date(loan.returned_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : '—'}
          </span>
        </div>

        {loan.penalty_amount > 0 && (
          <div className="returned-book-penalty">
            ⚠ {Number(loan.penalty_amount).toFixed(2)} MAD penalty
            {loan.penalty_paid && <span className="penalty-paid-chip">Paid</span>}
          </div>
        )}

        <div className="returned-book-status">
          <span className={`badge badge-${loan.status}`}>
            {loan.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
