import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  varying vec2 vUv;

  // Simple random noise function
  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // Value Noise by Inigo Quilez
  float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      // Four corners in 2D of a tile
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(a, b, u.x) +
              (c - a)* u.y * (1.0 - u.x) +
              (d - b) * u.x * u.y;
  }

  // Fractional Brownian Motion
  float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for (int i = 0; i < 5; i++) {
          value += amplitude * noise(st * frequency);
          st *= 2.0;
          amplitude *= 0.5;
      }
      return value;
  }

  void main() {
      vec2 st = gl_FragCoord.xy/u_resolution.xy;
      st.x *= u_resolution.x/u_resolution.y;

      // Create a slow time variable
      float t = u_time * 0.15;

      // Warp coordinates
      vec2 q = vec2(0.);
      q.x = fbm(st + t);
      q.y = fbm(st + vec2(1.0));

      vec2 r = vec2(0.);
      r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
      r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

      float f = fbm(st + r);

      // Minimal dark colors
      // Color palette tailored for a sleek, premium, minimal dark mode
      vec3 color1 = vec3(0.02, 0.02, 0.03); // Deepest dark gray almost black
      vec3 color2 = vec3(0.06, 0.06, 0.08); // Slightly lighter gray-blue
      vec3 color3 = vec3(0.12, 0.05, 0.18); // Very subtle dark purple
      vec3 color4 = vec3(0.05, 0.10, 0.15); // Subtle dark blue
      
      // Mix them based on fbm values
      vec3 color = mix(color1, color2, clamp(f*2.0, 0.0, 1.0));
      color = mix(color, color3, clamp(length(q), 0.0, 1.0));
      color = mix(color, color4, clamp(length(r.x), 0.0, 1.0));

      // Add a subtle vignette
      vec2 center = st - vec2(0.5 * (u_resolution.x / u_resolution.y), 0.5);
      float vignette = clamp(1.0 - length(center) * 0.7, 0.0, 1.0);
      color *= vignette;

      gl_FragColor = vec4(color, 1.0);
  }
`;

const AnimatedShaderBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Set up the Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Append the canvas
    mountRef.current.appendChild(renderer.domElement);

    // Create the geometry and material
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop — throttled to ~30fps for scroll perf
    const clock = new THREE.Clock();
    let animationFrameId;
    let lastRender = 0;

    const animate = (time) => {
      animationFrameId = requestAnimationFrame(animate);
      // Only render every ~33ms (30fps) and only when scrolled past hero
      if (time - lastRender < 33) return;
      if (window.scrollY > window.innerHeight * 0.1) {
        material.uniforms.u_time.value = clock.getElapsedTime();
        renderer.render(scene, camera);
        lastRender = time;
      }
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
      style={{ top: 0, left: 0, position: 'fixed' }}
    />
  );
};

export default AnimatedShaderBackground;
