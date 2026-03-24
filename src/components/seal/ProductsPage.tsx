import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { monitors, categoryLabels } from '../../data/monitor-specs'
import ProductSealCard from './ProductSealCard'

const allCategories = Array.from(new Set(monitors.flatMap((m) => m.rtings_categories)))

// Spec filter options
const resolutionOptions = ['Todas', '4K UHD', 'QHD 1440p', 'Ultrawide', '6K+']
const panelOptions = ['Todos', 'QD-OLED', 'OLED/WOLED', 'Mini LED', 'IPS', 'VA']
const refreshOptions = ['Todos', '360Hz+', '240Hz+', '144Hz+', '60Hz']
const responseOptions = ['Todos', '< 0.1ms', '< 1ms', '< 5ms']

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [resFilter, setResFilter] = useState('Todas')
  const [panelFilter, setPanelFilter] = useState('Todos')
  const [refreshFilter, setRefreshFilter] = useState('Todos')
  const [responseFilter, setResponseFilter] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let result = monitors

    // Category filter
    if (activeCategory) {
      result = result.filter((m) => m.rtings_categories.includes(activeCategory))
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.brand.toLowerCase().includes(q) ||
          m.specs.panel_type.toLowerCase().includes(q)
      )
    }

    // Resolution filter
    if (resFilter !== 'Todas') {
      result = result.filter((m) => {
        const r = m.specs.resolution_name.toLowerCase()
        if (resFilter === '4K UHD') return r.includes('4k')
        if (resFilter === 'QHD 1440p') return r.includes('1440')
        if (resFilter === 'Ultrawide') return r.includes('ultrawide')
        if (resFilter === '6K+') return parseInt(m.specs.resolution.split('x')[0]) >= 5000
        return true
      })
    }

    // Panel filter
    if (panelFilter !== 'Todos') {
      result = result.filter((m) => {
        const p = m.specs.panel_type.toLowerCase()
        if (panelFilter === 'QD-OLED') return p.includes('qd-oled')
        if (panelFilter === 'OLED/WOLED') return (p.includes('oled') || p.includes('woled')) && !p.includes('qd-oled')
        if (panelFilter === 'Mini LED') return p.includes('mini led')
        if (panelFilter === 'IPS') return p.includes('ips')
        if (panelFilter === 'VA') return p.includes('va') && !p.includes('mini led')
        return true
      })
    }

    // Refresh rate filter
    if (refreshFilter !== 'Todos') {
      result = result.filter((m) => {
        if (refreshFilter === '360Hz+') return m.specs.refresh_rate_hz >= 360
        if (refreshFilter === '240Hz+') return m.specs.refresh_rate_hz >= 240
        if (refreshFilter === '144Hz+') return m.specs.refresh_rate_hz >= 144
        if (refreshFilter === '60Hz') return m.specs.refresh_rate_hz <= 75
        return true
      })
    }

    // Response time filter
    if (responseFilter !== 'Todos') {
      result = result.filter((m) => {
        if (responseFilter === '< 0.1ms') return m.specs.response_time_gtg_ms < 0.1
        if (responseFilter === '< 1ms') return m.specs.response_time_gtg_ms < 1
        if (responseFilter === '< 5ms') return m.specs.response_time_gtg_ms < 5
        return true
      })
    }

    return result
  }, [activeCategory, searchQuery, resFilter, panelFilter, refreshFilter, responseFilter])

  const hasActiveSpecFilters = resFilter !== 'Todas' || panelFilter !== 'Todos' || refreshFilter !== 'Todos' || responseFilter !== 'Todos'

  const clearSpecFilters = () => {
    setResFilter('Todas')
    setPanelFilter('Todos')
    setRefreshFilter('Todos')
    setResponseFilter('Todos')
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(180deg, #f4f6f9 0%, #eef0f5 50%, #f4f6f9 100%)' }}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 30% -10%, rgba(0,136,204,0.06), transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(123,47,247,0.04), transparent 50%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-6">
          {/* FabIA Logo */}
          <motion.div className="flex items-center gap-4"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0088cc, #7b2ff7)',
                boxShadow: '0 4px 20px rgba(0,136,204,0.3)',
              }}
              animate={{ boxShadow: ['0 4px 20px rgba(0,136,204,0.3)', '0 6px 30px rgba(0,136,204,0.4)', '0 4px 20px rgba(0,136,204,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-2xl font-black text-white" style={{ fontFamily: 'Orbitron' }}>F</span>
              <div className="absolute top-0 left-0 right-0 h-[50%]"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25), transparent)' }} />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-[4px]"
                style={{
                  fontFamily: 'Orbitron',
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #0088cc 40%, #7b2ff7 70%, #e0005a 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                FabIA Indica
              </h1>
              <p className="text-[0.6rem] tracking-[3px] uppercase text-gray-400 mt-0.5"
                style={{ fontFamily: 'Rajdhani', fontWeight: 600 }}>
                Selo de Eficiência · Inteligência de Monitores 2026
              </p>
            </div>
          </motion.div>

          {/* Frase FabIA */}
          <motion.div className="mt-4 flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #0088cc, #7b2ff7)' }} />
            <p className="text-sm text-gray-500 italic" style={{ fontFamily: 'Space Grotesk' }}>
              "A FabIA analisou <strong className="text-gray-700">{monitors.length} monitores</strong> e classificou 18 índices para você."
            </p>
          </motion.div>

          {/* Search */}
          <motion.div className="mt-5 relative max-w-md"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm">🔍</span>
            <input type="text" placeholder="Buscar por marca, modelo ou painel..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm outline-none"
              style={{
                fontFamily: 'Space Grotesk', background: '#fff',
                border: '1px solid rgba(0,0,0,0.06)', color: '#1a1a2e',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }} />
          </motion.div>

          {/* Filtros por Spec — botão toggle */}
          <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.6rem] font-bold tracking-[1px] uppercase transition-all"
              style={{
                fontFamily: 'Rajdhani',
                background: showFilters ? 'linear-gradient(135deg, #0088cc, #7b2ff7)' : '#fff',
                color: showFilters ? '#fff' : '#888',
                border: showFilters ? 'none' : '1px solid rgba(0,0,0,0.06)',
                boxShadow: showFilters ? '0 3px 12px rgba(0,136,204,0.25)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              ⚙️ Filtrar por Especificações
              {hasActiveSpecFilters && (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              )}
            </button>

            {/* Spec filter dropdowns */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl"
                  style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Resolução */}
                  <div>
                    <label className="text-[0.5rem] text-gray-400 font-bold tracking-[1px] uppercase block mb-1"
                      style={{ fontFamily: 'Rajdhani' }}>🖥️ Resolução</label>
                    <select value={resFilter} onChange={(e) => setResFilter(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg text-[0.6rem] text-gray-700 outline-none"
                      style={{ fontFamily: 'Space Grotesk', background: '#f8f8f8', border: '1px solid #eee' }}>
                      {resolutionOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  {/* Painel */}
                  <div>
                    <label className="text-[0.5rem] text-gray-400 font-bold tracking-[1px] uppercase block mb-1"
                      style={{ fontFamily: 'Rajdhani' }}>🎨 Painel</label>
                    <select value={panelFilter} onChange={(e) => setPanelFilter(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg text-[0.6rem] text-gray-700 outline-none"
                      style={{ fontFamily: 'Space Grotesk', background: '#f8f8f8', border: '1px solid #eee' }}>
                      {panelOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  {/* Taxa Hz */}
                  <div>
                    <label className="text-[0.5rem] text-gray-400 font-bold tracking-[1px] uppercase block mb-1"
                      style={{ fontFamily: 'Rajdhani' }}>⚡ Taxa Hz</label>
                    <select value={refreshFilter} onChange={(e) => setRefreshFilter(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg text-[0.6rem] text-gray-700 outline-none"
                      style={{ fontFamily: 'Space Grotesk', background: '#f8f8f8', border: '1px solid #eee' }}>
                      {refreshOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  {/* Resposta */}
                  <div>
                    <label className="text-[0.5rem] text-gray-400 font-bold tracking-[1px] uppercase block mb-1"
                      style={{ fontFamily: 'Rajdhani' }}>🎯 Resposta</label>
                    <select value={responseFilter} onChange={(e) => setResponseFilter(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg text-[0.6rem] text-gray-700 outline-none"
                      style={{ fontFamily: 'Space Grotesk', background: '#f8f8f8', border: '1px solid #eee' }}>
                      {responseOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>

                  {hasActiveSpecFilters && (
                    <div className="col-span-full flex justify-end">
                      <button onClick={clearSpecFilters}
                        className="text-[0.5rem] text-red-400 font-bold tracking-[1px] uppercase hover:text-red-500"
                        style={{ fontFamily: 'Rajdhani' }}>
                        ✕ Limpar Filtros
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Category filters */}
          <motion.div className="mt-3 flex flex-wrap gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <button
              onClick={() => setActiveCategory(null)}
              className="px-3.5 py-1.5 rounded-full text-[0.55rem] tracking-[1.5px] uppercase transition-all"
              style={{
                fontFamily: 'Rajdhani', fontWeight: 700,
                background: !activeCategory ? 'linear-gradient(135deg, #0088cc, #7b2ff7)' : '#fff',
                border: !activeCategory ? 'none' : '1px solid rgba(0,0,0,0.06)',
                color: !activeCategory ? '#fff' : '#999',
                boxShadow: !activeCategory ? '0 3px 12px rgba(0,136,204,0.25)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              Todos ({monitors.length})
            </button>
            {allCategories.map((cat) => (
              <button key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className="px-3 py-1.5 rounded-full text-[0.55rem] tracking-[1px] uppercase transition-all"
                style={{
                  fontFamily: 'Rajdhani', fontWeight: 600,
                  background: activeCategory === cat ? 'linear-gradient(135deg, #0088cc, #7b2ff7)' : '#fff',
                  border: activeCategory === cat ? 'none' : '1px solid rgba(0,0,0,0.06)',
                  color: activeCategory === cat ? '#fff' : '#999',
                  boxShadow: activeCategory === cat ? '0 3px 12px rgba(0,136,204,0.25)' : '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </motion.div>

          <motion.div className="mt-3 text-[0.55rem] tracking-[2px] uppercase text-gray-400 font-bold"
            style={{ fontFamily: 'Rajdhani' }}>
            {filtered.length} {filtered.length === 1 ? 'monitor encontrado' : 'monitores encontrados'}
            {hasActiveSpecFilters && <span className="text-blue-400 ml-2">· filtros ativos</span>}
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="popLayout">
          <motion.div className="grid gap-8 justify-items-center"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }} layout>
            {filtered.map((monitor, i) => (
              <motion.div key={monitor.id} layout
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}>
                <ProductSealCard monitor={monitor} index={i} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div className="text-center mt-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-400 text-sm" style={{ fontFamily: 'Rajdhani' }}>
              Nenhum monitor encontrado com esses filtros
            </p>
            <button onClick={() => { clearSpecFilters(); setActiveCategory(null); setSearchQuery('') }}
              className="mt-3 text-[0.6rem] text-blue-400 font-bold underline" style={{ fontFamily: 'Rajdhani' }}>
              Limpar todos os filtros
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0088cc, #7b2ff7)' }}>
            <span className="text-[0.5rem] font-black text-white" style={{ fontFamily: 'Orbitron' }}>F</span>
          </div>
          <span className="text-[0.6rem] font-bold text-gray-400 tracking-[2px]" style={{ fontFamily: 'Orbitron' }}>
            FabIA Smart Cart
          </span>
        </div>
        <p className="text-[0.45rem] tracking-[3px] uppercase text-gray-300" style={{ fontFamily: 'Rajdhani' }}>
          Especificações Oficiais dos Fabricantes · 2026
        </p>
      </div>
    </div>
  )
}
