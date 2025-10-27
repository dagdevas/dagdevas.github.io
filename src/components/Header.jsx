import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h2>Квадрат</h2>
            </Link>
          </div>
          
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-link">Главная</Link>
            <Link to="/products" className="nav-link">Продукция</Link>
            <Link to="/about" className="nav-link">О компании</Link>
            <Link to="/contacts" className="nav-link">Контакты</Link>
            <Link to="/admin/news" className="nav-link">Админ</Link>
          </nav>

          <div className="header-contacts">
            <a href="tel:+79019299808" className="phone">+7 (901) 929-98-08</a>
            <div className="social-links">
              <a href="https://wa.me/79832179608" className="social-link whatsapp" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <a href="https://t.me/prommash54" className="social-link telegram" target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </div>
          </div>

          <button className="menu-toggle" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

