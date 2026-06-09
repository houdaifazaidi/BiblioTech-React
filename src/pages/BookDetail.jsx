import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { user, fetchUser } = useContext(AuthContext);

  const loadBook = async () => {
    try {
      const res = await api.get(`/books/${id}`);
      setBook(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBook();
  }, [id]);

  const handleBorrow = async () => {
    setActionLoading(true);
    setMessage(null);
    try {
      await api.post('/loans', { book_id: book.id });
      setMessage({ type: 'success', text: 'Book borrowed successfully! Due in 14 days.' });
      await Promise.all([loadBook(), fetchUser()]);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to borrow book' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (!book) return <div className="container"><div className="alert alert-error">Book not found</div></div>;

  const isAvailable = book.available_copies > 0;
  const isAlreadyBorrowing = user?.active_loans?.some(l => l.book_id === book.id && (l.status === 'active' || l.status === 'overdue'));

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <Link to="/books" className="btn btn-secondary btn-sm" style={{ marginBottom: '2rem' }}>← Back to Catalog</Link>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="card" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280, maxWidth: 350 }}>
          {book.cover_image ? (
            <img src={book.cover_image} alt={book.title} style={{ width: '100%', borderRadius: 'var(--radius)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '2/3', background: 'var(--surface2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>📚</div>
          )}
        </div>
        
        <div style={{ flex: 2, minWidth: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {book.genre && (
            <div style={{ marginBottom: '1rem' }}><span className="badge badge-active">{book.genre}</span></div>
          )}
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.2 }}>{book.title}</h1>
          <div style={{ fontSize: '1.25rem', color: 'var(--muted)', marginBottom: '2rem' }}>by {book.author}</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--surface2)', borderRadius: 'var(--radius)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.25rem' }}>Availability</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: isAvailable ? 'var(--success)' : 'var(--danger)' }}>
                {book.available_copies} of {book.total_copies} copies available
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.25rem' }}>Publisher</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{book.publisher || 'Unknown'} ({book.published_year || 'N/A'})</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.25rem' }}>ISBN</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{book.isbn || 'N/A'}</div>
            </div>
          </div>
          
          {book.description && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Synopsis</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{book.description}</p>
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            {user ? (
              isAlreadyBorrowing ? (
                <div className="alert alert-success" style={{ marginBottom: 0 }}>You are currently borrowing this book.</div>
              ) : isAvailable ? (
                <button onClick={handleBorrow} disabled={actionLoading} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                  {actionLoading ? 'Borrowing...' : 'Borrow Book (14 days)'}
                </button>
              ) : (
                <button className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }} disabled>Currently Unavailable</button>
              )
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/login" className="btn btn-primary">Log in to borrow</Link>
                <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Don't have an account? <Link to="/register" style={{ color: 'var(--accent)' }}>Sign up</Link></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
