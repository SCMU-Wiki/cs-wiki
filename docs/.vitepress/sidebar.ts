import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { DefaultTheme } from 'vitepress'

/**
 * 侧边栏自动生成（对齐上交：扫描目录 + frontmatter 的 title/order）
 * - 每个板块目录（admission/living/academic/organizations）的 index.md 作为分组标题
 * - 子页面按 frontmatter order 排序（无 order 排最后）
 * - 贡献者只需写 Markdown + title/order，无需改配置
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const guideDir = path.join(__dirname, '../guide')

interface PageMeta {
  title?: string
  order?: number
}

/** 解析文件开头的 frontmatter（仅取 title / order） */
function parseFrontmatter(filePath: string): PageMeta {
  const content = fs.readFileSync(filePath, 'utf8')
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  const fm = m[1]
  const title = fm.match(/^title:\s*(.+?)\s*$/m)?.[1]?.trim()
  const order = fm.match(/^order:\s*(\d+)\s*$/m)?.[1]
  return { title, order: order ? parseInt(order, 10) : undefined }
}

/** 扫描一个板块目录，生成侧边栏分组（无 index.md 则跳过） */
function buildGroup(dirName: string): DefaultTheme.SidebarItem | null {
  const dir = path.join(guideDir, dirName)
  const indexFile = path.join(dir, 'index.md')
  if (!fs.existsSync(indexFile)) return null

  const indexFm = parseFrontmatter(indexFile)
  if (!indexFm.title) return null

  const pages: { text: string; link: string; order?: number }[] = []
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md') || f === 'index.md') continue
    const fm = parseFrontmatter(path.join(dir, f))
    if (!fm.title) continue
    pages.push({
      text: fm.title,
      link: `/guide/${dirName}/${f.replace(/\.md$/, '')}`,
      order: fm.order,
    })
  }

  // 按 order 升序，无 order 的排最后（保持稳定顺序）
  pages.sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))

  return {
    text: indexFm.title,
    link: `/guide/${dirName}/`,
    collapsed: false,
    items: pages.map(({ text, link }) => ({ text, link })),
  }
}

/** 指南总览组（欢迎 + 站点导航）：两处位置特殊，保留手动定义 */
const overviewGroup: DefaultTheme.SidebarItem = {
  text: '指南总览',
  collapsed: false,
  items: [
    { text: '欢迎', link: '/guide/welcome' },
    { text: '站点导航', link: '/navigation' },
  ],
}

const guide: DefaultTheme.SidebarItem[] = [overviewGroup]

for (const dirName of ['admission', 'living', 'academic', 'organizations']) {
  const group = buildGroup(dirName)
  if (group) guide.push(group)
}

// '/guide/' 与 '/navigation' 共用同一份侧边栏（导航页左上角菜单可用）
export const sidebar: DefaultTheme.Sidebar = {
  '/guide/': guide,
  '/navigation': guide,
}
