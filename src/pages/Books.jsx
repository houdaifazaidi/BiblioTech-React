import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import BookCard from '../components/BookCard';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/books', { params: Object.fromEntries(searchParams) });
      setBooks(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newParams = new URLSearchParams();
    
    if (formData.get('search')) newParams.set('search', formData.get('search'));
    if (formData.get('available')) newParams.set('available', '1');
    
    setSearchParams(newParams);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Library Catalog</h1>
        <p>Discover your next great read</p>
      </div>

      <div className="container">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="text" 
            name="search" 
            defaultValue={searchParams.get('search') || ''} 
            placeholder="Search by title, author, or genre…" 
            style={{ flex: 1, minWidth: 250 }} 
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0, cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              name="available" 
              defaultChecked={searchParams.get('available') === '1'} 
              style={{ width: 'auto' }} 
            />
            Available Only
          </label>
          <button type="submit" className="btn btn-primary">Search</button>
          {Array.from(searchParams.keys()).length > 0 && (
            <button type="button" onClick={() => setSearchParams(new URLSearchParams())} className="btn btn-secondary">Clear</button>
          )}
        </form>

        {loading ? (
          <div className="loader-container"><div className="loader"></div></div>
        ) : books.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h2>No books found</h2>
            <p>Try adjusting your search filters.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {books.map(book => <BookCard key={book.id} book={book} />)}
            </div>
            {meta && meta.last_page > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                <button 
                  className="btn btn-secondary" 
                  disabled={meta.current_page === 1}
                  onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', meta.current_page - 1); setSearchParams(p); }}
                >
                  Previous
                </button>
                <button 
                  className="btn btn-secondary" 
                  disabled={meta.current_page === meta.last_page}
                  onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', meta.current_page + 1); setSearchParams(p); }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
