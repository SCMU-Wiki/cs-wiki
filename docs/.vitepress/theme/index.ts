import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { defineComponent, h, type Ref } from 'vue'
import { useData } from 'vitepress'
import './custom.css'

const APPEARANCE_KEY = 'vitepress-theme-appearance'

declare global {
  interface Window {
    __vpIsDark?: Ref<boolean>
  }
}

/**
 * 桥组件：把 VitePress 内部的 isDark ref 挂到全局，
 * 让主题切换动画代码能同步 Vue 的响应式状态（图标、内部状态）。
 */
const Bridge = defineComponent({
  name: 'ThemeTransitionBridge',
  setup() {
    const { isDark } = useData()
    if (typeof window !== 'undefined') {
      window.__vpIsDark = isDark
    }
    return () => h(DefaultTheme.Layout)
  },
})

/**
 * 主题切换圆形扩散动画
 * 原理：拦截主题切换按钮点击，用 View Transitions API 包裹切换，
 * 给 ::view-transition-new(root) 注入 clip-path 圆形扩散动画。
 * 浏览器不支持 View Transitions 时自动降级为无动画直接切换。
 */
function setupThemeTransition(): void {
  document.addEventListener(
    'click',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const btn = target.closest('.VPSwitchAppearance')
      if (!btn) return
      if (typeof document.startViewTransition !== 'function') return

      // 从点击位置计算扩散半径（保证覆盖整个屏幕）
      const x = e.clientX
      const y = e.clientY
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

      const root = document.documentElement
      root.style.setProperty('--vt-x', `${x}px`)
      root.style.setProperty('--vt-y', `${y}px`)
      root.style.setProperty('--vt-r', `${r}px`)

      // 拦截 VitePress 默认切换，改为自己触发
      e.preventDefault()
      e.stopPropagation()

      const transition = document.startViewTransition(() => {
        // 同步切换 html class（CSS 主题立即生效，View Transition 能拍到变化）
        root.classList.toggle('dark')
        const isDarkNow = root.classList.contains('dark')
        // 同步 localStorage（与 VueUse useDark 的存储格式一致）
        localStorage.setItem(APPEARANCE_KEY, isDarkNow ? 'dark' : '')
        // 同步 Vue 响应式状态（驱动切换图标等）
        if (window.__vpIsDark) {
          window.__vpIsDark.value = isDarkNow
        }
      })

      transition.ready.then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0 at ${x}px ${y}px)`,
              `circle(${r}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 450,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
    },
    true,
  )
}

export default {
  extends: DefaultTheme,
  Layout: Bridge,
  enhanceApp() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', setupThemeTransition)
    }
  },
} satisfies Theme
