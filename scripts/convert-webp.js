// 批量转换站点图片为 WebP（保留 favicon.png）
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.join(__dirname, '..', 'docs', 'public', 'images')
const files = fs.readdirSync(dir)

for (const f of files) {
  if (f === 'favicon.png') continue
  const ext = path.extname(f).toLowerCase()
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue
  const base = path.basename(f, ext)
  const out = path.join(dir, base + '.webp')
  await sharp(path.join(dir, f))
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(out)
  console.log(`${f} -> ${base}.webp (${(fs.statSync(out).size / 1024).toFixed(0)}KB)`)
}
console.log('done')
