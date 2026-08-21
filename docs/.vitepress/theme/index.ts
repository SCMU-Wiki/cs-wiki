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
 * 不支持 View Transitions 时的兜底动画：遮罩圆形扩散。
 * 原理：创建一个目标主题色的圆形遮罩，从点击处扩散覆盖屏幕，
 * 中途切换主题，最后遮罩淡出露出新主题。
 */
function toggleThemeWithOverlay(x: number, y: number, r: number): void {
  const root = document.documentElement
  const isDarkNow = root.classList.contains('dark')
  const targetDark = !isDarkNow
  const overlayColor = targetDark ? '#1e1e20' : '#ffffff' // VitePress 深/浅背景色
  const duration = window.matchMedia('(max-width: 960px)').matches ? 260 : 360

  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 99999; pointer-events: none;
    background: ${overlayColor};
    clip-path: circle(0 at ${x}px ${y}px);
    transition: clip-path ${duration}ms ease-in-out;
  `
  document.body.appendChild(overlay)

  // 下一帧开始扩散
  requestAnimationFrame(() => {
    overlay.style.clipPath = `circle(${r}px at ${x}px ${y}px)`
  })

  // 扩散到一半时切换主题
  setTimeout(() => {
    root.classList.toggle('dark')
    const isDark = root.classList.contains('dark')
    localStorage.setItem(APPEARANCE_KEY, isDark ? 'dark' : '')
    if (window.__vpIsDark) window.__vpIsDark.value = isDark
  }, duration / 2)

  // 扩散完成后淡出遮罩
  setTimeout(() => {
    overlay.style.transition = 'opacity 180ms ease'
    overlay.style.opacity = '0'
  }, duration)
  setTimeout(() => overlay.remove(), duration + 200)
}

/**
 * 主题切换圆形扩散动画
 * 原理：拦截主题切换按钮点击，用 View Transitions API 包裹切换，
 * 给 ::view-transition-new(root) 注入 clip-path 圆形扩散动画。
 * 浏览器不支持 View Transitions 时自动降级为遮罩扩散动画。
 */
function setupThemeTransition(): void {
  document.addEventListener(
    'click',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const btn = target.closest('.VPSwitchAppearance')
      if (!btn) return

      // 从点击位置计算扩散半径（保证覆盖整个屏幕）
      const x = e.clientX
      const y = e.clientY
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

      if (typeof document.startViewTransition !== 'function') {
        e.preventDefault()
        e.stopPropagation()
        toggleThemeWithOverlay(x, y, r)
        return
      }

      const root = document.documentElement
      root.style.setProperty('--vt-x', `${x}px`)
      root.style.setProperty('--vt-y', `${y}px`)
      root.style.setProperty('--vt-r', `${r}px`)

      // 移动端（VitePress 窄屏断点 <960px）动画时长缩短，小屏更跟手
      const isMobile = window.matchMedia('(max-width: 960px)').matches
      const duration = isMobile ? 300 : 450

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
            duration,
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
