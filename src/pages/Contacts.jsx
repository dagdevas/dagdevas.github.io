import React, { useState } from 'react';
import './Contacts.css';

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь можно добавить логику отправки формы
    alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contactInfo = [
    {
      icon: '📞',
      title: 'Телефон',
      value: '+7 (901) 929-98-08',
      link: 'tel:+79019299809'
    },
    {
      icon: '📧',
      title: 'Email',
      value: 'pkfkvadrat@yandex.ru',
      link: 'mailto:pkfkvadrat@yandex.ru'
    },
    {
      icon: '📍',
      title: 'Адрес',
      value: 'Кемеровская область-Кузбасс, г. Прокопьевск, ул. Луговая, д. 17',
      link: null
    },
    {
      icon: '🕒',
      title: 'Время работы',
      value: 'Пн-Пт: 8:00-18:00, Сб: 9:00-15:00',
      link: null
    }
  ];

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: '💬',
      url: 'https://wa.me/79832179608',
      color: '#25d366'
    },
    {
      name: 'Telegram',
      icon: '✈️',
      url: 'https://t.me/prommash54',
      color: '#0088cc'
    }
  ];

  return (
    <div className="contacts">
      <section className="hero-section">
        <div className="container">
          <h1>Контакты</h1>
          <p>Свяжитесь с нами для получения консультации и расчета стоимости</p>
        </div>
      </section>

      <section className="contacts-content">
        <div className="container">
          <div className="contacts-grid">
            <div className="contact-info-section">
              <h2>Контактная информация</h2>
              <div className="contact-cards">
                {contactInfo.map((info, index) => (
                  <div key={index} className="contact-card">
                    <div className="contact-icon">{info.icon}</div>
                    <div className="contact-details">
                      <h3>{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="contact-link">{info.value}</a>
                      ) : (
                        <p>{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="social-section">
                <h3>Свяжитесь с нами в мессенджерах</h3>
                <div className="social-buttons">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="social-button"
                      style={{ backgroundColor: social.color }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="social-icon">{social.icon}</span>
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <h2>Оставить заявку</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Имя *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Телефон *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Сообщение</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Опишите ваши требования или вопросы..."
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Отправить заявку
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="container">
          <h2 className="section-title">Как нас найти</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-icon">🗺️</div>
              <p>Интерактивная карта</p>
              <p>Кемеровская область-Кузбасс, г. Прокопьевск, ул. Луговая, д. 17</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacts;

