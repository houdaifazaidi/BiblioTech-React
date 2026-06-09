import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import LoanCard from '../components/LoanCard';
import ReturnedBookCard from '../components/ReturnedBookCard';

export default function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const { fetchUser } = useContext(AuthContext);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/loans');
      setLoans(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleReturn = async (loanId) => {
    try {
      await api.patch(`/loans/${loanId}/return`);
      setMessage({ type: 'success', text: 'Book returned successfully.' });
      await Promise.all([fetchLoans(), fetchUser()]);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to return book.' });
    }
  };

  const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'overdue');
  const historyLoans = loans.filter(l => l.status === 'returned' || l.status === 'force_returned');

  return (
    <div>
      <div className="page-header">
        <h1>My Loans</h1>
        <p>Manage your borrowed books</p>
      </div>

      <div className="container">
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Currently Borrowed</h2>
          <Link to="/books" className="btn btn-primary btn-sm">Borrow More</Link>
        </div>

        {loading ? (
          <div className="loader-container"><div className="loader"></div></div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: '2rem' }}>
              {activeLoans.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📚</div>
                  <p>You have no active loans.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {activeLoans.map(loan => (
                    <LoanCard key={loan.id} loan={loan} onReturn={handleReturn} />
                  ))}
                </div>
              )}
            </div>

            {historyLoans.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.5rem' }}>Loan History</h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)', background: 'var(--surface2)', padding: '0.3rem 0.8rem', borderRadius: 999, border: '1px solid var(--border)' }}>
                    {historyLoans.length} book{historyLoans.length !== 1 ? 's' : ''} returned
                  </span>
                </div>
                <div className="returned-grid">
                  {historyLoans.map(loan => (
                    <ReturnedBookCard key={loan.id} loan={loan} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
