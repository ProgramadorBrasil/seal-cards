import { motion } from 'framer-motion'
import { categoryLabels } from '../../data/monitor-specs'

interface Props {
  categories: string[]
  pickRank: number | null
}

export default function RecommendBadge({ categories, pickRank }: Props) {
  if (categories.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {pickRank != null && pickRank >= 1 && pickRank <= 3 && (
        <motion.span
          className="px-2.5 py-0.5 rounded-full text-[0.45rem] tracking-[1px] uppercase font-black relative overflow-hidden"
          style={{
            fontFamily: 'Orbitron',
            background: pickRank === 1
              ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,0,0.15))'
              : 'linear-gradient(135deg, rgba(192,192,192,0.12), rgba(160,160,160,0.12))',
            border: `1.5px solid ${pickRank === 1 ? 'rgba(255,215,0,0.4)' : 'rgba(160,160,160,0.3)'}`,
            color: pickRank === 1 ? '#b87a00' : '#888',
            boxShadow: pickRank === 1 ? '0 2px 8px rgba(255,215,0,0.12)' : 'none',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
        >
          {pickRank === 1 && (
            <motion.div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(110deg, transparent 30%, rgba(255,215,0,0.4) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
          )}
          <span className="relative z-10">#{pickRank} Recomendado</span>
        </motion.span>
      )}
      {categories.slice(0, 3).map((cat, i) => (
        <motion.span
          key={cat}
          className="px-2 py-0.5 rounded-full text-[0.45rem] tracking-[1px] uppercase font-semibold"
          style={{
            fontFamily: 'Rajdhani',
            background: 'rgba(0,136,204,0.06)',
            border: '1px solid rgba(0,136,204,0.15)',
            color: 'rgba(0,100,160,0.75)',
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 + i * 0.1 }}
        >
          {categoryLabels[cat] || cat}
        </motion.span>
      ))}
    </div>
  )
}
