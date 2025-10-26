import React, { useEffect, useState } from 'react';
import { newsAPI } from '../services/api';
import HeroSlider from '../components/HeroSlider';
import './Home.css';

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await newsAPI.getNews({ page: 1, limit: 3, sort: '-publishedAt' });
        setNews(res.data.items || []);
      } catch (e) {
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = [
    { number: '10+', label: 'лет на рынке металлургии' },
    { number: '64400+', label: 'м², общая площадь производственных помещений' },
    { number: '36200+', label: 'тонн металлоконструкций и оборудования в год' }
  ];

  return (
    <div className="home">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">Цифры и факты</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news-section">
        <div className="container">
          <h2 className="section-title">Новости и события</h2>
          <div className="news-grid">
            {loading ? 'Загрузка...' : news.map(article => (
              <article key={article._id} className="news-card">
                <div className="news-image">
                  <img src={article.coverImage?.url} alt={article.title} />
                </div>
                <div className="news-content">
                  <div className="news-date">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</div>
                  <h3 className="news-title">{article.title}</h3>
                  <p className="news-excerpt">{article.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Нужно рассчитать стоимость?</h2>
            <p>Оставьте заявку на сайте, наши менеджеры оперативно свяжутся с вами</p>
            <a href="/contacts" className="btn">Оставить заявку</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

