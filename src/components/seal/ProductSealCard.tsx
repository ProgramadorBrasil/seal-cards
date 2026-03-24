import { useState, useRef, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import type { Monitor } from '../../data/monitor-specs'
import { getPanelRarity, rarityConfig } from '../../data/monitor-specs'
import { computeSeal, getSpecIndices } from '../../lib/seal-engine'
import SpecEnergyBar from './SpecEnergyBar'
import ScoreRing from './ScoreRing'
import SealBadge from './SealBadge'
import RecommendBadge from './RecommendBadge'

interface Props {
  monitor: Monitor
  index: number
}

export default function ProductSealCard({ monitor, index }: Props) {
  const [isFlipped, setIsFlipped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const rarity = useMemo(() => getPanelRarity(monitor.specs.panel_type), [monitor])
  const cfg = useMemo(() => rarityConfig[rarity], [rarity])
  const seal = useMemo(() => computeSeal(monitor), [monitor])
  const specIndices = useMemo(() => getSpecIndices(monitor), [monitor])

  // Tilt
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), { stiffness: 200, damping: 25 })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), { stiffness: 200, damping: 25 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      mouseX.set((e.clientX - rect.left) / rect.width)
      mouseY.set((e.clientY - rect.top) / rect.height)
    },
    [mouseX, mouseY]
  )

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }, [mouseX, mouseY])

  // Primeira metade dos indices (frente) e segunda metade (verso)
  const frontIndices = specIndices.slice(0, 9)
  const backIndices = specIndices.slice(9)

  return (
    <motion.div
      className="relative"
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        ref={cardRef}
        className="relative w-[380px] h-[600px] cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* ═══════════ FRENTE ═══════════ */}
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: '#ffffff',
            boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* Borda animada */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: `conic-gradient(from var(--angle), ${cfg.border}00, ${cfg.border}60, ${cfg.border}00, ${cfg.border}40, ${cfg.border}00)`,
              padding: '2px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              animation: 'borderRotate 4s linear infinite',
            }}
          />

          <div className="relative z-10 h-full flex flex-col">
            {/* Header estilo PROCEL */}
            <div className="px-4 pt-3 pb-2" style={{ borderBottom: '2px solid #eee' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2
                      className="text-xl font-black tracking-wide"
                      style={{
                        fontFamily: 'Orbitron',
                        background: `linear-gradient(90deg, #1a1a2e, ${cfg.border})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Monitor
                    </h2>
                    <span className="text-[0.45rem] text-gray-300 px-1.5 py-0.5 rounded bg-gray-50 font-mono">
                      #{String(monitor.id).padStart(3, '0')}
                    </span>
                  </div>
                  <p className="text-[0.45rem] text-gray-400 tracking-[1px] uppercase"
                    style={{ fontFamily: 'Rajdhani', fontWeight: 600 }}>
                    Selo de Eficiência RTINGS 2026
                  </p>
                </div>
                <ScoreRing score={seal.overall} color={seal.verdictColor} size={56} />
              </div>

              {/* Fabricante / Modelo */}
              <div className="mt-1.5 flex items-center gap-3">
                <div className="flex-1">
                  <span className="text-[0.5rem] text-gray-400 block" style={{ fontFamily: 'Rajdhani', fontWeight: 600 }}>Fabricante</span>
                  <span className="text-[0.65rem] text-gray-700 font-bold" style={{ fontFamily: 'Space Grotesk' }}>{monitor.brand}</span>
                </div>
                <div className="flex-1">
                  <span className="text-[0.5rem] text-gray-400 block" style={{ fontFamily: 'Rajdhani', fontWeight: 600 }}>Modelo / Tamanho</span>
                  <span className="text-[0.55rem] text-gray-700 font-bold leading-tight block" style={{ fontFamily: 'Space Grotesk' }}>
                    {monitor.name.replace(monitor.brand, '').trim()} · {monitor.size_inches}"
                  </span>
                </div>
              </div>

              <div className="mt-1.5">
                <SealBadge rarity={rarity} verdict={seal.verdict} verdictColor={seal.verdictColor} />
              </div>
            </div>

            {/* 9 índices com barras A-G PROCEL */}
            <div className="px-4 py-2 flex-1 overflow-hidden">
              <div className="space-y-2">
                {frontIndices.map((idx, i) => (
                  <SpecEnergyBar
                    key={idx.label}
                    icon={idx.icon}
                    label={idx.label}
                    grade={idx.grade}
                    detail={idx.detail}
                    delay={index * 0.05 + 0.3 + i * 0.06}
                  />
                ))}
              </div>
            </div>

            {/* Footer com preço + botão comprar */}
            <div className="px-4 py-2 mt-auto" style={{ borderTop: '2px solid #eee' }}>
              <div className="flex items-center justify-between">
                <RecommendBadge categories={monitor.rtings_categories} pickRank={monitor.rtings_pick_rank} />
                {monitor.price_usd && (
                  <div className="text-right">
                    <span
                      className="text-lg font-black"
                      style={{
                        fontFamily: 'Orbitron',
                        color: cfg.border,
                        filter: `drop-shadow(0 0 4px ${cfg.border}30)`,
                      }}
                    >
                      ${monitor.price_usd}
                    </span>
                  </div>
                )}
              </div>

              {/* Botão comprar afiliado */}
              {monitor.affiliate_url && (
                <motion.a
                  href={monitor.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[0.6rem] font-bold tracking-[2px] uppercase no-underline"
                  style={{
                    fontFamily: 'Rajdhani',
                    background: 'linear-gradient(135deg, #FF9900, #FF6600)',
                    color: '#fff',
                    boxShadow: '0 3px 12px rgba(255,153,0,0.3)',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 5px 20px rgba(255,153,0,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  🛒 Comprar na Amazon
                </motion.a>
              )}

              <div className="flex items-center justify-between mt-1.5 pt-1" style={{ borderTop: '1px solid #f0f0f0' }}>
                <div className="text-[0.4rem] text-gray-300 tracking-[1px]" style={{ fontFamily: 'Rajdhani' }}>
                  RTINGS.COM · DADOS 2026
                </div>
                <span className="text-[0.4rem] text-gray-300 tracking-[2px] uppercase" style={{ fontFamily: 'Rajdhani' }}>
                  TOQUE P/ MAIS ÍNDICES →
                </span>
              </div>
            </div>
          </div>

          {/* Glow sutil */}
          <motion.div
            className="absolute -top-16 -right-16 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${cfg.border}10, transparent 70%)` }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.div>

        {/* ═══════════ VERSO ═══════════ */}
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#ffffff',
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          }}
        >
          <div className="absolute inset-0 rounded-xl" style={{ border: `2px solid ${cfg.border}20` }} />

          <div className="relative z-10 h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-2">
              <h3
                className="text-xs tracking-[2px] uppercase"
                style={{
                  fontFamily: 'Orbitron',
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${cfg.border}, #1a1a2e)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                + Índices
              </h3>
              <span className="text-[0.55rem] text-gray-500 font-bold" style={{ fontFamily: 'Space Grotesk' }}>
                {monitor.name.replace(monitor.brand, '').trim()}
              </span>
            </div>

            {/* Restante dos 9 índices */}
            <div className="space-y-2 flex-1">
              {backIndices.map((idx, i) => (
                <SpecEnergyBar
                  key={idx.label}
                  icon={idx.icon}
                  label={idx.label}
                  grade={idx.grade}
                  detail={idx.detail}
                  delay={i * 0.06}
                />
              ))}
            </div>

            {/* Score bars resumo */}
            <div className="mt-3 pt-2 space-y-1.5" style={{ borderTop: '2px solid #eee' }}>
              <div className="text-[0.5rem] text-gray-400 font-bold tracking-[2px] uppercase mb-1"
                style={{ fontFamily: 'Rajdhani' }}>
                Pontuação Geral
              </div>
              {[
                { label: 'Jogos', value: seal.gaming, color: '#0088cc' },
                { label: 'Visual', value: seal.visual, color: '#7b2ff7' },
                { label: 'Construção', value: seal.build, color: '#00aa55' },
                { label: 'Valor', value: seal.value, color: '#d4880a' },
              ].map((bar) => (
                <div key={bar.label} className="flex items-center gap-2">
                  <span className="text-[0.5rem] w-16 text-gray-400 font-semibold" style={{ fontFamily: 'Rajdhani' }}>
                    {bar.label}
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full relative overflow-hidden"
                      style={{
                        background: `linear-gradient(90deg, ${bar.color}cc, ${bar.color})`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.value}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-[45%]"
                        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35), transparent)' }} />
                    </motion.div>
                  </div>
                  <span className="text-[0.5rem] w-6 text-right font-black" style={{ fontFamily: 'Orbitron', color: bar.color }}>
                    {bar.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-2 text-center text-[0.4rem] text-gray-300 tracking-[3px] uppercase"
              style={{ fontFamily: 'Rajdhani' }}>
              ← TOQUE PARA VOLTAR
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
