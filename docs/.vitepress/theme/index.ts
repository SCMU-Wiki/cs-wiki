import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { NolebaseEnhancedReadabilitiesPlugin } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'
import Bridge from './bridge'
import { setupThemeTransition } from './themeTransition'
import './styles/index.css'

export default {
  extends: DefaultTheme,
  Layout: Bridge,
  enhanceApp({ app }) {
    // 阅读增强插件（含聚光灯）：注册为 Vue 插件，聚光灯默认开启
    app.use(NolebaseEnhancedReadabilitiesPlugin, {
      spotlight: {
        defaultToggle: true,
      },
    })
    if (typeof window !== 'undefined') {
      window.addEventListener('load', setupThemeTransition)
    }
  },
} satisfies Theme
