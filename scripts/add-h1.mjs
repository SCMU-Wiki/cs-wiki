// 给所有 md 页面顶部加一级标题（H1 = frontmatter title），已有 H1 则替换
import fs from 'fs'
import path from 'path'

const root = 'docs'

function walk(dir) {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else if (e.name.endsWith('.md') && e.name !== 'index.md') out.push(p)
  }
  return out
}

let changed = 0
for (const f of walk(root)) {
  const c = fs.readFileSync(f, 'utf8')
  const m = c.match(/^title:\s*(.+?)\s*$/m)
  if (!m) continue
  const title = m[1]
  // frontmatter 块（--- 到第二个 --- 含换行）
  const fmMatch = c.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)
  if (!fmMatch) continue
  const rest = c.slice(fmMatch[0].length).replace(/^\s*\n/, '')
  const h1 = `# ${title}`
  let newContent
  if (/^#\s/m.test(rest)) {
    // 已有 H1：替换
    newContent = fmMatch[0] + rest.replace(/^#\s.*$/m, h1)
  } else {
    // 无 H1：frontmatter 后插入
    newContent = fmMatch[0] + h1 + '\n\n' + rest
  }
  if (newContent === c) continue
  fs.writeFileSync(f, newContent)
  changed++
  console.log(`updated: ${path.basename(f)} -> ${h1}`)
}
console.log('total:', changed)
