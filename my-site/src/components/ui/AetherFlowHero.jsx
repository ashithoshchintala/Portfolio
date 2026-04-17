import React from 'react';
import './AetherFlowHero.css';
import heroImage from '../../assets/hero.png';

const AetherFlowHero = () => {
  return (
    <section className="aether-flow-hero">
      <div className="hero-content">
        <h1>AetherFlow</h1>
        <p className="hero-subtitle">Unleash the power of modern web experiences.</p>
        <button className="hero-cta-button">Get Started</button>
      </div>
      <div className="hero-image-container">
        <img src={heroImage} alt="AetherFlow Hero" className="hero-image" />
      </div>
    </section>
  );
};

export default AetherFlowHero;