import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Квадрат</h3>
            <p>Специализируемся на изготовлении металлоконструкций для промышленных объектов, горнодобывающей отрасли и транспортной инфраструктуры с применением современных технологий производства.</p>
          </div>
          
          <div className="footer-section">
            <h4>Часы работы</h4>
            <div className="working-hours">
              <div className="hours-item">
                <span className="day">Понедельник - Пятница</span>
                <span className="time">7:30 - 16:00</span>
              </div>
              <div className="hours-item">
                <span className="day">Сб-Вс</span>
                <span className="time">Выходной</span>
              </div>
              <div className="hours-break">
                <span className="break-text">Обеденный перерыв: 12:00 - 13:00</span>
              </div>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Компания</h4>
            <ul>
              <li><Link to="/about">О компании</Link></li>
              <li><Link to="/about">Производство</Link></li>
              <li><Link to="/about">Сертификаты</Link></li>
              <li><Link to="/about">Вакансии</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Контакты</h4>
            <div className="contact-info">
              <p>Телефон: <a href="tel:+79832179608">+7 (983) 217-96-08</a></p>
              <p>Email: <a href="mailto:info@metallzavod.ru">info@metallzavod.ru</a></p>
              <div className="social-links">
                <a href="https://wa.me/79832179608" className="social-link whatsapp" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
                <a href="https://t.me/prommash54" className="social-link telegram" target="_blank" rel="noopener noreferrer">
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 МеталлЗавод. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

