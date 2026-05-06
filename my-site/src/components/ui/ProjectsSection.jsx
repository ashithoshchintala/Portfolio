import React, { useRef, useEffect, useState, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Award } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

// ─── Error Boundary ─────────────────────────────────────────────────────────
class SplineErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

// ─── Neural Canvas fallback ─────────────────────────────────────────────────
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
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      for (let i = 0; i < Math.floor((w * h) / 5000); i++) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2.5 + 1, pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const time = Date.now() * 0.001;
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const ps = n.r + Math.sin(time + n.pulse) * 0.5;
        ctx.beginPath(); ctx.arc(n.x, n.y, ps, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${0.5 + Math.sin(time + n.pulse) * 0.2})`;
        ctx.fill();
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(139,92,246,${(1 - dist / 100) * 0.2})`;
            ctx.lineWidth = 0.6; ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize(); draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);

  return <canvas ref={canvasRef} className="proj-canvas" />;
};

// ─── Spline scene with lazy load + fallback + watermark removal ─────────────
const SplineScene = () => {
  const [Comp, setComp] = useState(null);
  const [err, setErr] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    import('@splinetool/react-spline')
      .then(m => setComp(() => m.default))
      .catch(() => setErr(true));
  }, []);

  // Remove the "Built with Spline" watermark after the scene loads
  const handleLoad = () => {
    setTimeout(() => {
      if (!wrapRef.current) return;
      // Target the watermark logo element
      const logos = wrapRef.current.querySelectorAll('a[href*="spline"], div[class*="watermark"], a[target="_blank"]');
      logos.forEach(el => { el.style.display = 'none'; });
      // Also hide any div positioned at the bottom that isn't the canvas
      const children = wrapRef.current.querySelectorAll(':scope > div > div');
      children.forEach(el => {
        if (el.tagName !== 'CANVAS' && el.querySelector && el.querySelector('a')) {
          el.style.display = 'none';
        }
      });
    }, 2000);
  };

  if (err || !Comp) return <NeuralCanvas />;

  return (
    <div ref={wrapRef} className="proj-spline-container">
      <SplineErrorBoundary fallback={<NeuralCanvas />}>
        <Comp
          scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
          onLoad={handleLoad}
        />
      </SplineErrorBoundary>
    </div>
  );
};

// ─── Project data ───────────────────────────────────────────────────────────
const projects = [
  {
    title: 'Sound Classification via Time-Frequency Attention',
    desc: 'Achieved 93.02% accuracy using GradCAM++ and EfficientNetV2 on UrbanSound8K.',
    accuracy: '93.02%',
    tags: ['Deep Learning', 'TensorFlow', 'Signal Processing'],
    github: 'https://github.com/ashithoshchintala',
    position: 'top-left',
  },
  {
    title: 'Zomato Review Sentiment Analysis',
    desc: 'NLP pipeline for sentiment analysis achieving 80% accuracy with TF-IDF and ensemble classifiers.',
    accuracy: '80%',
    tags: ['NLP', 'Scikit-learn', 'Pandas'],
    github: 'https://github.com/ashithoshchintala',
    position: 'top-right',
  },
  {
    title: 'Medical Image Enhancement (AGAHE)',
    desc: 'Adaptive Genetic Algorithm for histogram equalization optimizing MRI scan contrast.',
    accuracy: null,
    tags: ['Computer Vision', 'OpenCV', 'Python'],
    github: 'https://github.com/ashithoshchintala',
    position: 'bottom-center',
  },
];

// ─── Floating project card ──────────────────────────────────────────────────
const FloatingCard = ({ project, index, isInView }) => {
  const variants = {
    hidden: { opacity: 0, scale: 0.85, y: 40 },
    visible: {
      opacity: 1, scale: 1, y: 0,
      transition: { delay: index * 0.2 + 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`proj-card proj-card-${project.position}`}
    >
      <div className="proj-card-inner">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="proj-card-title">{project.title}</h3>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="proj-github-icon">
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Accuracy badge */}
        {project.accuracy && (
          <span className="proj-accuracy">{project.accuracy}</span>
        )}

        {/* Description */}
        <p className="proj-card-desc">{project.desc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Projects Section ──────────────────────────────────────────────────
const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="projects" className="proj-section">
      <ParticleBackground
        particleColor="rgba(168, 85, 247, 0.4)"
        lineColor="rgba(168, 85, 247, 0.1)"
        particleCount={35}
        connectDistance={130}
        speed={0.22}
      />
      <div className="proj-glow proj-glow-1" />
      <div className="proj-glow proj-glow-2" />

      <div ref={ref} className="proj-inner">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="proj-header"
        >
          <div className="hero-badge mb-4">
            <Award className="h-4 w-4 text-purple-400" />
            <span>Projects Portfolio</span>
          </div>
          <h2 className="proj-title">Featured Work</h2>
        </motion.div>

        {/* Robot + floating cards container */}
        <div className="proj-arena">
          {/* 3D Robot / Neural Canvas center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="proj-robot-wrap"
          >
            <div className="proj-robot-halo" />
            <SplineScene />
          </motion.div>

          {/* Floating project cards around the robot */}
          {projects.map((p, i) => (
            <FloatingCard key={p.title} project={p} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
