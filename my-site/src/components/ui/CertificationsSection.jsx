import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Calendar, Building2, ChevronRight } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

const certifications = [
  {
    issuer: 'PrepInsta Technologies Pvt. Ltd',
    title: 'NLP and Deep Learning',
    date: '21 Aug 2025',
    description: 'Comprehensive training in Natural Language Processing techniques including tokenization, embeddings, transformers, and deep learning architectures for text analysis and generation.',
    link: 'https://drive.google.com/file/d/1BNP7QI5fXLBZ-8kA2nC_6B5mkFOtmEKG/view',
    color: '#8b5cf6',
    icon: '🧠',
  },
  {
    issuer: 'PrepInsta Technologies Pvt. Ltd',
    title: 'Machine Learning & AI',
    date: '06 Aug 2025',
    description: 'In-depth coursework covering supervised and unsupervised learning, neural networks, model optimization, and real-world AI application development.',
    link: 'https://drive.google.com/file/d/15wXml3P_Gb7lrCoWZKwGtyoSXfhVJhYF/view',
    color: '#6366f1',
    icon: '🤖',
  },
  {
    issuer: 'Antigravity',
    title: 'Theoretical Propulsion & Gravimetrics',
    date: 'Ongoing',
    description: 'Developed a comprehensive understanding of theoretical propulsion and gravimetric manipulation, exploring advanced physics concepts to challenge traditional aerodynamic constraints.',
    link: null,
    color: '#06b6d4',
    icon: '🚀',
  },
  {
    issuer: 'FreeCodeCamp',
    title: 'Data Analysis With Python',
    date: '10 Jul 2024',
    description: 'Mastered data analysis workflows using Python, including data cleaning, visualization with Matplotlib, statistical analysis, and working with real-world datasets.',
    link: 'https://www.freecodecamp.org/certification/fcc247e813c-a2bb-4a73-ad7e-ae84ac2dae5c/data-analysis-with-python-v7',
    color: '#10b981',
    icon: '📊',
  },
  {
    issuer: 'Great Learning Academy',
    title: 'Power BI',
    date: '07 May 2024',
    description: 'Proficiency in Microsoft Power BI for building interactive dashboards, data modeling, DAX formulas, and transforming raw data into actionable business intelligence.',
    link: null,
    color: '#f59e0b',
    icon: '📈',
  },
  {
    issuer: 'IBM',
    title: 'Data Analysis With Python',
    date: '02 May 2024',
    description: 'IBM-certified program covering data wrangling, exploratory data analysis, model development, and evaluation using Python scientific computing libraries.',
    link: 'https://www.coursera.org/account/accomplishments/verify/RPC9J9YDEU3M',
    color: '#3b82f6',
    icon: '🔬',
  },
  {
    issuer: 'AWS',
    title: 'Machine Learning Fundamentals',
    date: '04 May 2023',
    description: 'Foundation in AWS machine learning services, including SageMaker, data engineering pipelines, and deploying ML models at scale on cloud infrastructure.',
    link: 'https://www.credly.com/badges/8605001c-57e3-4b40-911e-203a34f230f1/print',
    color: '#f97316',
    icon: '☁️',
  },
];

const CertCard = ({ cert, index, isInView }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: index * 0.1 + 0.3,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="cert-card-wrapper"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`cert-card-flipper ${isFlipped ? 'cert-card-flipped' : ''}`}>
        {/* FRONT */}
        <div className="cert-card-face cert-card-front" style={{ '--cert-color': cert.color }}>
          {/* Glow accent line */}
          <div className="cert-card-accent" style={{ background: `linear-gradient(90deg, transparent, ${cert.color}, transparent)` }} />

          {/* Icon */}
          <div className="cert-card-icon-wrap" style={{ background: `${cert.color}15`, borderColor: `${cert.color}40` }}>
            <span className="cert-card-emoji">{cert.icon}</span>
          </div>

          {/* Content */}
          <div className="cert-card-content">
            <div className="cert-card-issuer">
              <Building2 className="h-3 w-3" style={{ color: cert.color }} />
              <span>{cert.issuer}</span>
            </div>
            <h3 className="cert-card-title">{cert.title}</h3>
            <div className="cert-card-date">
              <Calendar className="h-3 w-3" />
              <span>{cert.date}</span>
            </div>
          </div>

          {/* Hover hint */}
          <div className="cert-card-hint">
            <ChevronRight className="h-3.5 w-3.5" />
          </div>

          {/* Corner glow */}
          <div className="cert-card-corner-glow" style={{ background: `radial-gradient(circle at 100% 0%, ${cert.color}20, transparent 70%)` }} />
        </div>

        {/* BACK */}
        <div className="cert-card-face cert-card-back" style={{ '--cert-color': cert.color }}>
          <div className="cert-card-accent" style={{ background: `linear-gradient(90deg, transparent, ${cert.color}, transparent)` }} />

          <div className="cert-card-back-content">
            <div className="cert-card-back-header">
              <span className="cert-card-emoji-sm">{cert.icon}</span>
              <h4 className="cert-card-back-title">{cert.title}</h4>
            </div>
            <p className="cert-card-desc">{cert.description}</p>

            {cert.link && (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-card-link"
                style={{ borderColor: `${cert.color}50`, color: cert.color }}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View Certificate</span>
              </a>
            )}

            {!cert.link && (
              <div className="cert-card-link cert-card-link-disabled">
                <Award className="h-3.5 w-3.5" />
                <span>Credential on file</span>
              </div>
            )}
          </div>

          <div className="cert-card-corner-glow" style={{ background: `radial-gradient(circle at 0% 100%, ${cert.color}20, transparent 70%)` }} />
        </div>
      </div>

      {/* Floating glow shadow */}
      <div className="cert-card-shadow" style={{ background: `radial-gradient(ellipse at center, ${cert.color}15, transparent 70%)` }} />
    </motion.div>
  );
};

const CertificationsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="certifications" className="cert-section">
      <ParticleBackground
        particleColor="rgba(99, 102, 241, 0.3)"
        lineColor="rgba(139, 92, 246, 0.08)"
        particleCount={28}
        connectDistance={115}
        speed={0.16}
      />
      <div className="cert-glow cert-glow-1" />
      <div className="cert-glow cert-glow-2" />

      <div ref={ref} className="cert-inner">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="cert-header"
        >
          <div className="hero-badge mb-4">
            <Award className="h-4 w-4 text-purple-400" />
            <span>Professional Certifications</span>
          </div>
          <h2 className="cert-section-title">Credentials & Achievements</h2>
          <p className="cert-section-subtitle">
            Continuous learning validated through industry-recognized certifications
          </p>
        </motion.div>

        {/* Count badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="cert-count-badge"
        >
          <span className="cert-count-number">{certifications.length}</span>
          <span className="cert-count-label">Certifications Earned</span>
        </motion.div>

        {/* Grid */}
        <div className="cert-grid">
          {certifications.map((cert, i) => (
            <CertCard key={cert.title + cert.issuer} cert={cert} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Timeline connector */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="cert-timeline"
        >
          <div className="cert-timeline-line" />
          <div className="cert-timeline-glow" />
        </motion.div>
      </div>
    </section>
  );
};

export default CertificationsSection;
