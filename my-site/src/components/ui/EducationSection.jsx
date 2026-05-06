import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, MapPin, Award, ChevronRight } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

const education = [
  {
    degree: 'Higher Secondary',
    school: 'Delhi Public School',
    location: 'Warangal',
    gpa: '8.2',
    year: 'Completed',
    color: '#a78bfa',
  },
  {
    degree: 'B.Tech CSE',
    school: 'SRM Institute of Science and Technology',
    location: 'Chennai',
    gpa: '8.5',
    year: 'Completed',
    color: '#818cf8',
  },
  {
    degree: 'M.Tech AI & Data Science',
    school: 'IIT Patna',
    location: 'Patna',
    gpa: 'Pursuing',
    year: 'Current',
    color: '#c084fc',
  },
];

const NodeCard = ({ data, index, isInView }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { delay: index * 0.25 + 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="edu-node"
    >
      {/* Node number badge */}
      <div className="edu-node-number" style={{ borderColor: data.color }}>
        <span style={{ color: data.color }}>{String(index + 1).padStart(2, '0')}</span>
      </div>

      {/* Card content */}
      <div className="edu-node-card">
        <div className="edu-node-header">
          <GraduationCap className="h-5 w-5" style={{ color: data.color }} />
          <span className="edu-node-year" style={{ color: data.color }}>{data.year}</span>
        </div>

        <h3 className="edu-node-degree">{data.degree}</h3>
        <p className="edu-node-school">{data.school}</p>

        <div className="edu-node-meta">
          <span className="edu-node-location">
            <MapPin className="h-3.5 w-3.5" />
            {data.location}
          </span>
          <span className="edu-node-gpa" style={{ borderColor: `${data.color}60`, color: data.color }}>
            <Award className="h-3.5 w-3.5" />
            GPA: {data.gpa}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const EducationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="education" className="edu-section">
      <ParticleBackground
        particleColor="rgba(129, 140, 248, 0.5)"
        lineColor="rgba(129, 140, 248, 0.12)"
        particleCount={35}
        connectDistance={130}
        speed={0.25}
      />
      <div className="edu-glow edu-glow-1" />
      <div className="edu-glow edu-glow-2" />

      <div ref={ref} className="edu-inner">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="edu-header"
        >
          <div className="hero-badge mb-6">
            <GraduationCap className="h-4 w-4 text-purple-400" />
            <span>Education Journey</span>
          </div>
          <h2 className="edu-title">Academic Path</h2>
          <p className="edu-subtitle">From foundations to frontier AI research</p>
        </motion.div>

        {/* Workflow nodes */}
        <div className="edu-workflow">
          {/* Connector line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="edu-connector"
          />

          {/* Animated pulse on connector */}
          {isInView && <div className="edu-connector-pulse" />}

          {/* Node cards */}
          {education.map((edu, i) => (
            <React.Fragment key={edu.degree}>
              <NodeCard data={edu} index={i} isInView={isInView} />
              {i < education.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: i * 0.25 + 0.6, duration: 0.5 }}
                  className="edu-arrow"
                >
                  <ChevronRight className="h-5 w-5 text-purple-400" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
