import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * GetStartedButton
 * @param {string}  to        - route path (default: /register)
 * @param {string}  text      - button label (default: "Get Started")
 * @param {string}  size      - "sm" | "md" | "lg"  (default: "md")
 * @param {boolean} float     - enable floating animation (default: false)
 * @param {boolean} particles - show micro-particles around button (default: false)
 * @param {string}  className - extra classes
 * @param {func}    onClick   - optional click handler
 */
const PARTICLE_POSITIONS = [
  { top: '-18px', left: '18%',  delay: 0,    dur: 2.2, size: 3 },
  { top: '-12px', left: '72%',  delay: 0.4,  dur: 2.8, size: 2 },
  { top: '50%',   left: '-16px',delay: 0.8,  dur: 2.5, size: 2.5 },
  { top: '50%',   right: '-14px',delay: 0.2, dur: 3.0, size: 2 },
  { bottom: '-16px', left: '30%', delay: 0.6, dur: 2.4, size: 3 },
  { bottom: '-10px', left: '65%', delay: 1.0, dur: 2.6, size: 2 },
];

const Particle = ({ style, delay, dur, size }) => (
  <motion.span
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
      pointerEvents: 'none',
      ...style,
    }}
    animate={{
      y: [0, -10, 0],
      opacity: [0, 0.9, 0],
      scale: [0.6, 1.2, 0.6],
    }}
    transition={{
      duration: dur,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

const ArrowIcon = () => (
  <span className="btn-gs-arrow">
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </span>
);

const GetStartedButton = ({
  to = '/register',
  text = 'Get Started',
  size = 'md',
  float = false,
  particles = false,
  className = '',
  onClick,
}) => {
  const sizeClass = size === 'sm' ? 'btn-get-started-sm' : size === 'lg' ? 'btn-get-started-lg' : '';
  const floatClass = float ? 'btn-get-started-hero' : '';

  const inner = (
    <>
      {/* Animated glow ring handled by ::before pseudo */}
      {/* Shimmer sweep */}
      <span className="btn-get-started-shimmer" aria-hidden="true" />
      {/* Label + arrow */}
      <span className="relative z-10 flex items-center gap-2">
        {text}
        <ArrowIcon />
      </span>
      {/* Micro-particles */}
      {particles && PARTICLE_POSITIONS.map((p, i) => {
        const { delay, dur, size: sz, ...style } = p;
        return <Particle key={i} style={style} delay={delay} dur={dur} size={sz} />;
      })}
    </>
  );

  if (onClick) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`btn-get-started ${sizeClass} ${floatClass} ${className}`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`btn-get-started ${sizeClass} ${floatClass} ${className}`}
    >
      {inner}
    </Link>
  );
};

export default GetStartedButton;
