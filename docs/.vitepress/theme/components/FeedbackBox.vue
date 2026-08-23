<script setup lang="ts">
import { withBase } from 'vitepress'
// 问卷链接就绪后替换为腾讯问卷地址
const feedbackUrl = 'https://github.com/SCMU-Wiki/cs-wiki/issues'
</script>

<template>
  <div class="vp-doc feedback-box">
    <h2 id="意见反馈">意见反馈</h2>
    <div class="feedback-body">
      <img :src="withBase('/images/logo-v2.webp')" alt="SCMU CS Wiki" class="feedback-logo" />
      <span class="feedback-text">
        <span>这个页面有什么问题？或者有什么建议？</span>
        <a :href="feedbackUrl" target="_blank" rel="noopener">
          请点击此处反馈，我们会尽快回复和处理。
        </a>
      </span>
    </div>
  </div>
</template>

<style scoped>
.feedback-box {
  margin-top: 32px;
}

.feedback-logo {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.feedback-text {
  min-width: 0;
  line-height: 1.6;
}

.feedback-body {
  display: flex;
  /* 手机端与电脑端一致：logo 左侧上下居中，文字在右（不换行） */
  flex-wrap: nowrap;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 12px;
  background: rgba(0, 114, 72, 0.09);
  border: 1px solid rgba(0, 114, 72, 0.18);
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
