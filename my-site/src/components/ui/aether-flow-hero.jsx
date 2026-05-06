"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, MapPin, ExternalLink, GitBranch } from 'lucide-react';

const AetherFlowHero = ({ onExploreClick }) => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const mouse = { x: null, y: null, radius: 200 };

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update(deltaTime) {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                
                // Adjust speed based on actual frame time (smooth at any refresh rate)
                const speedScale = deltaTime * 60; // 1.0 at 60fps, 0.5 at 120fps

                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius + this.size) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= forceDirectionX * force * 5 * speedScale;
                        this.y -= forceDirectionY * force * 5 * speedScale;
                    }
                }

                this.x += this.directionX * speedScale;
                this.y += this.directionY * speedScale;
                this.draw();
            }
        }

        function init() {
            particles = [];
            // Lower cap for smoother performance — O(n²) in connect()
            let numberOfParticles = Math.min((canvas.height * canvas.width) / 12000, 150);
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                particles.push(new Particle(x, y, directionX, directionY, size, 'rgba(191, 128, 255, 0.8)'));
            }
        }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        const connect = () => {
            const maxDistanceSq = (canvas.width / 8) * (canvas.height / 8);
            const mouseRadiusSq = mouse.radius * mouse.radius;
            
            ctx.lineWidth = 1;
            
            // Simplified 4-bucket rendering (was 10) — massive perf gain
            for (let bucket = 0; bucket < 4; bucket++) {
                let currentAlpha = (bucket + 1) / 4;
                
                // Normal Lines
                let drewNormal = false;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(200, 150, 255, ${currentAlpha})`;
                
                for (let a = 0; a < particles.length; a++) {
                    let pa = particles[a];
                    for (let b = a + 1; b < particles.length; b++) {
                        let pb = particles[b];
                        let dx = pa.x - pb.x;
                        let dy = pa.y - pb.y;
                        let distSq = dx * dx + dy * dy;
                        
                        if (distSq < maxDistanceSq) {
                            let opacityValue = 1 - (distSq / 20000);
                            let bucketIndex = (opacityValue * 4) | 0;
                            if (bucketIndex > 3) bucketIndex = 3;
                            if (bucketIndex < 0) bucketIndex = 0;
                            
                            if (bucketIndex === bucket) {
                                let m_dx = pa.x - mouse.x;
                                let m_dy = pa.y - mouse.y;
                                if (!(mouse.x && (m_dx * m_dx + m_dy * m_dy) < mouseRadiusSq)) {
                                    ctx.moveTo(pa.x | 0, pa.y | 0);
                                    ctx.lineTo(pb.x | 0, pb.y | 0);
                                    drewNormal = true;
                                }
                            }
                        }
                    }
                }
                if (drewNormal) ctx.stroke();

                // Mouse hovered lines
                if (mouse.x) {
                    let drewMouse = false;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha})`;
                    
                    for (let a = 0; a < particles.length; a++) {
                        let pa = particles[a];
                        for (let b = a + 1; b < particles.length; b++) {
                            let pb = particles[b];
                            let dx = pa.x - pb.x;
                            let dy = pa.y - pb.y;
                            let distSq = dx * dx + dy * dy;
                            
                            if (distSq < maxDistanceSq) {
                                let opacityValue = 1 - (distSq / 20000);
                                let bucketIndex = (opacityValue * 4) | 0;
                                if (bucketIndex > 3) bucketIndex = 3;
                                if (bucketIndex < 0) bucketIndex = 0;
                                
                                if (bucketIndex === bucket) {
                                    let m_dx = pa.x - mouse.x;
                                    let m_dy = pa.y - mouse.y;
                                    if ((m_dx * m_dx + m_dy * m_dy) < mouseRadiusSq) {
                                        ctx.moveTo(pa.x | 0, pa.y | 0);
                                        ctx.lineTo(pb.x | 0, pb.y | 0);
                                        drewMouse = true;
                                    }
                                }
                            }
                        }
                    }
                    if (drewMouse) ctx.stroke();
                }
            }
        };

        let lastTime = 0;
        const animate = (time) => {
            animationFrameId = requestAnimationFrame(animate);
            
            // Calculate delta time in seconds
            const dt = lastTime ? (time - lastTime) / 1000 : 0.016;
            lastTime = time;
            
            ctx.fillStyle = 'rgb(10, 10, 10)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(dt);
            }
            connect();
        };

        const handleMouseMove = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        const handleMouseOut = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                delay: i * 0.18 + 0.4,
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
            },
        }),
    };

    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

            {/* Radial glow overlay */}
            <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                {/* Role badge */}
                <motion.div
                    custom={0}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="hero-badge"
                >
                    <Zap className="h-4 w-4 text-purple-400" />
                    <span>Machine Learning Engineer &nbsp;|&nbsp; Data Analyst</span>
                </motion.div>

                {/* Name with Playfair Display glow */}
                <motion.h1
                    custom={1}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="hero-name font-bold mb-10"
                >
                    Ashithosh Chintala
                </motion.h1>

                {/* Location */}
                <motion.p
                    custom={2}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center justify-center gap-2 text-gray-400 text-xl mb-12 tracking-wide"
                >
                    <MapPin className="h-5 w-5 text-purple-400" />
                    Hyderabad, Telangana
                </motion.p>

                {/* Social links only */}
                <motion.div
                    custom={3}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex gap-5 items-center justify-center"
                >
                    <a
                        href="https://www.linkedin.com/in/ashithosh-chintala"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <ExternalLink className="h-4 w-4" />
                        LinkedIn
                    </a>
                    <a
                        href="https://github.com/ashithoshchintala"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <GitBranch className="h-4 w-4" />
                        GitHub
                    </a>
                </motion.div>

                {/* Interactive Stats Counters */}
                <motion.div
                    custom={4}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="hero-stats-row"
                >
                    {[
                        { value: '8+', label: 'Projects', scrollTo: 'projects' },
                        { value: '15+', label: 'Skills', scrollTo: 'skills' },
                        { value: '7+', label: 'Certifications', scrollTo: 'certifications' },
                    ].map((stat) => (
                        <motion.button
                            key={stat.label}
                            className="hero-stat-chip"
                            whileHover={{ scale: 1.1, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                const el = document.getElementById(stat.scrollTo);
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <span className="hero-stat-value">{stat.value}</span>
                            <span className="hero-stat-label">{stat.label}</span>
                        </motion.button>
                    ))}
                </motion.div>
            </div>

            {/* Scroll indicator — only the animated line, no text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-px h-12 bg-gradient-to-b from-purple-500 to-transparent"
                />
            </motion.div>
        </div>
    );
};

export default AetherFlowHero;
