import React, { useEffect, useState } from 'react';
import { certificationsAPI } from '../services/api';
import './About.css';

const About = () => {
  const achievements = [
    {
      title: 'Собственное производство',
      description: 'Полный цикл производства от проектирования до готовой продукции',
      icon: '🏭'
    },
    {
      title: 'Современное оборудование',
      description: 'Использование передовых технологий и высокоточного оборудования',
      icon: '⚙️'
    },
    {
      title: 'Контроль качества',
      description: 'Многоуровневая система контроля качества на всех этапах производства',
      icon: '✅'
    },
    {
      title: 'Опытные специалисты',
      description: 'Команда высококвалифицированных инженеров и технологов',
      icon: '👥'
    }
  ];

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await certificationsAPI.getCertifications({ page: 1, limit: 10 });
        setCertificates(res.data.items || []);
      } catch (e) {
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="about">
      <section className="hero-section">
        <div className="container">
          <h1>О компании</h1>
          <p>Ведущий производитель металлоконструкций и комплектующих</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Наша история</h2>
              <p>
                ООО «МеталлЗавод» - ведущий производитель стальных конструкций для гражданского 
                и промышленного строительства, горно-шахтного оборудования и оборудования для 
                железнодорожного транспорта и машиностроительных деталей.
              </p>
              <p>
                За годы работы мы зарекомендовали себя как надежный партнер, способный решать 
                самые сложные технические задачи. Наша продукция используется в различных 
                отраслях промышленности и строительства.
              </p>
              <p>
                Мы постоянно развиваемся, внедряем новые технологии и расширяем производственные 
                мощности для удовлетворения растущих потребностей наших клиентов.
              </p>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600" alt="Производство" />
            </div>
          </div>
        </div>
      </section>

      <section className="achievements-section">
        <div className="container">
          <h2 className="section-title">Наши достижения</h2>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-card">
                <div className="achievement-icon">{achievement.icon}</div>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="production-section">
        <div className="container">
          <div className="production-grid">
            <div className="production-image">
              <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600" alt="Производство" />
            </div>
            <div className="production-text">
              <h2>Производство</h2>
              <p>
                Наше производство оснащено современным оборудованием и технологиями, 
                что позволяет нам изготавливать продукцию высокого качества в соответствии 
                с международными стандартами.
              </p>
              <ul className="production-features">
                <li>Общая площадь производственных помещений: 64,400 м²</li>
                <li>Производственная мощность: 36,200 тонн в год</li>
                <li>Современное сварочное оборудование</li>
                <li>Высокоточные станки с ЧПУ</li>
                <li>Система контроля качества</li>
                <li>Собственная лаборатория</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="certificates-section">
        <div className="container">
          <h2 className="section-title">Сертификаты и лицензии</h2>
          <div className="certificates-list">
            {loading ? 'Загрузка...' : certificates.map((cert) => (
              <div key={cert._id} className="certificate-item">
                <div className="certificate-icon">📜</div>
                <span>{cert.title}</span>
                {cert.file?.url && (
                  <a href={cert.file.url} target="_blank" rel="noreferrer" style={{ marginLeft: 8 }}>Скачать</a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Наша команда</h2>
          <div className="team-stats">
            <div className="team-stat">
              <div className="stat-number">150+</div>
              <div className="stat-label">Сотрудников</div>
            </div>
            <div className="team-stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Инженеров</div>
            </div>
            <div className="team-stat">
              <div className="stat-number">25+</div>
              <div className="stat-label">Технологов</div>
            </div>
            <div className="team-stat">
              <div className="stat-number">10+</div>
              <div className="stat-label">Лет опыта</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

