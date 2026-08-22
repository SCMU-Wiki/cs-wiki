/**
 * 主题入口（装配层）
 * 只负责组合：桥组件 + 主题切换动画 + 样式
 */
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Bridge from './bridge'
import { setupThemeTransition } from './themeTransition'
import './styles/index.css'

export default {
  extends: DefaultTheme,
  Layout: Bridge,
  enhanceApp() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', setupThemeTransition)
    }
  },
} satisfies Theme
