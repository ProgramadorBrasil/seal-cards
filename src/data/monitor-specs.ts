export interface MonitorSpecs {
  resolution: string
  resolution_name: string
  refresh_rate_hz: number
  panel_type: string
  response_time_gtg_ms: number
  input_lag_ms: number | null
  native_contrast_ratio: string
  sdr_brightness_nits: number | null
  hdr_peak_brightness_nits: number | null
  srgb_coverage_pct: number | null
  dci_p3_coverage_pct: number | null
  color_accuracy_delta_e: number | null
  hdr_support: string
  vrr: string
  viewing_angle_degrees: number
  reflection_coating: string
  ergonomics: string
  color_depth_bit: number
  connectivity: string
  mini_led_zones?: number
  curvature?: string
  aspect_ratio?: string
  adobe_rgb_coverage_pct?: number
}

export interface Monitor {
  id: number
  name: string
  brand: string
  rtings_categories: string[]
  rtings_pick_rank: number | null
  price_usd: number | null
  size_inches: number
  specs: MonitorSpecs
  // Extended fields (added at runtime)
  asin?: string
  ean?: string
  image_url?: string
  affiliate_url?: string
  price_original?: number
  discount_pct?: number
}

export interface MonitorData {
  _metadata: {
    source: string
    collected_date: string
    total_monitors: number
    categories: string[]
  }
  monitors: Monitor[]
}

// Import the RTINGS data
import rawData from './rtings_monitors_2026.json'
export const monitorData = rawData as MonitorData

// ASIN map for affiliate links (Amazon US) — todos os 25 monitores
const asinMap: Record<number, string> = {
  1: 'B0DM6SHQTN',   // ASUS ROG Swift OLED PG27UCDM
  2: 'B0F23LR6JQ',   // ASUS ProArt PA32QCV
  3: 'B0C8ZJKPWC',   // AOC Q27G3XMN
  4: 'B0G5R2QK24',   // LG 27GX790B-B
  5: 'B0F732KMQQ',   // ASUS ROG Strix XG32UCWMG
  6: 'B0F6724X5N',   // Dell Alienware AW3425DW
  7: 'B0C8ZNPRWW',   // Acer Nitro XV275K
  8: 'B0D2LXLN75',   // BenQ MOBIUZ EX321UX
  9: 'B0D1DPFZLZ',   // Samsung Odyssey OLED G6
  10: 'B0F2VTSSRY',  // Dell Alienware AW3225QF
  11: 'B0CTS1RQ6Y',  // MSI MPG 271QRX
  12: 'B0G631LBJT',  // Gigabyte MO27Q28G
  13: 'B0CZSGWLD5',  // Dell Alienware AW2725DF
  14: 'B0FB46P6F6',  // Dell S3225QC
  15: 'B0FM7X82CM',  // Dell U2725QE
  16: 'B0D1TX35MQ',  // Dell U4025QW
  17: 'B0CV26XVMD',  // ASUS ROG Swift OLED PG32UCDM
  18: 'B0D7NSZRJW',  // ASUS ROG Strix XG27ACDNG
  19: 'B0CZWM44QP',  // ASUS ROG Strix XG27AQDMG
  20: 'B0FNKZWW5H',  // AOC Q27G40XMN
  21: 'B0CV24GQ9W',  // ASUS ROG Strix XG27ACS
  22: 'B0DBYPQY8F',  // Xiaomi G Pro 27i
  23: 'B0DMPTN8DG',  // LG 27GX790A-B
  24: 'B0CTSC3VS4',  // MSI MPG 321URX
  25: 'B0CSGWXVBN',  // LG 27GS95QE-B
}

// EAN/GTIN-13 map
const eanMap: Record<number, string> = {
  1: '4711387815236',
  2: '4711387860076',
  3: '0685417733583',
  4: '8806096678008',
  5: '0199291007208',
  7: '0195133278690',
  8: '0840046050160',
  9: '8887276832579',
  10: '0884116467175',
  11: '0824142343685',
  13: '0884116463283',
  15: '5397184923405',
  16: '5397184821510',
  17: '0197105413726',
  18: '0197105675230',
  19: '0197105559653',
  20: '0685417739684',
  21: '0197105406070',
  23: '0195174108277',
  24: '0824142343623',
  25: '0195174073391',
}

// Image URLs (Amazon CDN m.media-amazon.com + fallbacks)
const imageMap: Record<number, string> = {
  1: 'https://m.media-amazon.com/images/P/B0DM6SHQTN.01._SCLZZZZZZZ_SX500_.jpg',
  2: 'https://m.media-amazon.com/images/P/B0F23LR6JQ.01._SCLZZZZZZZ_SX500_.jpg',
  3: 'https://m.media-amazon.com/images/P/B0C8ZJKPWC.01._SCLZZZZZZZ_SX500_.jpg',
  4: 'https://m.media-amazon.com/images/P/B0G5R2QK24.01._SCLZZZZZZZ_SX500_.jpg',
  5: 'https://m.media-amazon.com/images/P/B0F732KMQQ.01._SCLZZZZZZZ_SX500_.jpg',
  6: 'https://m.media-amazon.com/images/P/B0F6724X5N.01._SCLZZZZZZZ_SX500_.jpg',
  7: 'https://c1.neweggimages.com/ProductImage/24-011-480-04.png',
  8: 'https://m.media-amazon.com/images/P/B0D2LXLN75.01._SCLZZZZZZZ_SX500_.jpg',
  9: 'https://m.media-amazon.com/images/P/B0D1DPFZLZ.01._SCLZZZZZZZ_SX500_.jpg',
  10: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/aw-series/aw3225qf/media-gallery/monitor-alienware-aw3225qf-white-gallery-1.psd?fmt=jpg&wid=500',
  11: 'https://m.media-amazon.com/images/P/B0CTS1RQ6Y.01._SCLZZZZZZZ_SX500_.jpg',
  12: 'https://m.media-amazon.com/images/P/B0G631LBJT.01._SCLZZZZZZZ_SX500_.jpg',
  13: 'https://m.media-amazon.com/images/P/B0CZSGWLD5.01._SCLZZZZZZZ_SX500_.jpg',
  14: 'https://m.media-amazon.com/images/P/B0FB46P6F6.01._SCLZZZZZZZ_SX500_.jpg',
  15: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u2725qe/pdp/monitor-u2725qe-hero-image.psd?fmt=jpg&wid=500',
  16: 'https://m.media-amazon.com/images/P/B0D1TX35MQ.01._SCLZZZZZZZ_SX500_.jpg',
  17: 'https://m.media-amazon.com/images/P/B0CV26XVMD.01._SCLZZZZZZZ_SX500_.jpg',
  18: 'https://m.media-amazon.com/images/P/B0D7NSZRJW.01._SCLZZZZZZZ_SX500_.jpg',
  19: 'https://m.media-amazon.com/images/P/B0CZWM44QP.01._SCLZZZZZZZ_SX500_.jpg',
  20: 'https://cdn.sanity.io/images/hf5b3axp/production/aa6a0cd061a4b1766a5fa732185d01ba0f6cf2b9-3000x2209.png?w=500&fit=max&auto=format',
  21: 'https://m.media-amazon.com/images/P/B0CV24GQ9W.01._SCLZZZZZZZ_SX500_.jpg',
  22: 'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-mini-led-gaming-monitor-g-pro-27i/pc/c3db76adb923d300eeac0c63407c3a1a.png',
  23: 'https://m.media-amazon.com/images/P/B0DMPTN8DG.01._SCLZZZZZZZ_SX500_.jpg',
  24: 'https://m.media-amazon.com/images/P/B0CTSC3VS4.01._SCLZZZZZZZ_SX500_.jpg',
  25: 'https://m.media-amazon.com/images/P/B0CSGWXVBN.01._SCLZZZZZZZ_SX500_.jpg',
}

const AFFILIATE_TAG = 'fabia-20'

function getAffiliateUrl(asin: string): string {
  // Amazon add-to-cart direct link
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}&linkCode=ogi&th=1`
}

// Enrich monitors with affiliate data
export const monitors: Monitor[] = monitorData.monitors.map((m) => {
  const asin = asinMap[m.id]
  return {
    ...m,
    asin: asin || undefined,
    ean: eanMap[m.id] || undefined,
    image_url: imageMap[m.id] || undefined,
    affiliate_url: asin ? getAffiliateUrl(asin) : undefined,
  }
})

// Category labels for display
export const categoryLabels: Record<string, string> = {
  best_overall: 'Melhor Geral',
  best_gaming: 'Melhor Gaming',
  best_oled: 'Melhor OLED',
  best_4k: 'Melhor 4K',
  best_4k_gaming: 'Melhor 4K Gaming',
  best_27_inch_gaming: 'Melhor 27"',
  best_office: 'Melhor Escritório',
  best_programming: 'Programação',
  best_budget: 'Melhor Custo-Benefício',
  best_budget_gaming: 'Gaming Econômico',
  best_high_refresh: 'Alta Taxa Hz',
  best_1440p_gaming: 'Melhor 1440p',
  best_32_inch: 'Melhor 32"',
  best_ultrawide: 'Melhor Ultrawide',
  best_under_500: 'Abaixo de $500',
  best_mini_led: 'Melhor Mini LED',
  best_samsung: 'Melhor Samsung',
  budget_oled: 'OLED Econômico',
}

// Panel type to rarity mapping
export type Rarity = 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common'

export function getPanelRarity(panelType: string): Rarity {
  const p = panelType.toLowerCase()
  if (p.includes('qd-oled')) return 'legendary'
  if (p.includes('oled') || p.includes('woled')) return 'epic'
  if (p.includes('mini led')) return 'rare'
  if (p.includes('ips black') || p.includes('va')) return 'uncommon'
  return 'common'
}

export const rarityConfig: Record<Rarity, {
  label: string
  gradient: string
  border: string
  glow: string
  particle: string
  bg: string
}> = {
  legendary: {
    label: 'LENDÁRIO',
    gradient: 'linear-gradient(135deg, #FFD700, #FF6B00, #FF006E, #7B2FF7, #00F0FF)',
    border: '#FFD700',
    glow: 'rgba(255, 215, 0, 0.4)',
    particle: '#FFD700',
    bg: 'rgba(255, 215, 0, 0.03)',
  },
  epic: {
    label: 'ÉPICO',
    gradient: 'linear-gradient(135deg, #7B2FF7, #FF006E, #00F0FF)',
    border: '#7B2FF7',
    glow: 'rgba(123, 47, 247, 0.4)',
    particle: '#7B2FF7',
    bg: 'rgba(123, 47, 247, 0.03)',
  },
  rare: {
    label: 'RARO',
    gradient: 'linear-gradient(135deg, #00F0FF, #0088FF)',
    border: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.3)',
    particle: '#00F0FF',
    bg: 'rgba(0, 240, 255, 0.03)',
  },
  uncommon: {
    label: 'INCOMUM',
    gradient: 'linear-gradient(135deg, #00FF88, #00C4FF)',
    border: '#00FF88',
    glow: 'rgba(0, 255, 136, 0.3)',
    particle: '#00FF88',
    bg: 'rgba(0, 255, 136, 0.03)',
  },
  common: {
    label: 'COMUM',
    gradient: 'linear-gradient(135deg, #888, #aaa)',
    border: '#666',
    glow: 'rgba(136, 136, 136, 0.2)',
    particle: '#888',
    bg: 'rgba(136, 136, 136, 0.02)',
  },
}
