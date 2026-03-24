import { motion } from 'framer-motion'
import type { Rarity } from '../../data/monitor-specs'
import { rarityConfig } from '../../data/monitor-specs'

interface Props {
  rarity: Rarity
  verdict: string
  verdictColor: string
}

export default function SealBadge({ rarity, verdict, verdictColor }: Props) {
  const cfg = rarityConfig[rarity]

  return (
    <div className="flex items-center gap-2">
      {/* Rarity pill — 3D glossy */}
      <motion.div
        className="relative px-3 py-1 rounded-full text-[0.5rem] tracking-[2px] uppercase overflow-hidden"
        style={{
          fontFamily: 'Orbitron',
          fontWeight: 800,
          background: `linear-gradient(180deg, ${cfg.border}20 0%, ${cfg.border}10 100%)`,
          border: `1.5px solid ${cfg.border}50`,
          color: cfg.border,
          boxShadow: `0 2px 8px ${cfg.border}15, inset 0 1px 0 rgba(255,255,255,0.5)`,
        }}
        whileHover={{ scale: 1.05, boxShadow: `0 4px 15px ${cfg.border}25` }}
      >
        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(110deg, transparent 30%, ${cfg.border}50 50%, transparent 70%)`,
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        {/* Top shine */}
        <div className="absolute top-0 left-0 right-0 h-[50%] pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.2), transparent)' }} />
        <span className="relative z-10">{cfg.label}</span>
      </motion.div>

      {/* Verdict badge — com glow pulsante */}
      <motion.div
        className="relative px-2.5 py-1 rounded-md text-[0.7rem] font-black overflow-hidden"
        style={{
          fontFamily: 'Orbitron',
          color: verdictColor,
          background: `linear-gradient(180deg, ${verdictColor}12, ${verdictColor}08)`,
          border: `1.5px solid ${verdictColor}35`,
          boxShadow: `0 2px 8px ${verdictColor}15`,
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="absolute top-0 left-0 right-0 h-[50%] pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15), transparent)' }} />
        <span className="relative z-10">{verdict}</span>
      </motion.div>
    </div>
  )
}
