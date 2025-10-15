import React, { useState, useEffect } from 'react';
import './HeroSlider.css';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Массив фотографий из папки resource/photo
  const slides = [
    {
      id: 1,
      image: '/Resourse/Photo/istockphoto-1390249924-1024x1024.jpg',
      title: 'Основано на надежности, разработано для успеха',
      subtitle: 'Ведущий производитель стальных конструкций для гражданского и промышленного строительства, горно-шахтного оборудования и оборудования для железнодорожного транспорта.'
    },
    {
      id: 2,
      image: '/Resourse/Photo/istockphoto-666132290-1024x1024.jpg',
      title: 'Современные технологии производства',
      subtitle: 'Используем передовое оборудование и инновационные решения для создания высококачественной металлопродукции.'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop',
      title: 'Качественные металлоконструкции',
      subtitle: 'Производство надежных и долговечных металлических конструкций для различных отраслей промышленности.'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&h=1080&fit=crop',
      title: 'Профессиональный подход',
      subtitle: 'Команда опытных специалистов обеспечивает высокое качество и точность выполнения заказов.'
    }
  ];

  // Автоматическая смена слайдов
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === slides.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Смена каждые 5 секунд

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsPaused(true);
    // Возобновляем автопрокрутку через 3 секунды
    setTimeout(() => setIsPaused(false), 3000);
  };

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <div 
      className={`hero-slider ${isPaused ? 'paused' : ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay">
              <div className="slide-content">
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <div className="slide-buttons">
                  <a href="/products" className="btn">Узнать больше</a>
                  <a href="/products" className="btn btn-secondary">Смотреть продукцию</a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Навигационные стрелки */}
      <button className="slider-arrow slider-arrow-left" onClick={prevSlide}>
        <span>‹</span>
      </button>
      <button className="slider-arrow slider-arrow-right" onClick={nextSlide}>
        <span>›</span>
      </button>

      {/* Индикаторы слайдов */}
      <div className="slider-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Прогресс-бар */}
      <div className="slider-progress">
        <div 
          className="progress-bar" 
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default HeroSlider;
