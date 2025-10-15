import React from 'react';
import HeroSlider from '../components/HeroSlider';
import './Home.css';

const Home = () => {
  const news = [
    {
      id: 1,
      title: 'Новые технологии сварки в производстве',
      date: '28 декабря 2024',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      excerpt: 'Внедрение современных технологий сварки позволяет повысить качество металлоконструкций и сократить время производства.'
    },
    {
      id: 2,
      title: 'Расширение производственных мощностей',
      date: '21 декабря 2024',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
      excerpt: 'Запуск нового цеха по производству горно-шахтного оборудования увеличит объемы производства на 40%.'
    },
    {
      id: 3,
      title: 'Сертификация ISO 9001:2015',
      date: '14 декабря 2024',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
      excerpt: 'Наша компания успешно прошла сертификацию по международному стандарту качества ISO 9001:2015.'
    }
  ];

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
            {news.map(article => (
              <article key={article.id} className="news-card">
                <div className="news-image">
                  <img src={article.image} alt={article.title} />
                </div>
                <div className="news-content">
                  <div className="news-date">{article.date}</div>
                  <h3 className="news-title">{article.title}</h3>
                  <p className="news-excerpt">{article.excerpt}</p>
                  <a href="#" className="news-link">Читать дальше</a>
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

