import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, MapPin, Calendar, Building2 } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

const experiences = [
  {
    company: 'Xylofy AI',
    role: 'AI Data Analyst Intern',
    date: 'Apr 2026 – May 2026',
    location: 'Hyderabad',
    color: '#8b5cf6',
    bullets: [
      'Fraud Detection: Built a production-grade fraud detection system using LightGBM and SMOTE, achieving 92%+ precision with SHAP-powered explainability; integrated into a live Streamlit dashboard reducing manual risk review time by ~40%',
      'Churn Prediction: Developed XGBoost and Random Forest models segmenting telecom users into risk tiers, improving churn identification accuracy by 18% and enabling targeted retention strategies across 50,000+ customer records',
      'NLP Analysis: Analyzed 4,984 customer reviews using TextBlob sentiment analysis, surfacing 3 critical service failure patterns that directly informed product team decisions',
    ],
  },
  {
    company: 'Outlier AI',
    role: 'Math Expert AI Trainer (Freelancer)',
    date: 'Nov 2024 – May 2025',
    location: 'Remote',
    color: '#6366f1',
    bullets: [
      'Completed 50+ hours of AI training and mathematical reasoning tasks for Outlier AI, contributing to model evaluation, quality assurance, and data annotation initiatives',
    ],
  },
];

const TimelineCard = ({ exp, index, isInView, total }) => {
  const isLeft = index % 2 === 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.25 + 0.3,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className={`exp-timeline-item ${isLeft ? 'exp-timeline-left' : 'exp-timeline-right'}`}>
      {/* Timeline node dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: index * 0.25 + 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="exp-timeline-node"
        style={{ borderColor: exp.color, boxShadow: `0 0 20px ${exp.color}40, 0 0 40px ${exp.color}20` }}
      >
        <Briefcase className="h-3.5 w-3.5" style={{ color: exp.color }} />
      </motion.div>

      {/* Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="exp-timeline-card"
      >
        {/* Top accent glow line */}
        <div
          className="exp-card-accent"
          style={{ background: `linear-gradient(90deg, transparent, ${exp.color}, transparent)` }}
        />

        {/* Company & role header */}
        <div className="exp-card-header">
          <div className="exp-card-company-wrap">
            <Building2 className="h-4 w-4" style={{ color: exp.color }} />
            <span className="exp-card-company" style={{ color: exp.color }}>{exp.company}</span>
          </div>
          <h3 className="exp-card-role">{exp.role}</h3>
        </div>

        {/* Meta chips — date & location */}
        <div className="exp-card-meta">
          <span className="exp-card-date-badge">
            <Calendar className="h-3 w-3" />
            {exp.date}
          </span>
          <span className="exp-card-location-chip">
            <MapPin className="h-3 w-3" />
            {exp.location}
          </span>
        </div>

        {/* Bullet points */}
        <ul className="exp-card-bullets">
          {exp.bullets.map((bullet, bi) => (
            <motion.li
              key={bi}
              initial={{ opacity: 0, x: isLeft ? -15 : 15 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.25 + 0.5 + bi * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="exp-card-bullet"
            >
              <span className="exp-bullet-marker" style={{ background: exp.color }} />
              <span>{bullet}</span>
            </motion.li>
          ))}
        </ul>

        {/* Corner glow */}
        <div
          className="exp-card-corner-glow"
          style={{ background: `radial-gradient(circle at 100% 0%, ${exp.color}18, transparent 70%)` }}
        />
      </motion.div>
    </div>
  );
};

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="exp-timeline-section">
      <ParticleBackground
        particleColor="rgba(99, 200, 200, 0.4)"
        lineColor="rgba(139, 92, 246, 0.1)"
        particleCount={30}
        connectDistance={120}
        speed={0.2}
      />
      <div className="exp-glow exp-glow-1" />
      <div className="exp-glow exp-glow-2" />

      <div ref={ref} className="exp-inner">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="exp-header"
        >
          <div className="hero-badge mb-6">
            <Briefcase className="h-4 w-4 text-purple-400" />
            <span>Professional Experience</span>
          </div>
          <h2 className="exp-section-title">Work Experience</h2>
          <p className="exp-section-subtitle">Building real-world AI solutions</p>
        </motion.div>

        {/* Timeline container */}
        <div className="exp-timeline-container">
          {/* Animated vertical timeline line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ delay: 0.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="exp-timeline-line"
          />

          {/* Animated glow pulse on the line */}
          {isInView && <div className="exp-timeline-pulse" />}

          {/* Experience cards */}
          {experiences.map((exp, i) => (
            <TimelineCard
              key={exp.company}
              exp={exp}
              index={i}
              isInView={isInView}
              total={experiences.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
