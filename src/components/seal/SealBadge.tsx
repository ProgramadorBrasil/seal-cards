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
  const isLegendary = rarity === 'legendary'
  const isEpic = rarity === 'epic'
  const isPremium = isLegendary || isEpic

  return (
    <div className="flex items-center gap-2.5">
      {/* Rarity pill — neon glow + multi-shimmer */}
      <motion.div
        className="relative px-3.5 py-1 rounded-full text-[0.48rem] tracking-[2.5px] uppercase overflow-hidden"
        style={{
          fontFamily: 'Orbitron',
          fontWeight: 800,
          background: `linear-gradient(180deg, ${cfg.border}18 0%, ${cfg.border}08 100%)`,
          border: `1.5px solid ${cfg.border}50`,
          color: cfg.border,
          boxShadow: isPremium
            ? `0 2px 12px ${cfg.border}20, 0 0 20px ${cfg.border}10, inset 0 1px 0 rgba(255,255,255,0.5)`
            : `0 2px 8px ${cfg.border}12, inset 0 1px 0 rgba(255,255,255,0.5)`,
        }}
        whileHover={{ scale: 1.08, boxShadow: `0 4px 20px ${cfg.border}30` }}
        animate={isPremium ? {
          boxShadow: [
            `0 2px 12px ${cfg.border}20, 0 0 20px ${cfg.border}10`,
            `0 3px 18px ${cfg.border}30, 0 0 30px ${cfg.border}20`,
            `0 2px 12px ${cfg.border}20, 0 0 20px ${cfg.border}10`,
          ],
        } : {}}
        transition={isPremium ? { duration: 2, repeat: Infinity } : {}}
      >
        {/* Shimmer layer 1 — sweep */}
        <motion.div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(110deg, transparent 25%, ${cfg.border}50 50%, transparent 75%)`,
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
        {/* Shimmer layer 2 — slower, opposite direction */}
        {isPremium && (
          <motion.div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(250deg, transparent 30%, ${cfg.border}40 55%, transparent 80%)`,
              backgroundSize: '250% 100%',
            }}
            animate={{ backgroundPosition: ['-250% 0', '250% 0'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {/* Top shine */}
        <div className="absolute top-0 left-0 right-0 h-[50%] pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25), transparent)' }} />
        <span className="relative z-10">{cfg.label}</span>
      </motion.div>

      {/* Verdict badge — text glow + pulsante */}
      <motion.div
        className="relative px-2.5 py-1 rounded-lg text-[0.7rem] font-black overflow-hidden"
        style={{
          fontFamily: 'Orbitron',
          color: verdictColor,
          background: `linear-gradient(180deg, ${verdictColor}12, ${verdictColor}06)`,
          border: `1.5px solid ${verdictColor}35`,
          textShadow: `0 0 8px ${verdictColor}50, 0 0 16px ${verdictColor}25`,
          boxShadow: `0 2px 10px ${verdictColor}15`,
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 12 }}
        whileHover={{ scale: 1.15, textShadow: `0 0 12px ${verdictColor}70, 0 0 24px ${verdictColor}40` }}
      >
        <div className="absolute top-0 left-0 right-0 h-[50%] pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15), transparent)' }} />
        <span className="relative z-10">{verdict}</span>
      </motion.div>
    </div>
  )
}
