import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Props {
  score: number
  size?: number
  color: string
  label?: string
}

function getScoreColor(progress: number): string {
  if (progress < 30) return '#ED1C24'
  if (progress < 50) return '#FCB814'
  if (progress < 70) return '#B9D433'
  if (progress < 85) return '#00aa55'
  return '#009640'
}

export default function ScoreRing({ score, size = 80, color, label }: Props) {
  const sw = size > 60 ? 4 : 3
  const r = (size - sw * 2) / 2
  const c = 2 * Math.PI * r
  const [displayScore, setDisplayScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Animated counter
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    const unsub = rounded.on('change', (v) => setDisplayScore(v as number))
    const controls = animate(count, score, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => setShowConfetti(true),
    })
    return () => { controls.stop(); unsub() }
  }, [score, count, rounded])

  const dynamicColor = getScoreColor(displayScore)

  // Confetti particles
  const confettiParticles = showConfetti
    ? Array.from({ length: 8 }, (_, i) => ({
        angle: (i / 8) * Math.PI * 2,
        distance: r + 8,
        color: ['#FFD700', '#00F0FF', '#FF006E', '#00FF88', '#7B2FF7', '#FF9900', '#009640', '#E0005A'][i],
      }))
    : []

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* BG ring */}
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={sw} />

          {/* Outer glow ring */}
          <motion.circle cx={size/2} cy={size/2} r={r + 2} fill="none"
            stroke={color} strokeWidth={1} opacity={0.1}
            strokeDasharray={2 * Math.PI * (r + 2)}
            initial={{ strokeDashoffset: 2 * Math.PI * (r + 2) }}
            animate={{ strokeDashoffset: 2 * Math.PI * (r + 2) * (1 - score / 100) }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Glow ring (wide, blurred) */}
          <motion.circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke={dynamicColor} strokeWidth={sw + 6} strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c, opacity: 0.12 }}
            animate={{
              strokeDashoffset: c * (1 - score / 100),
              opacity: [0.08, 0.2, 0.08],
            }}
            transition={{
              strokeDashoffset: { duration: 2, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          />

          {/* Main ring */}
          <motion.circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke={dynamicColor} strokeWidth={sw} strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - score / 100) }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Inner detail ring */}
          <motion.circle cx={size/2} cy={size/2} r={r - 4} fill="none"
            stroke={dynamicColor} strokeWidth={0.5} opacity={0.15}
            strokeDasharray={2 * Math.PI * (r - 4)}
            initial={{ strokeDashoffset: 2 * Math.PI * (r - 4) }}
            animate={{ strokeDashoffset: 2 * Math.PI * (r - 4) * (1 - score / 100) }}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>

        {/* Confetti burst */}
        {confettiParticles.map((p, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{
              width: 3, height: 3,
              background: p.color,
              boxShadow: `0 0 4px ${p.color}`,
              left: size / 2 - 1.5,
              top: size / 2 - 1.5,
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{
              x: Math.cos(p.angle) * p.distance,
              y: Math.sin(p.angle) * p.distance,
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ))}

        {/* Score number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span className="font-black"
            style={{
              fontFamily: 'Orbitron',
              fontSize: size * 0.3,
              background: `linear-gradient(135deg, ${dynamicColor}, #1a1a2e)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 6px ${dynamicColor}30)`,
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
          >
            <motion.span>{rounded}</motion.span>
          </motion.span>
        </div>
      </div>

      {label && (
        <motion.span className="mt-1 tracking-[2px] uppercase font-bold"
          style={{ fontFamily: 'Rajdhani', color: 'rgba(0,0,0,0.3)', fontSize: size > 60 ? '0.5rem' : '0.4rem' }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.4 }}
        >
          {label}
        </motion.span>
      )}
    </div>
  )
}
