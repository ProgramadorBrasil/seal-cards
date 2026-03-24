import { motion } from 'framer-motion'

interface Props {
  icon: string
  label: string
  value: number   // 0-10
  color: string
  delay?: number
}

export default function SpecBar({ icon, label, value, color, delay = 0 }: Props) {
  const segments = 10

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm w-5 text-center">{icon}</span>
      <span
        className="text-[0.55rem] w-16 text-gray-500 font-semibold tracking-wide"
        style={{ fontFamily: 'Rajdhani' }}
      >
        {label}
      </span>

      {/* Moldura 3D RPG */}
      <div className="flex-1 flex gap-[2px]">
        {Array.from({ length: segments }, (_, i) => {
          const filled = i < value
          return (
            <motion.div
              key={i}
              className="relative flex-1 h-4 rounded-sm overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 100%)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.8)',
              }}
              initial={{ scaleY: 0.3, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: delay + i * 0.04, duration: 0.3, ease: 'backOut' }}
            >
              {filled && (
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, ${color}cc 0%, ${color} 40%, ${color}aa 100%)`,
                    boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.2), 0 0 6px ${color}40`,
                  }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: delay + i * 0.06,
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1], // bouncy overshoot
                  }}
                >
                  {/* Brilho cartoon no topo */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[40%]"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.5), transparent)',
                      borderRadius: '1px 1px 0 0',
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Número com estilo RPG */}
      <motion.span
        className="w-6 text-right font-black text-[0.65rem]"
        style={{
          fontFamily: 'Orbitron',
          color: value >= 8 ? color : value >= 5 ? '#555' : '#aaa',
          textShadow: value >= 8 ? `0 0 6px ${color}40` : 'none',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.5, type: 'spring', stiffness: 400 }}
      >
        {value}
      </motion.span>
    </div>
  )
}
