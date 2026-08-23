// 按当前 sidebar 顺序给所有页面 frontmatter 加 order 字段（全局编号）
import fs from 'fs'
import path from 'path'

// 文件相对路径 -> order（按 sidebar 展示顺序）
const orderMap = {
  'guide/welcome.md': 1,
  'navigation.md': 2,
  'guide/admission/index.md': 3,
  'guide/admission/prepare.md': 4,
  'guide/admission/military.md': 5,
  'guide/admission/arrival.md': 6,
  'guide/admission/anti-scam.md': 7,
  'guide/admission/class-committee.md': 8,
  'guide/admission/misc.md': 9,
  'guide/living/index.md': 10,
  'guide/living/facilities.md': 11,
  'guide/living/dorm.md': 12,
  'guide/living/campus-card.md': 13,
  'guide/living/canteens.md': 14,
  'guide/living/food-around.md': 15,
  'guide/living/transport.md': 16,
  'guide/living/activities.md': 17,
  'guide/academic/index.md': 18,
  'guide/academic/gpa.md': 19,
  'guide/academic/courses.md': 20,
  'guide/academic/scholarship.md': 21,
  'guide/academic/credits.md': 22,
  'guide/academic/fail-postgraduate.md': 23,
  'guide/academic/pe.md': 24,
  'guide/academic/cet.md': 25,
  'guide/organizations/index.md': 26,
  'guide/organizations/labs.md': 27,
  'guide/organizations/student-union.md': 28,
  'guide/organizations/volunteers.md': 29,
  'guide/organizations/clubs.md': 30,
  'contributing.md': 31,
}

let changed = 0
for (const [rel, order] of Object.entries(orderMap)) {
  const f = path.join('docs', rel)
  if (!fs.existsSync(f)) {
    console.log(`skip (not found): ${rel}`)
    continue
  }
  const c = fs.readFileSync(f, 'utf8')
  if (c.includes('\norder:')) {
    console.log(`skip (has order): ${rel}`)
    continue
  }
  // 在 frontmatter 的 title 行后插入 order 行
  const newContent = c.replace(/^(---\r?\n)(title:.*\r?\n)/, (m, fm, title) => `${fm}${title}order: ${order}\n`)
  if (newContent !== c) {
    fs.writeFileSync(f, newContent)
    changed++
    console.log(`order ${order}: ${rel}`)
  } else {
    console.log(`FAIL: ${rel}`)
  }
}
console.log(`total: ${changed}`)
