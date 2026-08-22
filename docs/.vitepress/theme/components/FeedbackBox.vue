<script setup lang="ts">
// 问卷链接就绪后替换为腾讯问卷地址
const feedbackUrl = 'https://github.com/SCMU-Wiki/cs-wiki/issues'
</script>

<template>
  <div class="vp-doc feedback-box">
    <h2 id="意见反馈">意见反馈</h2>
    <div class="feedback-body">
      <span>这个页面有什么问题？或者有什么建议？</span>
      <a :href="feedbackUrl" target="_blank" rel="noopener">
        请点击此处反馈，我们会尽快回复和处理。
      </a>
    </div>
  </div>
</template>

<style scoped>
.feedback-box {
  margin-top: 32px;
}

.feedback-body {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  align-items: baseline;
  padding: 14px 18px;
  border-radius: 12px;
  background: rgba(0, 114, 72, 0.045);
  border: 1px solid rgba(0, 114, 72, 0.12);
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.feedback-body a {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
