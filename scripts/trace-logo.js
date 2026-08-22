// 将 logo.webp 矢量化输出 logo.svg
import sharp from 'sharp'
import ImageTracer from 'imagetracerjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imgDir = path.join(__dirname, '..', 'docs', 'public', 'images')
const logoPath = path.join(imgDir, 'logo.webp')
const outPath = path.join(imgDir, 'logo.svg')

const { data, info } = await sharp(logoPath).raw().toBuffer({ resolveWithObject: true })
const imgData = {
  width: info.width,
  height: info.height,
  data: new Uint8ClampedArray(data),
}

// 矢量化参数：控制路径数量与保真度（调大阈值让 SVG 更精简）
const svg = ImageTracer.imagedataToSVG(imgData, {
  numberofcolors: 4,
  ltres: 1.5,
  qtres: 1.5,
  pathomit: 10,
  blurradius: 1,
})

fs.writeFileSync(outPath, svg, 'utf-8')
console.log(`logo.svg: ${(fs.statSync(outPath).size / 1024).toFixed(1)}KB (${info.width}x${info.height})`)
