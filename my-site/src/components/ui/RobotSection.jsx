import React, { useRef, useEffect, useState, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Calendar, MapPin, ExternalLink, GitBranch, Award } from 'lucide-react';

// ─── Animated neural network canvas (replaces Spline for reliability) ────────
const NeuralCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let nodes = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initNodes();
    };

    function initNodes() {
      nodes = [];
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const count = Math.floor((w * h) / 4000);
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 2.5 + 1,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Update nodes
      const time = Date.now() * 0.001;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        const pulseSize = n.r + Math.sin(time + n.pulse) * 0.5;

        // Draw glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pulseSize * 4);
        grad.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
        grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(n.x - pulseSize * 4, n.y - pulseSize * 4, pulseSize * 8, pulseSize * 8);

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${0.6 + Math.sin(time + n.pulse) * 0.2})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.25;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="neural-canvas" />;
};

// ─── Stat chip ──────────────────────────────────────────────────────────────
const StatChip = ({ value, label }) => (
  <div className="stat-chip">
    <span className="stat-chip-value">{value}</span>
    <span className="stat-chip-label">{label}</span>
  </div>
);

// ─── Spline wrapper with error boundary ─────────────────────────────────────
let Spline = null;
const SplineScene = () => {
  const [SplineComp, setSplineComp] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    import('@splinetool/react-spline')
      .then(mod => setSplineComp(() => mod.default))
      .catch(() => setError(true));
  }, []);

  if (error || !SplineComp) {
    return <NeuralCanvas />;
  }

  return (
    <ErrorBoundaryFallback fallback={<NeuralCanvas />}>
      <SplineComp
        scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
        onError={() => setError(true)}
      />
    </ErrorBoundaryFallback>
  );
};

// Simple error boundary
class ErrorBoundaryFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ─── Main RobotSection ──────────────────────────────────────────────────────
const RobotSection = () => {
  const leftRef  = useRef(null);
  const rightRef = useRef(null);
  const leftInView  = useInView(leftRef,  { once: true, margin: '-60px' });
  const rightInView = useInView(rightRef, { once: true, margin: '-60px' });

  const leftVariants = {
    hidden:  { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
  };

  const rightVariants = {
    hidden:  { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
  };

  const itemVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 + 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section id="experience" className="robot-section">
      <div className="robot-glow robot-glow-left" />
      <div className="robot-glow robot-glow-right" />
      <div className="robot-grid-overlay" />

      <div className="robot-inner">

        {/* LEFT */}
        <motion.div
          ref={leftRef}
          variants={leftVariants}
          initial="hidden"
          animate={leftInView ? 'visible' : 'hidden'}
          className="robot-left"
        >
          <motion.div custom={0} variants={itemVariants} initial="hidden" animate={leftInView ? 'visible' : 'hidden'} className="hero-badge mb-8 self-start">
            <Briefcase className="h-4 w-4 text-purple-400" />
            <span>Work Experience</span>
          </motion.div>

          <motion.h2 custom={1} variants={itemVariants} initial="hidden" animate={leftInView ? 'visible' : 'hidden'} className="exp-title">
            AI Math Expert
          </motion.h2>

          <motion.p custom={2} variants={itemVariants} initial="hidden" animate={leftInView ? 'visible' : 'hidden'} className="exp-company">
            Outlier AI
          </motion.p>

          <motion.div custom={3} variants={itemVariants} initial="hidden" animate={leftInView ? 'visible' : 'hidden'} className="flex flex-wrap gap-3 mb-8">
            <span className="exp-meta-chip"><Calendar className="h-3.5 w-3.5" />Nov 2024 – May 2025</span>
            <span className="exp-meta-chip"><MapPin className="h-3.5 w-3.5" />Remote · Freelance</span>
          </motion.div>

          <motion.p custom={4} variants={itemVariants} initial="hidden" animate={leftInView ? 'visible' : 'hidden'} className="exp-description">
            Collaborated on high-level mathematical problem-solving and AI model refinement,
            ensuring accuracy and logical consistency across complex datasets. Contributed to
            training data quality for large language models with a focus on mathematical
            reasoning and step-by-step verification.
          </motion.p>

          <motion.div custom={5} variants={itemVariants} initial="hidden" animate={leftInView ? 'visible' : 'hidden'} className="flex flex-wrap gap-2 mb-10">
            {['AI Training', 'Mathematics', 'LLM Evaluation', 'Data Quality'].map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </motion.div>

          <motion.div custom={6} variants={itemVariants} initial="hidden" animate={leftInView ? 'visible' : 'hidden'} className="flex gap-4 flex-wrap mb-10">
            <StatChip value="6mo" label="Duration" />
            <StatChip value="100%" label="Remote" />
            <StatChip value="LLM" label="Focus Area" />
          </motion.div>

          <motion.div custom={7} variants={itemVariants} initial="hidden" animate={leftInView ? 'visible' : 'hidden'} className="flex gap-3">
            <a href="https://www.linkedin.com/in/ashithosh-chintala" target="_blank" rel="noopener noreferrer" className="social-link">
              <ExternalLink className="h-4 w-4" />LinkedIn
            </a>
            <a href="https://github.com/ashithoshchintala" target="_blank" rel="noopener noreferrer" className="social-link">
              <GitBranch className="h-4 w-4" />GitHub
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT — 3D Scene with fallback */}
        <motion.div
          ref={rightRef}
          variants={rightVariants}
          initial="hidden"
          animate={rightInView ? 'visible' : 'hidden'}
          className="robot-right"
        >
          <div className="robot-halo" />
          <SplineScene />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={rightInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="robot-float-badge"
          >
            <Award className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-white text-sm font-bold leading-tight">Outlier AI</p>
              <p className="text-gray-400 text-xs">Verified Contributor</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default RobotSection;
