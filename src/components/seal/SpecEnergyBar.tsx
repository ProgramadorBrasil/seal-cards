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

const gradeGradients: Record<EnergyGrade, string> = {
  A: 'linear-gradient(180deg, #00B850 0%, #009640 40%, #007830 100%)',
  B: 'linear-gradient(180deg, #6BCC5C 0%, #51B748 40%, #3D9A38 100%)',
  C: 'linear-gradient(180deg, #D4E84A 0%, #B9D433 40%, #9AB82A 100%)',
  D: 'linear-gradient(180deg, #FFF44A 0%, #EED600 40%, #CCB800 100%)',
  E: 'linear-gradient(180deg, #FFD040 0%, #FCB814 40%, #D99B0A 100%)',
  F: 'linear-gradient(180deg, #FF8844 0%, #F37021 40%, #CC5A18 100%)',
  G: 'linear-gradient(180deg, #FF4040 0%, #ED1C24 40%, #CC1018 100%)',
}

const allGrades: EnergyGrade[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

export default function SpecEnergyBar({ icon, label, grade, detail, delay = 0 }: Props) {
  const activeIdx = allGrades.indexOf(grade)

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      {/* Ícone + Label */}
      <div className="w-[76px] flex items-center gap-1.5 shrink-0">
        <span className="text-[0.75rem]">{icon}</span>
        <span className="text-[0.5rem] text-gray-500 font-bold leading-tight truncate"
          style={{ fontFamily: 'Rajdhani' }}>
          {label}
        </span>
      </div>

      {/* Barras A-G PROCEL Hollywood */}
      <div className="flex gap-[2px] flex-1 items-center relative">
        {allGrades.map((g, i) => {
          const isActive = i === activeIdx
          const color = gradeColors[g]
          const gradient = gradeGradients[g]
          const barW = 14 + i * 4.5

          return (
            <motion.div
              key={g}
              className="relative flex items-center"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: delay + i * 0.04,
                duration: 0.35,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <div style={{ width: `${barW}px` }} className="flex items-center">
                <motion.div
                  className="h-[14px] flex-1 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: gradient,
                    borderRadius: '3px 0 0 3px',
                    boxShadow: isActive
                      ? `0 0 16px ${color}90, 0 3px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)`
                      : 'inset 0 1px 0 rgba(255,255,255,0.35), 0 1px 3px rgba(0,0,0,0.06)',
                    transform: isActive ? 'scaleY(1.25) scaleX(1.08)' : 'scaleY(1)',
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    zIndex: isActive ? 10 : 1,
                  }}
                >
                  {/* Brilho 3D cinematográfico */}
                  <div className="absolute top-0 left-0 right-0 h-[55%]"
                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15) 50%, transparent)' }} />
                  <div className="absolute bottom-0 left-0 right-0 h-[20%]"
                    style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.12), transparent)' }} />
                  {/* Reflexo lateral */}
                  <div className="absolute top-0 left-0 w-[3px] h-full"
                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent)' }} />

                  <span className="relative z-10 text-[0.33rem] font-black select-none"
                    style={{
                      fontFamily: 'Orbitron',
                      color: 'rgba(255,255,255,0.95)',
                      textShadow: '0 1px 3px rgba(0,0,0,0.45)',
                      letterSpacing: '0.5px',
                    }}>
                    {g}
                  </span>
                </motion.div>

                {/* Ponta seta 3D */}
                <div style={{
                  width: 0, height: 0,
                  borderTop: '7px solid transparent',
                  borderBottom: '7px solid transparent',
                  borderLeft: `5px solid ${color}`,
                  filter: isActive ? `drop-shadow(2px 0 6px ${color}80)` : `drop-shadow(1px 0 1px rgba(0,0,0,0.1))`,
                  transform: isActive ? 'scaleY(1.25)' : 'scaleY(1)',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  zIndex: isActive ? 10 : 1,
                }} />
              </div>

              {/* Indicador ativo — badge preto pulsante */}
              {isActive && (
                <motion.div
                  className="absolute -right-6 top-1/2 -translate-y-1/2 flex items-center"
                  initial={{ opacity: 0, x: 10, scale: 0 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: delay + 0.5, type: 'spring', stiffness: 300, damping: 12 }}
                  style={{ zIndex: 20 }}
                >
                  <div style={{
                    width: 0, height: 0,
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderRight: '5px solid #1a1a2e',
                  }} />
                  <motion.div
                    className="w-[18px] h-[18px] rounded-[3px] flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(180deg, #2a2a3e, #1a1a2e)',
                      boxShadow: `0 2px 10px rgba(0,0,0,0.3), 0 0 15px ${color}50`,
                    }}
                    animate={{
                      boxShadow: [
                        `0 2px 10px rgba(0,0,0,0.3), 0 0 15px ${color}50`,
                        `0 3px 15px rgba(0,0,0,0.4), 0 0 25px ${color}70`,
                        `0 2px 10px rgba(0,0,0,0.3), 0 0 15px ${color}50`,
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-[0.4rem] font-black text-white"
                      style={{ fontFamily: 'Orbitron', textShadow: `0 0 8px ${color}` }}>
                      {g}
                    </span>
                  </motion.div>
                </motion.div>
              )}

              {/* Partículas para grade A */}
              {isActive && grade === 'A' && (
                <>
                  <motion.div
                    className="absolute -top-2.5 left-1/3 w-1 h-1 rounded-full pointer-events-none"
                    style={{ background: '#FFD700', boxShadow: '0 0 6px #FFD700' }}
                    animate={{ y: [-2, -12, -2], opacity: [0.3, 1, 0.3], scale: [0.6, 1.4, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute -top-1.5 left-2/3 w-0.5 h-0.5 rounded-full pointer-events-none"
                    style={{ background: '#00FF88', boxShadow: '0 0 4px #00FF88' }}
                    animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.div
                    className="absolute -top-2 left-1/2 w-0.5 h-0.5 rounded-full pointer-events-none"
                    style={{ background: color, boxShadow: `0 0 4px ${color}` }}
                    animate={{ y: [-1, -9, -1], opacity: [0.2, 0.9, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                  />
                </>
              )}

              {/* Partículas para grade B */}
              {isActive && grade === 'B' && (
                <motion.div
                  className="absolute -top-2 left-1/2 w-0.5 h-0.5 rounded-full pointer-events-none"
                  style={{ background: color, boxShadow: `0 0 4px ${color}` }}
                  animate={{ y: [-1, -8, -1], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Valor real com destaque */}
      <motion.span
        className="w-[62px] text-right text-[0.45rem] font-semibold truncate shrink-0"
        style={{
          fontFamily: 'Space Grotesk',
          color: activeIdx <= 1 ? gradeColors[grade] : '#888',
          fontWeight: activeIdx <= 1 ? 700 : 500,
        }}
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
