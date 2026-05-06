import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import AetherFlowHero from '@/components/ui/aether-flow-hero';
import Navbar from '@/components/ui/Navbar';
import EducationSection from '@/components/ui/EducationSection';
import ProfessionalSummary from '@/components/ui/ProfessionalSummary';
import ProjectsSection from '@/components/ui/ProjectsSection';
import SkillsOrbit from '@/components/ui/SkillsOrbit';
import CertificationsSection from '@/components/ui/CertificationsSection';
import ContactSection from '@/components/ui/ContactSection';
import AnimatedShaderBackground from '@/components/ui/AnimatedShaderBackground';

// ─── Cinematic scroll transition divider ─────────────────────────────────────
const ScrollTransition = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scaleX = useSpring(useTransform(scrollYProgress, [0, 0.5], [0, 1]), {
    stiffness: 60, damping: 25, mass: 0.5,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const dotScale = useSpring(useTransform(scrollYProgress, [0, 0.4, 0.6], [0.4, 1.2, 1]), {
    stiffness: 100, damping: 15,
  });

  return (
    <div ref={ref} className="transition-divider">
      <motion.div style={{ scaleX, opacity }} className="transition-line" />
      <motion.div style={{ opacity, scale: dotScale }} className="transition-dot-wrap">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="transition-dot"
        />
      </motion.div>
      <motion.div style={{ opacity }} className="transition-vline" />
    </div>
  );
};

// ─── Main LandingPage ─────────────────────────────────────────────────────────
const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  // Fade in the shader background as the user scrolls from the Hero to Page 2
  const shaderOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);

  return (
    <div className="text-white min-h-screen font-sans selection:bg-purple-500/30">
      
      {/* Dynamic Animated Shader Background (Visible from Page 2 onwards) */}
      <motion.div style={{ opacity: shaderOpacity }} className="fixed inset-0 pointer-events-none -z-20">
        <AnimatedShaderBackground />
      </motion.div>

      {/* Fixed navigation */}
      <Navbar />

      {/* Page 1: Hero */}
      <div id="hero">
        <AetherFlowHero />
      </div>

      <ScrollTransition />

      {/* Page 2: Professional Summary */}
      <ProfessionalSummary />

      <ScrollTransition />

      {/* Page 3: Education Journey */}
      <EducationSection />

      <ScrollTransition />

      {/* Page 3: Projects Portfolio */}
      <ProjectsSection />

      <ScrollTransition />

      {/* Page 4: Technical Skills */}
      <SkillsOrbit />

      <ScrollTransition />

      {/* Page 5: Certifications */}
      <CertificationsSection />

      <ScrollTransition />

      {/* Page 6: Contact & Links */}
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