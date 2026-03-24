import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

interface Props {
  score: number
  size?: number
  color: string
  label?: string
}

export default function ScoreRing({ score, size = 80, color, label }: Props) {
  const strokeWidth = size > 60 ? 5 : 3
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius

  // Animated counter
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.8,
      ease: 'easeOut',
    })
    return controls.stop
  }, [score, count])

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* BG ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={strokeWidth}
          />
          {/* Glow ring behind */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth + 4}
            strokeLinecap="round" opacity={0.15}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
          {/* Main ring */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
          {/* Shine dot at the end */}
          <motion.circle
            cx={size / 2} cy={strokeWidth}
            r={strokeWidth * 0.8}
            fill="white"
            opacity={0.8}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.4] }}
            transition={{ delay: 1.5, duration: 1 }}
          />
        </svg>

        {/* Score number with animated counter */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="font-black"
            style={{
              fontFamily: 'Orbitron',
              fontSize: size * 0.3,
              background: `linear-gradient(135deg, ${color}, #1a1a2e)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 4px ${color}30)`,
            }}
          >
            <motion.span>{rounded}</motion.span>
          </motion.span>
        </div>
      </div>

      {label && (
        <span
          className="mt-0.5 tracking-[2px] uppercase font-bold"
          style={{
            fontFamily: 'Rajdhani',
            color: 'rgba(0,0,0,0.3)',
            fontSize: size > 60 ? '0.5rem' : '0.4rem',
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
