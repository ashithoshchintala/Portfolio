"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin, Zap } from 'lucide-react';

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
                    <span>Data Analyst &nbsp;|&nbsp; AI/ML Engineer &nbsp;|&nbsp; Data Scientist</span>
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
                    className="flex flex-wrap gap-5 items-center justify-center"
                    style={{ marginTop: '2.5rem' }}
                >
                    <a
                        href="https://www.linkedin.com/in/ashithosh-chintala"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <svg style={{ width: '20px', height: '20px', display: 'inline-block' }} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                    </a>
                    <a
                        href="https://github.com/ashithoshchintala"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <svg style={{ width: '20px', height: '20px', display: 'inline-block' }} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                        GitHub
                    </a>
                    <a
                        href="https://leetcode.com/u/ashchin11/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <svg style={{ width: '20px', height: '20px', display: 'inline-block' }} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.956-.207a1.378 1.378 0 0 0-.207-1.953l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                        </svg>
                        LeetCode
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
