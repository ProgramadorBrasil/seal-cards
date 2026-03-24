import { motion } from 'framer-motion'
import type { EnergyGrade } from '../../lib/seal-engine'

interface Props {
  icon: string
  label: string
  grade: EnergyGrade
  detail: string
  delay?: number
}

const gradeColors: Record<EnergyGrade, string> = {
  A: '#009640', B: '#51B748', C: '#B9D433',
  D: '#EED600', E: '#FCB814', F: '#F37021', G: '#ED1C24',
}

const allGrades: EnergyGrade[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

export default function SpecEnergyBar({ icon, label, grade, detail, delay = 0 }: Props) {
  const activeIdx = allGrades.indexOf(grade)

  return (
    <motion.div
      className="flex items-center gap-1.5"
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      {/* Ícone + Label */}
      <div className="w-[72px] flex items-center gap-1 shrink-0">
        <span className="text-[0.7rem]">{icon}</span>
        <span className="text-[0.48rem] text-gray-500 font-bold leading-tight truncate"
          style={{ fontFamily: 'Rajdhani' }}>
          {label}
        </span>
      </div>

      {/* Barras A-G — TODAS coloridas (como PROCEL real), seta na ativa */}
      <div className="flex gap-[1.5px] flex-1 items-center relative">
        {allGrades.map((g, i) => {
          const isActive = i === activeIdx
          const color = gradeColors[g]
          const barW = 12 + i * 4

          return (
            <motion.div
              key={g}
              className="relative flex items-center"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: delay + i * 0.04,
                duration: 0.3,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <div style={{ width: `${barW}px` }} className="flex items-center">
                <div
                  className="h-[15px] flex-1 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(180deg, ${color}ee 0%, ${color} 35%, ${color}cc 100%)`,
                    borderRadius: '2px 0 0 2px',
                    boxShadow: isActive
                      ? `0 0 14px ${color}80, 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)`
                      : 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.05)',
                    transform: isActive ? 'scale(1.12)' : 'scale(1)',
                    transition: 'transform 0.3s ease',
                    zIndex: isActive ? 10 : 1,
                  }}
                >
                  {/* Brilho 3D glossy */}
                  <div className="absolute top-0 left-0 right-0 h-[50%]"
                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.1) 60%, transparent)' }} />
                  <div className="absolute bottom-0 left-0 right-0 h-[15%]"
                    style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.1), transparent)' }} />

                  <span className="relative z-10 text-[0.3rem] font-black select-none"
                    style={{
                      fontFamily: 'Orbitron',
                      color: 'rgba(255,255,255,0.9)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                    }}>
                    {g}
                  </span>
                </div>

                {/* Ponta seta */}
                <div style={{
                  width: 0, height: 0,
                  borderTop: '7.5px solid transparent',
                  borderBottom: '7.5px solid transparent',
                  borderLeft: `5px solid ${color}`,
                  filter: isActive ? `drop-shadow(2px 0 5px ${color}70)` : 'none',
                  transform: isActive ? 'scale(1.12)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                  zIndex: isActive ? 10 : 1,
                }} />
              </div>

              {/* Indicador ativo: seta preta apontando ← para a barra */}
              {isActive && (
                <motion.div
                  className="absolute -right-5 top-1/2 -translate-y-1/2 flex items-center"
                  initial={{ opacity: 0, x: 10, scale: 0 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: delay + 0.5, type: 'spring', stiffness: 300, damping: 15 }}
                  style={{ zIndex: 20 }}
                >
                  <div style={{
                    width: 0, height: 0,
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                    borderRight: '5px solid #1a1a2e',
                  }} />
                  <motion.div
                    className="w-4 h-4 rounded-sm flex items-center justify-center"
                    style={{
                      background: '#1a1a2e',
                      boxShadow: `0 2px 8px rgba(0,0,0,0.2), 0 0 12px ${color}40`,
                    }}
                    animate={{
                      boxShadow: [
                        `0 2px 8px rgba(0,0,0,0.2), 0 0 12px ${color}40`,
                        `0 3px 12px rgba(0,0,0,0.3), 0 0 20px ${color}60`,
                        `0 2px 8px rgba(0,0,0,0.2), 0 0 12px ${color}40`,
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-[0.35rem] font-black text-white" style={{ fontFamily: 'Orbitron' }}>
                      {g}
                    </span>
                  </motion.div>
                </motion.div>
              )}

              {/* Partículas para grade A */}
              {isActive && grade === 'A' && (
                <>
                  <motion.div
                    className="absolute -top-2 left-1/3 w-1 h-1 rounded-full pointer-events-none"
                    style={{ background: color, boxShadow: `0 0 4px ${color}` }}
                    animate={{ y: [-2, -10, -2], opacity: [0.3, 0.9, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute -top-1 left-2/3 w-0.5 h-0.5 rounded-full pointer-events-none"
                    style={{ background: '#FFD700', boxShadow: '0 0 3px #FFD700' }}
                    animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Valor real */}
      <motion.span
        className="w-[58px] text-right text-[0.42rem] text-gray-500 font-semibold truncate shrink-0"
        style={{ fontFamily: 'Space Grotesk' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5 }}
        title={detail}
      >
        {detail}
      </motion.span>
    </motion.div>
  )
}
