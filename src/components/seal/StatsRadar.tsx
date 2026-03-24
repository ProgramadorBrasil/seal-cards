import { motion } from 'framer-motion'
import type { RadarPoint } from '../../lib/seal-engine'

interface Props {
  data: RadarPoint[]
  color: string
  size?: number
}

export default function StatsRadar({ data, color, size = 140 }: Props) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 20
  const n = data.length

  const polyPoints = (fraction: number) =>
    data
      .map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2
        return `${cx + r * fraction * Math.cos(angle)},${cy + r * fraction * Math.sin(angle)}`
      })
      .join(' ')

  const dataPoints = data
    .map((d, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2
      const frac = d.value / d.max
      return `${cx + r * frac * Math.cos(angle)},${cy + r * frac * Math.sin(angle)}`
    })
    .join(' ')

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={polyPoints(f)}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={0.5}
        />
      ))}
      {data.map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={cx + r * Math.cos(angle)}
            y2={cy + r * Math.sin(angle)}
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={0.5}
          />
        )
      })}
      <motion.polygon
        points={polyPoints(0)}
        animate={{ points: dataPoints }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        fill={`${color}18`}
        stroke={color}
        strokeWidth={1.5}
        filter="url(#radarGlow)"
      />
      <defs>
        <filter id="radarGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {data.map((d, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2
        const frac = d.value / d.max
        const px = cx + r * frac * Math.cos(angle)
        const py = cy + r * frac * Math.sin(angle)
        return (
          <motion.circle
            key={i}
            cx={cx} cy={cy} r={3}
            animate={{ cx: px, cy: py }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.1 }}
            fill={color}
            filter="url(#radarGlow)"
          />
        )
      })}
      {data.map((d, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2
        const lx = cx + (r + 14) * Math.cos(angle)
        const ly = cy + (r + 14) * Math.sin(angle)
        return (
          <text key={i} x={lx} y={ly}
            textAnchor="middle" dominantBaseline="central"
            fill="rgba(0,0,0,0.35)" fontSize={9}
            fontFamily="Rajdhani" fontWeight={600}
          >
            {d.label}
          </text>
        )
      })}
      {data.map((d, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2
        const frac = d.value / d.max
        const vx = cx + (r * frac + 12) * Math.cos(angle)
        const vy = cy + (r * frac + 12) * Math.sin(angle)
        return (
          <motion.text key={`v${i}`} x={vx} y={vy}
            textAnchor="middle" dominantBaseline="central"
            fill={color} fontSize={8}
            fontFamily="Orbitron" fontWeight={700}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1 + i * 0.15 }}
          >
            {d.value}
          </motion.text>
        )
      })}
    </svg>
  )
}
