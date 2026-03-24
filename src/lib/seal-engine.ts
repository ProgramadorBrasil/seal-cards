import type { Monitor, MonitorSpecs } from '../data/monitor-specs'

export interface SealScores {
  gaming: number      // 0-100 — Speed + refresh + VRR + input lag
  visual: number      // 0-100 — Color, HDR, contrast, brightness
  build: number       // 0-100 — Ergonomics, connectivity, size
  value: number       // 0-100 — Price/performance ratio
  overall: number     // 0-100 — Weighted average
  verdict: string     // "S+" | "S" | "A" | "B" | "C" | "D"
  verdictColor: string
}

// Normalize a value to 0-100 scale with min/max bounds
function norm(val: number | null, min: number, max: number, invert = false): number {
  if (val === null || val === undefined) return 50
  const clamped = Math.max(min, Math.min(max, val))
  const n = ((clamped - min) / (max - min)) * 100
  return invert ? 100 - n : n
}

function computeGaming(s: MonitorSpecs): number {
  const refresh = norm(s.refresh_rate_hz, 60, 540)
  const response = norm(s.response_time_gtg_ms, 0.01, 10, true)
  const inputLag = norm(s.input_lag_ms, 0.1, 30, true)
  const vrr = s.vrr.toLowerCase()
  const vrrBonus = (vrr.includes('freesync') ? 8 : 0) + (vrr.includes('g-sync') ? 8 : 0) + (vrr.includes('adaptive') ? 4 : 0)
  return Math.min(100, refresh * 0.30 + response * 0.25 + inputLag * 0.15 + vrrBonus + 10)
}

function computeVisual(s: MonitorSpecs): number {
  const hdrBright = norm(s.hdr_peak_brightness_nits, 200, 1500)
  const sdrBright = norm(s.sdr_brightness_nits, 200, 700)
  const p3 = norm(s.dci_p3_coverage_pct, 70, 103)
  const colorAcc = norm(s.color_accuracy_delta_e, 0.3, 5, true)
  const depth = s.color_depth_bit >= 10 ? 12 : 0
  const panel = s.panel_type.toLowerCase()
  const panelBonus = panel.includes('qd-oled') ? 20 : panel.includes('oled') || panel.includes('woled') ? 18 : panel.includes('mini led') ? 12 : 0
  return Math.min(100, hdrBright * 0.20 + sdrBright * 0.08 + p3 * 0.18 + colorAcc * 0.12 + depth + panelBonus + 12)
}

function computeBuild(s: MonitorSpecs, sizeInches: number): number {
  const ergo = s.ergonomics.toLowerCase()
  let ergoScore = 30
  if (ergo.includes('height')) ergoScore += 18
  if (ergo.includes('pivot')) ergoScore += 15
  if (ergo.includes('swivel')) ergoScore += 12
  if (ergo.includes('tilt')) ergoScore += 8
  if (ergo.includes('vesa')) ergoScore += 12

  const conn = s.connectivity.toLowerCase()
  let connScore = 25
  if (conn.includes('thunderbolt')) connScore += 25
  if (conn.includes('usb-c') || conn.includes('usb c')) connScore += 18
  if (conn.includes('displayport 2.1')) connScore += 15
  else if (conn.includes('displayport 1.4')) connScore += 8
  if (conn.includes('hdmi 2.1')) connScore += 8

  const sizeScore = sizeInches >= 27 && sizeInches <= 34 ? 12 : 6
  return Math.min(100, ergoScore * 0.45 + connScore * 0.40 + sizeScore)
}

function computeValue(s: MonitorSpecs, priceUsd: number | null, gamingScore: number, visualScore: number): number {
  if (!priceUsd) return 70
  const perfSum = (gamingScore + visualScore) / 2
  // Value = performance-to-price ratio, but weighted towards performance
  // High perf + high price = still good value (not penalized as much)
  const priceFactor = norm(priceUsd, 150, 1500, true)
  return Math.min(100, perfSum * 0.65 + priceFactor * 0.35)
}

function getVerdict(score: number): { verdict: string; color: string } {
  if (score >= 92) return { verdict: 'S+', color: '#FFD700' }
  if (score >= 85) return { verdict: 'S', color: '#00FF88' }
  if (score >= 75) return { verdict: 'A', color: '#00F0FF' }
  if (score >= 60) return { verdict: 'B', color: '#7B2FF7' }
  if (score >= 45) return { verdict: 'C', color: '#FF6B35' }
  return { verdict: 'D', color: '#FF006E' }
}

export function computeSeal(monitor: Monitor): SealScores {
  const s = monitor.specs
  const gaming = Math.round(computeGaming(s))
  const visual = Math.round(computeVisual(s))
  const build = Math.round(computeBuild(s, monitor.size_inches))
  const value = Math.round(computeValue(s, monitor.price_usd, gaming, visual))

  const overall = Math.round(gaming * 0.30 + visual * 0.35 + build * 0.15 + value * 0.20)
  const { verdict, color } = getVerdict(overall)

  return { gaming, visual, build, value, overall, verdict, verdictColor: color }
}

// Spec bars 0-10 scale
export interface SpecBarData {
  icon: string
  label: string
  value: number // 0-10
  color: string
}

function to10(val: number | null, min: number, max: number, invert = false): number {
  if (val === null || val === undefined) return 0
  const clamped = Math.max(min, Math.min(max, val))
  const n = ((clamped - min) / (max - min)) * 10
  return Math.round(invert ? 10 - n : n)
}

// Rating A-G baseado no score 0-10
export type EnergyGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

function toGrade(score: number): EnergyGrade {
  if (score >= 9) return 'A'
  if (score >= 8) return 'B'
  if (score >= 7) return 'C'
  if (score >= 5) return 'D'
  if (score >= 4) return 'E'
  if (score >= 2) return 'F'
  return 'G'
}

// Tiered scoring functions
function resScore(res: string): number {
  const w = parseInt(res.split('x')[0])
  if (w >= 5000) return 10; if (w >= 3840) return 9; if (w >= 3440) return 8
  if (w >= 2560) return 7; if (w >= 1920) return 5; return 3
}
function hzScore(hz: number): number {
  if (hz >= 480) return 10; if (hz >= 360) return 9; if (hz >= 240) return 8
  if (hz >= 165) return 7; if (hz >= 144) return 6; if (hz >= 120) return 5
  if (hz >= 75) return 3; return 2
}
function panelScore(p: string): number {
  const t = p.toLowerCase()
  if (t.includes('qd-oled')) return 10
  if (t.includes('oled') || t.includes('woled')) return 9
  if (t.includes('mini led')) return 8
  if (t.includes('ips black')) return 6
  if (t.includes('ips')) return 5; if (t.includes('va')) return 5; return 4
}
function responseScore(ms: number): number {
  if (ms <= 0.03) return 10; if (ms <= 0.5) return 9; if (ms <= 1) return 8
  if (ms <= 3) return 6; if (ms <= 5) return 5; return 3
}
function vrrScore(vrr: string): number {
  const v = vrr.toLowerCase()
  const has = (k: string) => v.includes(k)
  let s = 0
  if (has('freesync premium pro')) s += 5; else if (has('freesync premium')) s += 4; else if (has('freesync')) s += 3
  if (has('g-sync compatible')) s += 4; else if (has('g-sync')) s += 5
  if (has('adaptive')) s += 2
  return Math.min(10, s)
}
function ergoScore(e: string): number {
  const t = e.toLowerCase(); let s = 2
  if (t.includes('height')) s += 2; if (t.includes('pivot')) s += 2
  if (t.includes('swivel')) s += 2; if (t.includes('tilt')) s += 1; if (t.includes('vesa')) s += 1
  return Math.min(10, s)
}
function connScore(c: string): number {
  const t = c.toLowerCase(); let s = 2
  if (t.includes('thunderbolt')) s += 3
  if (t.includes('usb-c') || t.includes('usb c')) s += 2
  if (t.includes('displayport 2.1')) s += 2; else if (t.includes('displayport 1.4')) s += 1
  if (t.includes('hdmi 2.1')) s += 1
  return Math.min(10, s)
}

export interface SpecIndex {
  icon: string
  label: string
  score: number    // 0-10
  grade: EnergyGrade
  detail: string   // valor real
}

export function getSpecIndices(m: Monitor): SpecIndex[] {
  const s = m.specs
  const indices: SpecIndex[] = [
    { icon: '🖥️', label: 'Resolução', score: resScore(s.resolution), detail: s.resolution_name },
    { icon: '⚡', label: 'Taxa Hz', score: hzScore(s.refresh_rate_hz), detail: `${s.refresh_rate_hz}Hz` },
    { icon: '🎨', label: 'Painel', score: panelScore(s.panel_type), detail: s.panel_type },
    { icon: '💡', label: 'Brilho HDR', score: to10(s.hdr_peak_brightness_nits, 200, 1500), detail: s.hdr_peak_brightness_nits ? `${s.hdr_peak_brightness_nits} nits` : '—' },
    { icon: '☀️', label: 'Brilho SDR', score: to10(s.sdr_brightness_nits, 150, 700), detail: s.sdr_brightness_nits ? `${s.sdr_brightness_nits} nits` : '—' },
    { icon: '🌈', label: 'DCI-P3', score: to10(s.dci_p3_coverage_pct, 70, 103), detail: s.dci_p3_coverage_pct ? `${s.dci_p3_coverage_pct}%` : '—' },
    { icon: '🔴', label: 'sRGB', score: to10(s.srgb_coverage_pct, 80, 145), detail: s.srgb_coverage_pct ? `${s.srgb_coverage_pct}%` : '—' },
    { icon: '🎯', label: 'Precisão Cor', score: s.color_accuracy_delta_e !== null ? to10(s.color_accuracy_delta_e, 0.3, 5, true) : 5, detail: s.color_accuracy_delta_e ? `ΔE ${s.color_accuracy_delta_e}` : '—' },
    { icon: '⏱️', label: 'Resposta', score: responseScore(s.response_time_gtg_ms), detail: `${s.response_time_gtg_ms}ms` },
    { icon: '🕹️', label: 'Input Lag', score: s.input_lag_ms !== null ? to10(s.input_lag_ms, 0.1, 20, true) : 5, detail: s.input_lag_ms ? `${s.input_lag_ms}ms` : '—' },
    { icon: '🔲', label: 'Prof. Cor', score: s.color_depth_bit >= 10 ? 9 : s.color_depth_bit >= 8 ? 5 : 3, detail: `${s.color_depth_bit}-bit` },
    { icon: '🌑', label: 'Contraste', score: s.native_contrast_ratio.includes('1500000') || s.native_contrast_ratio.includes('Infinite') ? 10 : s.native_contrast_ratio.includes('1000000') ? 9 : parseInt(s.native_contrast_ratio) >= 3000 ? 7 : parseInt(s.native_contrast_ratio) >= 1000 ? 5 : 4, detail: s.native_contrast_ratio },
    { icon: '👁️', label: 'Âng. Visão', score: s.viewing_angle_degrees >= 178 ? 9 : s.viewing_angle_degrees >= 170 ? 7 : 5, detail: `${s.viewing_angle_degrees}°` },
    { icon: '🔄', label: 'VRR', score: vrrScore(s.vrr), detail: s.vrr === 'None' ? '—' : s.vrr.split(',')[0] },
    { icon: '🔌', label: 'Conexões', score: connScore(s.connectivity), detail: s.connectivity.split(',')[0] },
    { icon: '🏗️', label: 'Ergonomia', score: ergoScore(s.ergonomics), detail: s.ergonomics.split(',').length + ' ajustes' },
    { icon: '🪞', label: 'Revestimento', score: s.reflection_coating.toLowerCase().includes('glossy') ? 6 : s.reflection_coating.toLowerCase().includes('anti-reflection') ? 9 : s.reflection_coating.toLowerCase().includes('anti-glare') ? 7 : 5, detail: s.reflection_coating },
    { icon: '📺', label: 'Padrão HDR', score: s.hdr_support.includes('True Black') ? 10 : s.hdr_support.includes('1000') ? 9 : s.hdr_support.includes('600') ? 7 : s.hdr_support.includes('400') ? 6 : 4, detail: s.hdr_support.split(',')[0] },
  ]
  return indices.map(idx => ({ ...idx, grade: toGrade(idx.score) }))
}

// Radar chart data helper
export interface RadarPoint {
  label: string
  value: number
  max: number
}

export function getRadarData(scores: SealScores): RadarPoint[] {
  return [
    { label: 'Jogos', value: scores.gaming, max: 100 },
    { label: 'Visual', value: scores.visual, max: 100 },
    { label: 'Const.', value: scores.build, max: 100 },
    { label: 'Valor', value: scores.value, max: 100 },
  ]
}
