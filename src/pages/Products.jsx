import React, { useEffect, useState } from 'react';
import { productsAPI } from '../services/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await productsAPI.getProducts({ page: 1, limit: 24 });
        setProducts(res.data.items || []);
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="products">
      <section className="hero-section">
        <div className="container">
          <h1>Каталог продукции</h1>
          <p>Широкий спектр металлоконструкций и оборудования для различных отраслей промышленности</p>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="products-grid">
            {loading ? 'Загрузка...' : products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img src={product.image?.url} alt={product.title} />
                </div>
                <div className="product-content">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-description">{product.description}</p>
                  <a href="/contacts" className="product-link">Узнать больше</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Преимущества нашей продукции</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏭</div>
              <h3>Собственное производство</h3>
              <p>Полный цикл производства от проектирования до готовой продукции</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3>Современное оборудование</h3>
              <p>Использование передовых технологий и высокоточного оборудования</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Контроль качества</h3>
              <p>Многоуровневая система контроля качества на всех этапах производства</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Доставка и монтаж</h3>
              <p>Полный комплекс услуг включая доставку и профессиональный монтаж</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;

