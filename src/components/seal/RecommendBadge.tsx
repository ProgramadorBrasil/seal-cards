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
      {pickRank === 1 && (
        <motion.span
          className="px-2 py-0.5 rounded-full text-[0.5rem] tracking-[1px] uppercase font-bold"
          style={{
            fontFamily: 'Rajdhani',
            background: 'linear-gradient(135deg, rgba(212,136,10,0.12), rgba(255,107,0,0.12))',
            border: '1px solid rgba(212,136,10,0.3)',
            color: '#b87a00',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          #1 RTINGS
        </motion.span>
      )}
      {categories.slice(0, 3).map((cat, i) => (
        <motion.span
          key={cat}
          className="px-2 py-0.5 rounded-full text-[0.5rem] tracking-[1px] uppercase"
          style={{
            fontFamily: 'Rajdhani',
            fontWeight: 600,
            background: 'rgba(0,136,204,0.06)',
            border: '1px solid rgba(0,136,204,0.15)',
            color: 'rgba(0,100,160,0.8)',
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
