import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import AetherFlowHero from '@/components/ui/aether-flow-hero';
import Navbar from '@/components/ui/Navbar';
import EducationSection from '@/components/ui/EducationSection';
import ProjectsSection from '@/components/ui/ProjectsSection';
import SkillsOrbit from '@/components/ui/SkillsOrbit';
import ContactSection from '@/components/ui/ContactSection';

// ─── Cinematic scroll transition divider ─────────────────────────────────────
const ScrollTransition = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scaleX = useSpring(useTransform(scrollYProgress, [0, 0.5], [0, 1]), {
    stiffness: 80, damping: 20,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="transition-divider">
      <motion.div style={{ scaleX, opacity }} className="transition-line" />
      <motion.div style={{ opacity }} className="transition-dot-wrap">
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="transition-dot"
        />
      </motion.div>
    </div>
  );
};

// ─── Main LandingPage ─────────────────────────────────────────────────────────
const LandingPage = () => {
  return (
    <div className="text-white min-h-screen font-sans selection:bg-purple-500/30">

      {/* Fixed navigation */}
      <Navbar />

      {/* Page 1: Hero */}
      <div id="hero">
        <AetherFlowHero />
      </div>

      <ScrollTransition />

      {/* Page 2: Education Journey */}
      <EducationSection />

      <ScrollTransition />

      {/* Page 3: Projects Portfolio */}
      <ProjectsSection />

      <ScrollTransition />

      {/* Page 4: Technical Skills */}
      <SkillsOrbit />

      <ScrollTransition />

      {/* Page 5: Contact & Links */}
      <ContactSection />

      {/* Footer */}
      <footer className="py-12 text-center border-t border-white/5">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-gray-500 text-sm tracking-widest uppercase"
        >
          &copy; {new Date().getFullYear()} Ashithosh Chintala — Crafted for the Future
        </motion.p>
      </footer>
    </div>
  );
};

export default LandingPage;