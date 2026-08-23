<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()

// 作者：读取 frontmatter.author（昵称列表），未署名时兜底匿名
const author = computed(() => {
  const a = page.value.frontmatter.author
  if (!a) return '匿名'
  if (Array.isArray(a)) return a.join('、')
  return String(a)
})

// 最后更新时间（构建时静态数据，秒显）
const lastUpdated = computed(() => {
  const ts = page.value.lastUpdated
  if (!ts) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ts))
})
</script>

<template>
  <div class="page-info-wrap">
    <div class="page-info">
      <span class="pi-item">
        <span class="pi-icon">👤</span> 作者：{{ author }}
      </span>
      <span v-if="lastUpdated" class="pi-item">
        <span class="pi-icon">🕒</span> 最后更新：{{ lastUpdated }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.page-info-wrap {
  margin: 8px 0 20px;
}

.page-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  padding: 10px 16px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.pi-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pi-icon {
  font-size: 14px;
}
</style>
