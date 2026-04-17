import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = () => {
  const [active, setActive] = useState('hero');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show navbar after hero loads
    const timer = setTimeout(() => setVisible(true), 1500);

    // Track active section via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.35 }
    );

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="navbar"
        >
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`navbar-btn ${active === id ? 'navbar-btn-active' : ''}`}
            >
              {label}
            </button>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
