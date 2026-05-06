import React, { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

const skills = [
  { name: 'Python', icon: 'https://cdn.simpleicons.org/python/3776AB', orbit: 1, category: 'Languages' },
  { name: 'TensorFlow', icon: 'https://cdn.simpleicons.org/tensorflow/FF6F00', orbit: 1, category: 'Libraries' },
  { name: 'OpenCV', icon: 'https://cdn.simpleicons.org/opencv/5C3EE8', orbit: 1, category: 'Libraries' },
  { name: 'Pandas', icon: 'https://cdn.simpleicons.org/pandas/E70488', orbit: 1, category: 'Libraries' },
  { name: 'Scikit-learn', icon: 'https://cdn.simpleicons.org/scikitlearn/F7931E', orbit: 1, category: 'Libraries' },
  { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/white', orbit: 1, category: 'Tools' },
  { name: 'C++', icon: 'https://cdn.simpleicons.org/cplusplus/00599C', orbit: 2, category: 'Languages' },
  { name: 'MySQL', icon: 'https://cdn.simpleicons.org/mysql/4479A1', orbit: 2, category: 'Databases' },
  { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/47A248', orbit: 2, category: 'Databases' },
  { name: 'PyTorch', icon: 'https://cdn.simpleicons.org/pytorch/EE4C2C', orbit: 2, category: 'Libraries' },
  { name: 'Power BI', icon: 'https://img.icons8.com/?size=100&id=Ny0t2MYrJ70p&format=png&color=000000', orbit: 2, category: 'Tools' },
];

const categories = [
  { title: 'Languages', items: ['Python', 'C++', 'SQL', 'Bash'] },
  { title: 'Libraries', items: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'OpenCV'] },
  { title: 'Databases', items: ['MySQL', 'MongoDB'] },
  { title: 'Tools', items: ['Git / GitHub', 'Power BI', 'Jupyter'] },
];

const SkillsOrbit = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [paused, setPaused] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);

  const inner = skills.filter(s => s.orbit === 1);
  const outer = skills.filter(s => s.orbit === 2);

  const handleOrbitClick = useCallback((e) => {
    // Find the closest orbit-logo element from click target
    const logo = e.target.closest('.orbit-logo');
    if (logo) {
      const name = logo.getAttribute('data-skill');
      if (activeSkill === name) {
        setActiveSkill(null);
        setPaused(false);
      } else {
        setActiveSkill(name);
        setPaused(true);
      }
    } else {
      setActiveSkill(null);
      setPaused(false);
    }
  }, [activeSkill]);

  return (
    <section id="skills" className="orbit-section">
      <ParticleBackground
        particleColor="rgba(0, 200, 200, 0.35)"
        lineColor="rgba(139, 92, 246, 0.08)"
        particleCount={30}
        connectDistance={120}
        speed={0.18}
      />
      <div className="orbit-glow orbit-glow-1" />
      <div className="orbit-glow orbit-glow-2" />

      <div ref={ref} className="orbit-inner">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="orbit-header"
        >
          <div className="hero-badge mb-4">
            <Cpu className="h-4 w-4 text-purple-400" />
            <span>Technical Skills</span>
          </div>
          <h2 className="orbit-title">Tech Stack</h2>
          <p className="orbit-subtitle">Technologies I work with daily</p>
        </motion.div>

        {/* Orbit visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`orbit-container ${paused ? 'orbit-paused' : ''}`}
          onClick={handleOrbitClick}
        >
          {/* Glowing ring effects */}
          <div className="orbit-ring-glow orbit-ring-glow-inner" />
          <div className="orbit-ring-glow orbit-ring-glow-outer" />

          {/* Center hub */}
          <div className="orbit-hub">
            <div className="orbit-hub-icon">&lt;&gt;</div>
          </div>

          {/* Inner orbit */}
          <div className="orbit-ring orbit-ring-inner">
            <div className="orbit-track orbit-track-inner">
              {inner.map((skill, i) => {
                const angle = (360 / inner.length) * i;
                const isActive = activeSkill === skill.name;
                return (
                  <div key={skill.name} className="orbit-logo-wrap"
                    style={{ '--angle': `${angle}deg` }}>
                    <div className={`orbit-logo ${isActive ? 'orbit-logo-active' : ''}`}
                      data-skill={skill.name}>
                      <img src={skill.icon} alt={skill.name} className="orbit-logo-img" />
                    </div>
                    {/* Name label always positioned below the logo */}
                    <div className={`orbit-logo-label ${isActive ? 'orbit-logo-label-show' : ''}`}>
                      {skill.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outer orbit */}
          <div className="orbit-ring orbit-ring-outer">
            <div className="orbit-track orbit-track-outer">
              {outer.map((skill, i) => {
                const angle = (360 / outer.length) * i;
                const isActive = activeSkill === skill.name;
                return (
                  <div key={skill.name} className="orbit-logo-wrap"
                    style={{ '--angle': `${angle}deg` }}>
                    <div className={`orbit-logo ${isActive ? 'orbit-logo-active' : ''}`}
                      data-skill={skill.name}>
                      <img src={skill.icon} alt={skill.name} className="orbit-logo-img" />
                    </div>
                    <div className={`orbit-logo-label ${isActive ? 'orbit-logo-label-show' : ''}`}>
                      {skill.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active skill tooltip */}
          {activeSkill && (
            <motion.div
              key={activeSkill}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="orbit-active-label"
            >
              {activeSkill}
            </motion.div>
          )}
        </motion.div>

        {/* Skills Table Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="skills-grid"
        >
          {categories.map((cat) => (
            <div key={cat.title} className="skills-grid-card">
              <h4 className="skills-grid-title">{cat.title}</h4>
              <div className="skills-grid-items">
                {cat.items.map(item => (
                  <span key={item} className="skills-grid-tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsOrbit;
