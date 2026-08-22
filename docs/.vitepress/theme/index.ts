import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { defineComponent, h, nextTick, onMounted, watch, type Ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { NolebaseGitChangelog } from '@nolebase/vitepress-plugin-git-changelog/client'
import PageInfo from './components/PageInfo.vue'
import FeedbackBox from './components/FeedbackBox.vue'
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
    const { isDark, frontmatter } = useData()
    if (typeof window !== 'undefined') {
      window.__vpIsDark = isDark
    }

    // 首页卡片点击跳转：VitePress features 默认不支持链接，用事件绑定实现
    const bindCardLinks = () => {
      const features = (frontmatter.value as { features?: { link?: string }[] } | undefined)
        ?.features
      if (!features?.length) return
      nextTick(() => {
        const items = document.querySelectorAll('.VPFeatures .item')
        items.forEach((item, i) => {
          const link = features[i]?.link
          if (!link) return
          const el = item as HTMLElement
          el.style.cursor = 'pointer'
          el.onclick = () => {
            // withBase 补上前缀（/cs-wiki/），否则部署在子路径下会 404
            window.location.href = withBase(link)
          }
        })
      })
    }
    watch(frontmatter, bindCardLinks)
    onMounted(bindCardLinks)

    return () =>
      h(
        DefaultTheme.Layout,
        null,
        {
          // 页头信息条（最后更新 / 字数 / 阅读时间）
          'doc-before': () => h(PageInfo),
          // 页尾：意见反馈 + 页面历史（上交同款结构，vp-doc 保证标题样式）
          'doc-after': () =>
            h('div', { class: 'vp-doc' }, [h(FeedbackBox), h(NolebaseGitChangelog)]),
        },
      )
  },
})

/**
 * 不支持 View Transitions 时的兜底动画：遮罩淡入淡出。
 * 不用 clip-path 扩散：老内核（QQ 内置浏览器等）特性检测不可靠，
 * 声称支持却渲染错位。统一降级为不依赖坐标的淡入淡出，永不错位。
 */
function toggleThemeWithOverlay(): void {
  const root = document.documentElement
  const isDarkNow = root.classList.contains('dark')
  const targetDark = !isDarkNow
  const overlayColor = targetDark ? '#1e1e20' : '#ffffff' // VitePress 深/浅背景色
  const duration = window.matchMedia('(max-width: 960px)').matches ? 260 : 360

  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: 99999; pointer-events: none;
    background: ${overlayColor};
    opacity: 0;
    transition: opacity ${Math.round(duration / 2)}ms ease;
  `
  document.body.appendChild(overlay)

  // 下一帧开始淡入（盖住屏幕）
  requestAnimationFrame(() => {
    overlay.style.opacity = '1'
  })

  // 遮罩盖满后切换主题
  setTimeout(() => {
    root.classList.toggle('dark')
    const isDark = root.classList.contains('dark')
    localStorage.setItem(APPEARANCE_KEY, isDark ? 'dark' : '')
    if (window.__vpIsDark) window.__vpIsDark.value = isDark
  }, duration / 2)

  // 切换完成后淡出遮罩
  setTimeout(() => {
    overlay.style.opacity = '0'
  }, duration)
  setTimeout(() => overlay.remove(), duration + 250)
}

/**
 * 主题切换圆形扩散动画
 * 原理：拦截主题切换按钮点击，用 View Transitions API 包裹切换，
 * 给 ::view-transition-new(root) 注入 clip-path 圆形扩散动画。
 * 浏览器不支持 View Transitions 时自动降级为遮罩淡入淡出。
 */
function setupThemeTransition(): void {
  document.addEventListener(
    'click',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const btn = target.closest('.VPSwitchAppearance')
      if (!btn) return

      // 以切换按钮中心为扩散圆心（移动端 WebView 合成点击坐标可能偏移，按钮中心最稳）
      const rect = btn.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

      if (typeof document.startViewTransition !== 'function') {
        e.preventDefault()
        e.stopPropagation()
        toggleThemeWithOverlay()
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
