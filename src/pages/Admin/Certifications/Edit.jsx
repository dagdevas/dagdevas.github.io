import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { certificationsAPI, uploadAPI } from '../../../services/api';

const AdminCertsEdit = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', text: '', description: '', image: null, file: null, status: 'published' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!isNew) {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/certifications/admin/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
          });
          const data = await res.json();
          if (data.success) setForm({
            title: data.data.title || '',
            text: data.data.text || '',
            description: data.data.description || '',
            image: data.data.image || null,
            file: data.data.file || null,
            status: data.data.status || 'published'
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

  const handleUploadDoc = async (file) => {
    const res = await uploadAPI.uploadDocument(file);
    if (res.success) setForm({ ...form, file: { url: res.data.url, originalName: res.data.originalName, size: res.data.size } });
  };

  const save = async () => {
    try {
      setSaving(true);
      setError('');
      const payload = { ...form };
      if (isNew) {
        const res = await certificationsAPI.create(payload);
        if (res.success) navigate('/admin/certifications');
      } else {
        const res = await certificationsAPI.update(id, payload);
        if (res.success) navigate('/admin/certifications');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3>{isNew ? 'Новый сертификат' : 'Редактирование сертификата'}</h3>
      <div className="form-group">
        <label>Заголовок</label>
        <input name="title" value={form.title} onChange={onChange} />
      </div>
      <div className="form-group">
        <label>Краткое описание</label>
        <textarea name="description" value={form.description} onChange={onChange} />
      </div>
      <div className="form-group">
        <label>Текст</label>
        <textarea name="text" value={form.text} onChange={onChange} rows={6} />
      </div>
      <div className="form-group">
        <label>Картинка</label>
        <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleUploadImage(e.target.files[0])} />
        {form.image?.url && <img src={form.image.url} alt="image" style={{ height: 80, display: 'block', marginTop: 8 }} />}
      </div>
      <div className="form-group">
        <label>Файл (PDF/DOC/XLS)</label>
        <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => e.target.files[0] && handleUploadDoc(e.target.files[0])} />
        {form.file?.url && <a href={form.file.url} target="_blank" rel="noreferrer">{form.file.originalName || 'Открыть файл'}</a>}
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" onClick={save} disabled={saving}>{saving ? 'Сохраняю...' : 'Сохранить'}</button>
        <button className="btn" onClick={() => navigate('/admin/certifications')}>Отмена</button>
      </div>
    </div>
  );
};

export default AdminCertsEdit;



