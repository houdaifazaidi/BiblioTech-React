export default function LoanCard({ loan, onReturn }) {
  const isOverdue = loan.status === 'overdue';
  const isActive = loan.status === 'active' || isOverdue;

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      {loan.cover_image ? (
        <img src={loan.cover_image} alt={loan.book_title} style={{ width: 60, height: 90, objectFit: 'cover', borderRadius: 6, flexShrink: 0, background: 'var(--surface2)' }} />
      ) : (
        <div style={{ width: 60, height: 90, background: 'var(--surface2)', borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📚</div>
      )}
      
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{loan.book_title}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{loan.book_author}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          Borrowed: {new Date(loan.borrowed_at).toLocaleDateString()} • Due: {new Date(loan.due_date).toLocaleDateString()}
        </div>
        {loan.penalty_amount > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600 }}>
            ⚠ Penalty: {Number(loan.penalty_amount).toFixed(2)} MAD ({loan.days_overdue} days overdue)
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0 }}>
        <span className={`badge badge-${loan.status}`}>{loan.status.replace('_', ' ').toUpperCase()}</span>
        {isActive && (
          <button onClick={() => onReturn(loan.id)} className="btn btn-success btn-sm">
            Return Book
          </button>
        )}
      </div>
    </div>
  );
}
