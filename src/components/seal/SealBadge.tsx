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
      <motion.div
        className="relative px-3 py-0.5 rounded-full text-[0.55rem] tracking-[3px] uppercase overflow-hidden"
        style={{
          fontFamily: 'Orbitron',
          fontWeight: 700,
          border: `1px solid ${cfg.border}50`,
          background: `${cfg.border}08`,
          color: cfg.border,
        }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, ${cfg.border}40, transparent)`,
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <span className="relative z-10">{cfg.label}</span>
      </motion.div>

      <motion.div
        className="px-2 py-0.5 rounded text-[0.7rem] font-black"
        style={{
          fontFamily: 'Orbitron',
          color: verdictColor,
          background: `${verdictColor}10`,
          border: `1px solid ${verdictColor}30`,
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        {verdict}
      </motion.div>
    </div>
  )
}
