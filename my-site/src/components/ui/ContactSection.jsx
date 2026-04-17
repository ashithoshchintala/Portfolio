import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, ExternalLink, GitBranch, Send } from 'lucide-react';

const contactLinks = [
  { icon: Mail,         label: 'Email',    value: 'ashithoshchintala111@gmail.com',     href: 'mailto:ashithoshchintala111@gmail.com' },
  { icon: Phone,        label: 'Phone',    value: '+91 8019109347',                     href: 'tel:+918019109347' },
  { icon: ExternalLink, label: 'LinkedIn', value: 'linkedin.com/in/ashithosh-chintala', href: 'https://linkedin.com/in/ashithosh-chintala' },
  { icon: GitBranch,    label: 'GitHub',   value: 'github.com/ashithoshchintala',       href: 'https://github.com/ashithoshchintala' },
  { icon: MapPin,       label: 'Location', value: 'Hyderabad, Telangana',               href: null },
];

const ContactSection = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Aceternity-style 3D perspective rotation driven by scroll
  const rotateX = useTransform(scrollYProgress, [0, 0.35, 0.55], [40, 5, 0]);
  const scale   = useTransform(scrollYProgress, [0, 0.35, 0.55], [0.8, 0.96, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.35, 0.55], [100, 20, 0]);

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      <div className="contact-glow contact-glow-1" />
      <div className="contact-glow contact-glow-2" />

      <div className="contact-inner">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="contact-header"
        >
          <div className="hero-badge mb-4">
            <Send className="h-4 w-4 text-purple-400" />
            <span>Get In Touch</span>
          </div>
          <h2 className="contact-title">Let's Connect</h2>
          <p className="contact-subtitle">Open to opportunities and collaborations</p>
        </motion.div>

        {/* 3D scroll-triggered card — Aceternity style */}
        <div className="contact-perspective" ref={cardRef}>
          <motion.div
            style={{ rotateX, scale, translateY }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="contact-card-3d"
          >
            <div className="contact-card">
              {contactLinks.map(({ icon: Icon, label, value, href }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.12 + 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="contact-row"
                >
                  <div className="contact-icon-wrap">
                    <Icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="contact-info">
                    <span className="contact-label">{label}</span>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="contact-value contact-value-link">
                        {value}
                      </a>
                    ) : (
                      <span className="contact-value">{value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 3D reflection shadow */}
            <div className="contact-card-shadow" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
