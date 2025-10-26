import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { newsAPI } from '../../../services/api';

const AdminNews = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await newsAPI.getAllAdmin({ page: 1, limit: 50, sort: '-createdAt' });
      setItems(res.data.items || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3>Новости</h3>
        <button className="btn" onClick={() => navigate('/admin/news/new')}>Добавить</button>
      </div>
      {loading ? 'Загрузка...' : error ? <div style={{ color: 'red' }}>{error}</div> : (
        <div className="table">
          {items.map(item => (
            <div key={item._id} className="table-row" style={{ display: 'grid', gridTemplateColumns: '240px 1fr 120px', gap: 12, padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <div>{item.title}</div>
              <div style={{ color: '#666' }}>{item.status}</div>
              <div>
                <Link className="btn" to={`/admin/news/${item._id}`}>Редактировать</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNews;



