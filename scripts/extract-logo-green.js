// 分析图片主绿色 + 抠黑底生成透明 logo
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const src = process.argv[2]
const outDir = path.join(import.meta.dirname, '..', 'docs', 'public', 'images')

const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info
console.log(`size: ${width}x${height}, channels: ${channels}`)

// 颜色分桶统计（找主绿色）
const buckets = new Map()
let greenCount = 0
const rgb = Buffer.alloc(4 * width * height)

for (let i = 0; i < width * height; i++) {
  const o = i * channels
  const r = data[o], g = data[o + 1], b = data[o + 2]
  const maxc = Math.max(r, g, b)
  // 近黑 → 透明（黑底）
  if (maxc < 60) {
    rgb[i * 4] = 0; rgb[i * 4 + 1] = 0; rgb[i * 4 + 2] = 0; rgb[i * 4 + 3] = 0
    continue
  }
  // 保留（绿 + 白字 SCMU + 边缘过渡）
  rgb[i * 4] = r; rgb[i * 4 + 1] = g; rgb[i * 4 + 2] = b; rgb[i * 4 + 3] = 255
  // 绿色系像素统计（g 相对高）
  if (g > r * 0.75 && g > b * 0.75) {
    const key = `${Math.round(r / 16)},${Math.round(g / 16)},${Math.round(b / 16)}`
    buckets.set(key, (buckets.get(key) || 0) + 1)
    greenCount++
  }
}

// 主绿色（像素最多的桶）
let best = null, bestKey = ''
for (const [k, v] of buckets) {
  if (!best || v > best) { best = v; bestKey = k }
}
if (bestKey) {
  const [br, bg, bb] = bestKey.split(',').map((x) => parseInt(x) * 16 + 8)
  console.log(`绿色像素: ${greenCount} (${((greenCount / (width * height)) * 100).toFixed(0)}%)`)
  console.log(`主绿 RGB: (${br}, ${bg}, ${bb})  HEX: #${br.toString(16).padStart(2, '0')}${bg.toString(16).padStart(2, '0')}${bb.toString(16).padStart(2, '0')}`)
}

// 输出透明 PNG
const out = path.join(outDir, 'logo-new.png')
await sharp(rgb, { raw: { width, height, channels: 4 } }).png().toFile(out)
console.log(`saved: ${out} (${(fs.statSync(out).size / 1024).toFixed(0)}KB)`)
