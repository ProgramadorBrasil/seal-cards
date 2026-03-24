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
  const allIndices = useMemo(() => getSpecIndices(monitor), [monitor])

  // Tilt + spotlight
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 200, damping: 25 })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 200, damping: 25 })
  // Spotlight follows cursor
  const spotlightX = useTransform(mouseX, [0, 1], [0, 100])
  const spotlightY = useTransform(mouseY, [0, 1], [0, 100])
  // Parallax for image
  const imgX = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 150, damping: 20 })
  const imgY = useSpring(useTransform(mouseY, [0, 1], [-5, 5]), { stiffness: 150, damping: 20 })

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

  // Partículas para cards Lendários/Épicos
  const particles = useMemo(() => {
    if (rarity !== 'legendary' && rarity !== 'epic') return []
    return Array.from({ length: 6 }, () => ({
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 4,
      dur: 2 + Math.random() * 3,
    }))
  }, [rarity])

  return (
    <motion.div
      className="relative"
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, y: 80, scale: 0.85, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ delay: index * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        ref={cardRef}
        className="relative w-[420px] h-[780px] cursor-pointer"
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
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: '#ffffff',
            boxShadow: `0 2px 4px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)`,
          }}
        >
          {/* Borda animada holográfica */}
          <div className="absolute inset-0 rounded-2xl" style={{
            background: `conic-gradient(from var(--angle), ${cfg.border}00, ${cfg.border}70, ${cfg.border}00, ${cfg.border}50, ${cfg.border}00)`,
            padding: '2px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            animation: 'borderRotate 3s linear infinite',
          }} />

          {/* Spotlight cursor overlay */}
          <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-[2] opacity-[0.06]"
            style={{
              background: useTransform(
                [spotlightX, spotlightY],
                ([x, y]) => `radial-gradient(circle 200px at ${x}% ${y}%, ${cfg.border}, transparent 70%)`
              ),
            }}
          />

          {/* Partículas flutuantes para Lendário/Épico */}
          {particles.map((p, i) => (
            <motion.div key={i} className="absolute rounded-full pointer-events-none" style={{
              width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`,
              background: cfg.particle, boxShadow: `0 0 6px ${cfg.particle}80`,
            }}
            animate={{ y: [-5, -20, -5], opacity: [0.2, 0.7, 0.2], scale: [0.7, 1.3, 0.7] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          <div className="relative z-10 h-full flex flex-col">
            {/* ── BARRA PROCEL TOPO ── */}
            <div className="h-2 w-full rounded-t-2xl" style={{
              background: 'linear-gradient(90deg, #009640 0%, #51B748 14%, #B9D433 28%, #EED600 42%, #FCB814 57%, #F37021 71%, #ED1C24 100%)',
              boxShadow: '0 2px 8px rgba(0,150,64,0.2)',
            }} />

            {/* ── HEADER ── */}
            <div className="px-7 pt-4 pb-3" style={{ borderBottom: '1.5px solid #eee' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <motion.h2
                      className="text-lg font-black tracking-[1px]"
                      style={{
                        fontFamily: 'Orbitron',
                        background: `linear-gradient(135deg, #1a1a2e 30%, ${cfg.border})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 + 0.3 }}
                    >
                      Monitor
                    </motion.h2>
                    <span className="text-[0.4rem] text-gray-300 px-1.5 py-0.5 rounded-md font-mono"
                      style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)' }}>
                      #{String(monitor.id).padStart(3, '0')}
                    </span>
                  </div>
                  <motion.p className="text-[0.42rem] text-gray-400 tracking-[1.5px] uppercase mt-0.5"
                    style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.06 + 0.4 }}>
                    Selo de Eficiência FabIA 2026
                  </motion.p>
                </div>
                <ScoreRing score={seal.overall} color={seal.verdictColor} size={62} label="NOTA" />
              </div>

              {/* Fabricante / Modelo */}
              <motion.div className="mt-2 flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 + 0.5 }}>
                <div className="flex-1">
                  <span className="text-[0.5rem] text-gray-400 block" style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>Fabricante</span>
                  <span className="text-[0.7rem] text-gray-800 font-bold" style={{ fontFamily: 'Space Grotesk' }}>{monitor.brand}</span>
                </div>
                <div className="flex-[1.5]">
                  <span className="text-[0.5rem] text-gray-400 block" style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>Modelo / Tamanho</span>
                  <span className="text-[0.6rem] text-gray-800 font-bold leading-tight block" style={{ fontFamily: 'Space Grotesk' }}>
                    {monitor.name.replace(monitor.brand, '').trim()} · {monitor.size_inches}"
                  </span>
                </div>
              </motion.div>

              {/* Badge */}
              <motion.div className="mt-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.06 + 0.6, type: 'spring' }}>
                <SealBadge rarity={rarity} verdict={seal.verdict} verdictColor={seal.verdictColor} />
              </motion.div>
            </div>

            {/* ── IMAGEM DO MONITOR com flutuação ── */}
            <motion.div className="px-7 py-3 flex justify-center relative"
              style={{ borderBottom: '1px solid #f5f5f5' }}>
              {monitor.image_url ? (
                <motion.img
                  src={monitor.image_url}
                  alt={monitor.name}
                  className="h-28 w-auto object-contain"
                  loading="lazy"
                  style={{
                    filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.2))',
                    x: imgX,
                    y: imgY,
                  }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  onError={(e) => {
                    const el = e.target as HTMLImageElement
                    el.style.display = 'none'
                  }}
                />
              ) : (
                <div className="h-28 flex items-center justify-center text-gray-200 text-5xl">🖥️</div>
              )}
              {/* Reflexo sutil */}
              <div className="absolute bottom-0 left-7 right-7 h-4" style={{
                background: 'linear-gradient(0deg, rgba(0,0,0,0.02), transparent)',
                borderRadius: '0 0 8px 8px',
              }} />
            </motion.div>

            {/* ── 18 ÍNDICES PROCEL ── */}
            <div className="px-5 py-2 flex-1">
              <div className="space-y-[4px]">
                {allIndices.map((idx, i) => (
                  <SpecEnergyBar
                    key={idx.label}
                    icon={idx.icon}
                    label={idx.label}
                    grade={idx.grade}
                    detail={idx.detail}
                    delay={0.1 + i * 0.03}
                  />
                ))}
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="px-7 py-3 mt-auto" style={{ borderTop: '2px solid #eee' }}>
              {/* Categorias + Preço */}
              <div className="flex items-center justify-between">
                <RecommendBadge categories={monitor.rtings_categories} pickRank={monitor.rtings_pick_rank} />
                {monitor.price_usd && (
                  <motion.div className="text-right"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}>
                    <span className="text-[0.4rem] text-gray-400 block" style={{ fontFamily: 'Rajdhani' }}>A PARTIR DE</span>
                    <span className="text-xl font-black" style={{
                      fontFamily: 'Orbitron',
                      background: `linear-gradient(135deg, ${cfg.border}, #1a1a2e)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      ${monitor.price_usd}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Botão Amazon — pulsante */}
              {monitor.affiliate_url && (
                <motion.a
                  href={monitor.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[0.65rem] font-bold tracking-[2px] uppercase no-underline relative overflow-hidden"
                  style={{
                    fontFamily: 'Orbitron',
                    background: 'linear-gradient(180deg, #FFB347 0%, #FF9900 40%, #E88700 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 20px rgba(255,153,0,0.35), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)',
                    textShadow: '0 1px 3px rgba(0,0,0,0.25)',
                  }}
                  whileHover={{ scale: 1.03, boxShadow: '0 6px 30px rgba(255,153,0,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                >
                  {/* Brilho animado */}
                  <motion.div className="absolute top-0 left-0 right-0 h-[50%] pointer-events-none"
                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent)' }} />
                  {/* Pulse shimmer */}
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.2) 50%, transparent 75%)',
                      backgroundSize: '250% 100%',
                    }}
                    animate={{ backgroundPosition: ['250% 0', '-250% 0'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 2 }}
                  />
                  <span className="relative z-10">🛒 Comprar na Amazon</span>
                </motion.a>
              )}

              {/* Rodapé info */}
              <div className="flex items-center justify-between mt-2 pt-1.5" style={{ borderTop: '1px solid #f0f0f0' }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #0088cc, #7b2ff7)' }}>
                    <span className="text-[0.25rem] font-black text-white" style={{ fontFamily: 'Orbitron' }}>F</span>
                  </div>
                  <span className="text-[0.38rem] text-gray-300 tracking-[1px] font-bold" style={{ fontFamily: 'Rajdhani' }}>
                    FABIA SMART CART · 2026
                  </span>
                </div>
                <motion.span className="text-[0.38rem] text-gray-300 tracking-[1.5px] uppercase" style={{ fontFamily: 'Rajdhani' }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  TOQUE P/ DETALHES →
                </motion.span>
              </div>
            </div>
          </div>

          {/* Glow canto */}
          <motion.div className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${cfg.border}12, transparent 70%)` }}
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.div>

        {/* ═══════════ VERSO ═══════════ */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#ffffff',
            boxShadow: '0 10px 50px rgba(0,0,0,0.12)',
          }}
        >
          <div className="absolute inset-0 rounded-2xl" style={{ border: `2px solid ${cfg.border}25` }} />

          <div className="relative z-10 h-full flex flex-col p-6">
            {/* Header verso */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm tracking-[2px] uppercase font-black"
                  style={{
                    fontFamily: 'Orbitron',
                    background: `linear-gradient(90deg, ${cfg.border}, #1a1a2e)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                  Detalhes
                </h3>
                <p className="text-[0.5rem] text-gray-400 mt-0.5" style={{ fontFamily: 'Space Grotesk' }}>
                  {monitor.name}
                </p>
              </div>
              <ScoreRing score={seal.overall} color={seal.verdictColor} size={65} label="NOTA" />
            </div>

            {/* Specs resumo */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Resolução', value: monitor.specs.resolution_name, icon: '🖥️' },
                { label: 'Taxa', value: `${monitor.specs.refresh_rate_hz}Hz`, icon: '⚡' },
                { label: 'Painel', value: monitor.specs.panel_type, icon: '🎨' },
                { label: 'Tamanho', value: `${monitor.size_inches}"`, icon: '📏' },
                { label: 'HDR', value: monitor.specs.hdr_peak_brightness_nits ? `${monitor.specs.hdr_peak_brightness_nits}nits` : '—', icon: '💡' },
                { label: 'Resposta', value: `${monitor.specs.response_time_gtg_ms}ms`, icon: '⏱️' },
              ].map((s) => (
                <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}>
                  <div className="text-sm">{s.icon}</div>
                  <div className="text-[0.5rem] text-gray-700 font-bold mt-0.5" style={{ fontFamily: 'Space Grotesk' }}>{s.value}</div>
                  <div className="text-[0.4rem] text-gray-400 mt-0.5" style={{ fontFamily: 'Rajdhani' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Seções de detalhe */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {[
                { title: 'Conectividade', icon: '🔌', content: monitor.specs.connectivity },
                { title: 'Ergonomia', icon: '🏗️', content: monitor.specs.ergonomics },
                { title: 'Suporte HDR', icon: '📺', content: monitor.specs.hdr_support },
                { title: 'VRR', icon: '🔄', content: monitor.specs.vrr },
                { title: 'Revestimento', icon: '🪞', content: monitor.specs.reflection_coating },
              ].map((sec) => (
                <div key={sec.title} className="px-3 py-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)', borderLeft: `3px solid ${cfg.border}30` }}>
                  <div className="text-[0.45rem] text-gray-400 font-bold tracking-[2px] uppercase" style={{ fontFamily: 'Rajdhani' }}>
                    {sec.icon} {sec.title}
                  </div>
                  <div className="text-[0.55rem] text-gray-600 mt-0.5 leading-relaxed" style={{ fontFamily: 'Space Grotesk' }}>
                    {sec.content}
                  </div>
                </div>
              ))}

              {monitor.ean && (
                <div className="px-3 py-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.02)' }}>
                  <span className="text-[0.4rem] text-gray-400 font-mono">EAN: {monitor.ean}</span>
                </div>
              )}
            </div>

            {/* Score bars */}
            <div className="mt-4 pt-3 space-y-2" style={{ borderTop: '2px solid #eee' }}>
              <div className="text-[0.45rem] text-gray-400 font-bold tracking-[2px] uppercase"
                style={{ fontFamily: 'Rajdhani' }}>
                Pontuação por Categoria
              </div>
              {[
                { label: 'Jogos', value: seal.gaming, color: '#0088cc', icon: '🎮' },
                { label: 'Visual', value: seal.visual, color: '#7b2ff7', icon: '🎨' },
                { label: 'Construção', value: seal.build, color: '#00aa55', icon: '🏗️' },
                { label: 'Valor', value: seal.value, color: '#d4880a', icon: '💰' },
              ].map((bar) => (
                <div key={bar.label} className="flex items-center gap-2">
                  <span className="text-xs">{bar.icon}</span>
                  <span className="text-[0.5rem] w-16 text-gray-500 font-bold" style={{ fontFamily: 'Rajdhani' }}>
                    {bar.label}
                  </span>
                  <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)' }}>
                    <motion.div className="h-full rounded-full relative overflow-hidden"
                      style={{ background: `linear-gradient(90deg, ${bar.color}bb, ${bar.color})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.value}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-[45%]"
                        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.4), transparent)' }} />
                    </motion.div>
                  </div>
                  <span className="text-[0.55rem] w-7 text-right font-black" style={{ fontFamily: 'Orbitron', color: bar.color }}>
                    {bar.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 text-center">
              <motion.span className="text-[0.38rem] text-gray-300 tracking-[2px] uppercase" style={{ fontFamily: 'Rajdhani' }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}>
                ← TOQUE PARA VOLTAR
              </motion.span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
