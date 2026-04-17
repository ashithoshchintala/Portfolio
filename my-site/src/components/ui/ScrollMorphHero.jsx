"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const ScrollMorphHero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const items = Array.from({ length: 12 });

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full bg-[#0a0a0a]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {items.map((_, index) => {
          const angle = (index / items.length) * Math.PI * 2;
          const randomX = Math.cos(angle) * 400 + (Math.random() - 0.5) * 100;
          const randomY = Math.sin(angle) * 400 + (Math.random() - 0.5) * 100;
          const circleX = Math.cos(angle) * 150;
          const circleY = Math.sin(angle) * 150;
          const arcAngle = (index / (items.length - 1)) * Math.PI - Math.PI;
          const arcX = Math.cos(arcAngle) * 300;
          const arcY = Math.sin(arcAngle) * 300 + 150;

          const x = useTransform(smoothProgress, [0, 0.3, 0.6, 1], [randomX, circleX, arcX, arcX * 1.2]);
          const y = useTransform(smoothProgress, [0, 0.3, 0.6, 1], [randomY, circleY, arcY, arcY * 1.2]);
          const scale = useTransform(smoothProgress, [0, 0.3, 0.6, 1], [0.5, 1, 0.8, 1.5]);
          const rotate = useTransform(smoothProgress, [0, 0.6], [index * 30, 0]);

          const colors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF", "#FF0080", "#00FFFF", "#00FF80", "#80FF00", "#FF0040"];

          return (
            <motion.div
              key={index}
              style={{ x, y, scale, rotate, backgroundColor: colors[index % colors.length] }}
              className="absolute w-12 h-12 rounded-full blur-xl opacity-80 shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            />
          );
        })}

        <motion.div
          style={{
            opacity: useTransform(smoothProgress, [0.5, 0.7], [0, 1]),
            scale: useTransform(smoothProgress, [0.7, 1], [0.8, 1.2]),
          }}
          className="z-10 text-center"
        >
          <h1 className="text-6xl font-bold text-white tracking-tighter">
            FUTURE READY
          </h1>
          <p className="text-gray-400 mt-4 text-xl">Morphing the boundaries of UI</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ScrollMorphHero;
