import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI, uploadAPI } from '../../../services/api';

const AdminProductsEdit = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', image: null, gallery: [], status: 'published', extra: {} });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!isNew) {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/products/admin/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
          });
          const data = await res.json();
          if (data.success) setForm({
            title: data.data.title || '',
            description: data.data.description || '',
            image: data.data.image || null,
            gallery: data.data.gallery || [],
            status: data.data.status || 'published',
            extra: data.data.extra || {}
          });
        } catch (e) {}
      }
    };
    load();
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUploadImage = async (file) => {
    const res = await uploadAPI.uploadSingle(file);
    if (res.success) setForm({ ...form, image: { url: res.data.url, alt: '' } });
  };

  const handleUploadGallery = async (files) => {
    const res = await uploadAPI.uploadMultiple(Array.from(files));
    if (res.success) setForm({ ...form, gallery: [...form.gallery, ...res.data.files.map(f => ({ url: f.url, alt: '' }))] });
  };

  const save = async () => {
    try {
      setSaving(true);
      setError('');
      const payload = { ...form };
      if (isNew) {
        const res = await productsAPI.create(payload);
        if (res.success) navigate('/admin/products');
      } else {
        const res = await productsAPI.update(id, payload);
        if (res.success) navigate('/admin/products');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3>{isNew ? 'Новый продукт' : 'Редактирование продукта'}</h3>
      <div className="form-group">
        <label>Заголовок</label>
        <input name="title" value={form.title} onChange={onChange} />
      </div>
      <div className="form-group">
        <label>Описание</label>
        <textarea name="description" value={form.description} onChange={onChange} />
      </div>
      <div className="form-group">
        <label>Картинка</label>
        <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleUploadImage(e.target.files[0])} />
        {form.image?.url && <img src={form.image.url} alt="image" style={{ height: 80, display: 'block', marginTop: 8 }} />}
      </div>
      <div className="form-group">
        <label>Галерея</label>
        <input type="file" accept="image/*" multiple onChange={(e) => e.target.files.length && handleUploadGallery(e.target.files)} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {form.gallery.map((img, i) => (<img key={i} src={img.url} alt="g" style={{ height: 60 }} />))}
        </div>
      </div>
      <div className="form-group">
        <label>Доп. поля (JSON)</label>
        <textarea
          value={JSON.stringify(form.extra, null, 2)}
          onChange={(e) => {
            try { setForm({ ...form, extra: JSON.parse(e.target.value || '{}') }); } catch {}
          }}
          rows={6}
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" onClick={save} disabled={saving}>{saving ? 'Сохраняю...' : 'Сохранить'}</button>
        <button className="btn" onClick={() => navigate('/admin/products')}>Отмена</button>
      </div>
    </div>
  );
};

export default AdminProductsEdit;



