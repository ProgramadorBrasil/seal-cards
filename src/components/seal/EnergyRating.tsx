import { motion } from 'framer-motion'

interface Props {
  rating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
  delay?: number
}

const bands: { letter: string; color: string; width: number }[] = [
  { letter: 'A', color: '#009640', width: 35 },
  { letter: 'B', color: '#51B748', width: 42 },
  { letter: 'C', color: '#B9D433', width: 50 },
  { letter: 'D', color: '#FFF200', width: 58 },
  { letter: 'E', color: '#FCB814', width: 66 },
  { letter: 'F', color: '#F37021', width: 75 },
  { letter: 'G', color: '#ED1C24', width: 85 },
]

export default function EnergyRating({ rating, delay = 0 }: Props) {
  const activeIndex = bands.findIndex((b) => b.letter === rating)

  return (
    <div className="relative">
      {/* Labels */}
      <div className="flex justify-between mb-1 px-1">
        <span className="text-[0.5rem] font-bold text-gray-500 tracking-wider" style={{ fontFamily: 'Rajdhani' }}>
          MAIS EFICIENTE
        </span>
        <span className="text-[0.5rem] font-bold text-gray-400 tracking-wider" style={{ fontFamily: 'Rajdhani' }}>
        </span>
      </div>

      <div className="space-y-[3px]">
        {bands.map((band, i) => {
          const isActive = i === activeIndex
          return (
            <div key={band.letter} className="flex items-center gap-1">
              {/* Barra colorida com seta */}
              <motion.div
                className="relative flex items-center"
                style={{ width: `${band.width}%` }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: delay + i * 0.08,
                  duration: 0.5,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                <div
                  className="w-full h-5 flex items-center justify-end pr-1.5 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(180deg, ${band.color}ee 0%, ${band.color} 40%, ${band.color}cc 100%)`,
                    borderRadius: '2px 0 0 2px',
                    boxShadow: isActive
                      ? `0 0 12px ${band.color}80, 0 2px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)`
                      : `0 1px 2px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.2)`,
                  }}
                >
                  {/* Brilho 3D cartoon no topo */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[45%]"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.35), transparent)',
                    }}
                  />
                  <span
                    className="relative z-10 font-black text-[0.6rem] text-white"
                    style={{
                      fontFamily: 'Orbitron',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {band.letter}
                  </span>
                </div>

                {/* Ponta da seta (triângulo) */}
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: '10px solid transparent',
                    borderBottom: '10px solid transparent',
                    borderLeft: `8px solid ${band.color}`,
                    filter: isActive ? `drop-shadow(2px 0 4px ${band.color}60)` : 'none',
                  }}
                />
              </motion.div>

              {/* Seta indicadora para a banda ativa */}
              {isActive && (
                <motion.div
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, x: -20, scale: 0.5 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    delay: delay + 0.8,
                    duration: 0.6,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  {/* Seta preta apontando para a barra */}
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '12px solid transparent',
                      borderBottom: '12px solid transparent',
                      borderRight: '10px solid #1a1a2e',
                    }}
                  />
                  <motion.div
                    className="px-3 py-1 rounded-sm flex items-center justify-center"
                    style={{
                      background: '#1a1a2e',
                      boxShadow: `0 4px 15px rgba(0,0,0,0.2), 0 0 20px ${band.color}30`,
                    }}
                    animate={{
                      boxShadow: [
                        `0 4px 15px rgba(0,0,0,0.2), 0 0 20px ${band.color}30`,
                        `0 4px 20px rgba(0,0,0,0.3), 0 0 35px ${band.color}50`,
                        `0 4px 15px rgba(0,0,0,0.2), 0 0 20px ${band.color}30`,
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span
                      className="text-xl font-black text-white"
                      style={{
                        fontFamily: 'Orbitron',
                        textShadow: `0 0 10px ${band.color}`,
                      }}
                    >
                      {band.letter}
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-between mt-1 px-1">
        <span className="text-[0.5rem] font-bold text-gray-400 tracking-wider" style={{ fontFamily: 'Rajdhani' }}>
        </span>
        <span className="text-[0.5rem] font-bold text-gray-500 tracking-wider" style={{ fontFamily: 'Rajdhani' }}>
          MENOS EFICIENTE
        </span>
      </div>
    </div>
  )
}

// Mapeia score 0-100 para classificação A-G
export function scoreToRating(score: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' {
  if (score >= 85) return 'A'
  if (score >= 75) return 'B'
  if (score >= 65) return 'C'
  if (score >= 55) return 'D'
  if (score >= 45) return 'E'
  if (score >= 35) return 'F'
  return 'G'
}
