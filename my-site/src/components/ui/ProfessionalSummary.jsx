import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { User, Target, Brain, Lightbulb, Wrench, BookOpen, ExternalLink } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

const keyAttributes = [
  {
    icon: Target,
    title: 'Goal-Oriented',
    desc: 'Focused on delivering high-accuracy AI models, achieving 93.02% accuracy on sound classification tasks.',
    color: '#8b5cf6',
  },
  {
    icon: Brain,
    title: 'Analytical Mindset',
    desc: 'Strong foundation in complex data processing, statistical analysis, and algorithmic optimization.',
    color: '#6366f1',
  },
  {
    icon: BookOpen,
    title: 'Continuous Learner',
    desc: 'Actively expanding expertise through certifications in NLP, AI, and emerging technologies.',
    color: '#06b6d4',
  },
  {
    icon: Wrench,
    title: 'Problem Solver',
    desc: 'Experienced in developing unique frameworks, including Time-Frequency attention mechanisms for noise-resilient systems.',
    color: '#10b981',
  },
];

const keyStrengths = [
  'Proficient in Python and SQL for data manipulation and analysis.',
  'Expertise in Machine Learning & Deep Learning (BERT, Whisper ASR, EfficientNetV2).',
  'Advanced Data Visualization using Power BI, Matplotlib, and Seaborn.',
  'Hands-on experience with NLP pipelines and sentiment analysis.',
  'Proven research capability with publications in IEEE Xplore.',
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 + 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

const ProfessionalSummary = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="summary" className="summary-section">
      <ParticleBackground
        particleColor="rgba(139, 92, 246, 0.3)"
        lineColor="rgba(99, 102, 241, 0.07)"
        particleCount={25}
        connectDistance={110}
        speed={0.14}
      />
      <div className="summary-glow summary-glow-1" />
      <div className="summary-glow summary-glow-2" />

      <div ref={ref} className="summary-inner">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="summary-header"
        >
          <div className="hero-badge mb-4">
            <User className="h-4 w-4 text-purple-400" />
            <span>Professional Summary</span>
          </div>
          <h2 className="summary-title">About Me</h2>
          <div className="summary-title-underline" />
        </motion.div>

        {/* Two-column layout */}
        <div className="summary-grid">
          {/* LEFT: About Me + Career Objective */}
          <div className="summary-left">
            {/* About Me Card */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="summary-card summary-about-card"
            >
              <h3 className="summary-card-heading">About Me</h3>
              <p className="summary-text">
                I'm Ashithosh Chintala, a results-driven professional specializing in
                Data Science and Machine Learning. With a strong technical foundation
                and hands-on experience in building noise-resilient environmental
                sound classification models and optimizing medical imaging through
                genetic algorithms, I am eager to apply my expertise to solve complex
                real-world challenges.
              </p>
              <p className="summary-text">
                My journey in data science is defined by a passion for extracting
                actionable insights and developing innovative AI solutions. I have
                developed proficiency in Python, SQL, and deep learning frameworks
                through rigorous academic projects and professional certifications.
                My goal is to join a forward-thinking team where I can contribute to
                cutting-edge research and data-driven development.
              </p>
            </motion.div>

            {/* Career Objective */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="summary-card summary-objective-card"
            >
              <h3 className="summary-card-heading">
                <Target className="h-4 w-4" style={{ color: '#a78bfa' }} />
                Career Objective
              </h3>
              <p className="summary-text">
                To secure a challenging role as a Data Analyst or Machine Learning
                Engineer where I can leverage my expertise in NLP, Deep Learning, and
                advanced data analytics to contribute to organizational success and
                drive technological innovation.
              </p>
            </motion.div>

            {/* IEEE Publication */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="summary-card summary-publication-card"
            >
              <div className="summary-pub-badge">
                <BookOpen className="h-3.5 w-3.5" />
                <span>IEEE Publication</span>
              </div>
              <h3 className="summary-pub-title">
                Sound Classification via Time-Frequency Attention-based DNN
              </h3>
              <p className="summary-text summary-pub-desc">
                Published in IEEE Xplore, this work introduces a novel framework
                using GradCAM++ and EfficientNetV2 for noise-resilient classification.
              </p>
              <a
                href="https://ieeexplore.ieee.org/document/10859684"
                target="_blank"
                rel="noopener noreferrer"
                className="summary-pub-link"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View on IEEE Xplore</span>
              </a>
            </motion.div>
          </div>

          {/* RIGHT: Key Attributes + Key Strengths */}
          <div className="summary-right">
            {/* Key Attributes Grid */}
            <div className="summary-attributes-grid">
              {keyAttributes.map((attr, i) => (
                <motion.div
                  key={attr.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="summary-attr-card"
                >
                  <div
                    className="summary-attr-icon"
                    style={{
                      background: `${attr.color}15`,
                      borderColor: `${attr.color}40`,
                    }}
                  >
                    <attr.icon className="h-5 w-5" style={{ color: attr.color }} />
                  </div>
                  <h4 className="summary-attr-title">{attr.title}</h4>
                  <p className="summary-attr-desc">{attr.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Key Strengths */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="summary-card summary-strengths-card"
            >
              <h3 className="summary-card-heading">
                <Lightbulb className="h-4 w-4" style={{ color: '#fbbf24' }} />
                Key Strengths
              </h3>
              <ul className="summary-strengths-list">
                {keyStrengths.map((s, i) => (
                  <motion.li
                    key={i}
                    custom={i + 5}
                    variants={fadeUp}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="summary-strength-item"
                  >
                    <span className="summary-bullet" />
                    <span>{s}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalSummary;
