<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, onMounted, ref } from 'vue'

const { page } = useData()

// 最后更新时间
const lastUpdated = computed(() => {
  const ts = page.value.lastUpdated
  if (!ts) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ts))
})

// 字数和阅读时间（读取页面渲染后的文本统计）
const wordCount = ref(0)
const readTime = ref('')

onMounted(() => {
  const doc = document.querySelector('.vp-doc')
  if (!doc) return
  const text = (doc.textContent || '').replace(/\s+/g, '')
  // 中文字符 + 英文单词混合估算
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const words = (text.match(/[a-zA-Z0-9]+/g) || []).length
  wordCount.value = chinese + words
  // 阅读速度按每分钟 400 字估算
  const minutes = Math.max(1, Math.round((chinese + words) / 400))
  readTime.value = `${minutes} 分钟`
})
</script>

<template>
  <div class="page-info">
    <span v-if="lastUpdated" class="pi-item">
      <span class="pi-icon">🕒</span> 最后更新：{{ lastUpdated }}
    </span>
    <span v-if="wordCount" class="pi-item">
      <span class="pi-icon">📝</span> 字数：{{ wordCount }}
    </span>
    <span v-if="readTime" class="pi-item">
      <span class="pi-icon">⏱️</span> 预计阅读时间：{{ readTime }}
    </span>
  </div>
</template>

<style scoped>
.page-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin: 8px 0 20px;
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
