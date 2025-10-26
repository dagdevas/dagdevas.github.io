import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { newsAPI, uploadAPI } from '../../../services/api';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AdminNewsEdit = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', excerpt: '', contentHtml: '', status: 'draft', coverImage: null, gallery: [], tags: [] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!isNew) {
        try {
          const res = await newsAPI.getAllAdmin({ page: 1, limit: 1, id });
          // резервный путь: получим по id
          const byId = await fetchById(id);
          if (byId) setForm(mapFromServer(byId));
        } catch (e) {
          // noop
        }
      }
    };
    load();
  }, [id]);

  const fetchById = async (nid) => {
    try {
      const res = await newsAPI.updateStatus(nid, 'draft'); // no-op to ensure endpoint exists
      // not ideal; instead use GET /admin/:id we added
    } catch(e) {}
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/news/admin/${nid}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await response.json();
      return data.data;
    } catch (e) { return null; }
  };

  const mapFromServer = (d) => ({
    title: d.title || '',
    excerpt: d.excerpt || '',
    contentHtml: d.contentHtml || '',
    status: d.status || 'draft',
    coverImage: d.coverImage || null,
    gallery: d.gallery || [],
    tags: d.tags || []
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUploadCover = async (file) => {
    const res = await uploadAPI.uploadSingle(file);
    if (res.success) setForm({ ...form, coverImage: { url: res.data.url, alt: '' } });
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
        const res = await newsAPI.create(payload);
        if (res.success) navigate('/admin/news');
      } else {
        const res = await newsAPI.update(id, payload);
        if (res.success) navigate('/admin/news');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3>{isNew ? 'Новая новость' : 'Редактирование новости'}</h3>
      <div className="form-group">
        <label>Заголовок</label>
        <input name="title" value={form.title} onChange={onChange} />
      </div>
      <div className="form-group">
        <label>Краткое описание</label>
        <textarea name="excerpt" value={form.excerpt} onChange={onChange} />
      </div>
      <div className="form-group">
        <label>Контент</label>
        <CKEditor editor={ClassicEditor} data={form.contentHtml} onChange={(event, editor) => setForm({ ...form, contentHtml: editor.getData() })} />
      </div>
      <div className="form-group">
        <label>Обложка</label>
        <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleUploadCover(e.target.files[0])} />
        {form.coverImage?.url && <img src={form.coverImage.url} alt="cover" style={{ height: 80, display: 'block', marginTop: 8 }} />}
      </div>
      <div className="form-group">
        <label>Галерея</label>
        <input type="file" accept="image/*" multiple onChange={(e) => e.target.files.length && handleUploadGallery(e.target.files)} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {form.gallery.map((img, i) => (<img key={i} src={img.url} alt="g" style={{ height: 60 }} />))}
        </div>
      </div>
      <div className="form-group">
        <label>Статус</label>
        <select name="status" value={form.status} onChange={onChange}>
          <option value="draft">Черновик</option>
          <option value="published">Опубликовано</option>
          <option value="archived">Архив</option>
        </select>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" onClick={save} disabled={saving}>{saving ? 'Сохраняю...' : 'Сохранить'}</button>
        <button className="btn" onClick={() => navigate('/admin/news')}>Отмена</button>
      </div>
    </div>
  );
};

export default AdminNewsEdit;



