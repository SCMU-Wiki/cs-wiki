/**
 * 主题切换动画模块
 * - 支持 View Transitions：圆形扩散
 * - 不支持：遮罩淡入淡出（降级）
 */

export const APPEARANCE_KEY = 'vitepress-theme-appearance'

declare global {
  interface Window {
    __vpIsDark?: import('vue').Ref<boolean>
  }
}

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

  requestAnimationFrame(() => {
    overlay.style.opacity = '1'
  })

  setTimeout(() => {
    root.classList.toggle('dark')
    const isDark = root.classList.contains('dark')
    localStorage.setItem(APPEARANCE_KEY, isDark ? 'dark' : '')
    if (window.__vpIsDark) window.__vpIsDark.value = isDark
  }, duration / 2)

  setTimeout(() => {
    overlay.style.opacity = '0'
  }, duration)
  setTimeout(() => overlay.remove(), duration + 250)
}

/**
 * 主题切换圆形扩散动画
 * 拦截切换按钮点击，用 View Transitions API 包裹切换，
 * 给 ::view-transition-new(root) 注入 clip-path 圆形扩散。
 * 不支持 View Transitions 时降级为遮罩淡入淡出。
 */
export function setupThemeTransition(): void {
  document.addEventListener(
    'click',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const btn = target.closest('.VPSwitchAppearance')
      if (!btn) return

      // 以按钮中心为扩散圆心（移动端合成点击坐标可能偏移，按钮中心最稳）
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

      const isMobile = window.matchMedia('(max-width: 960px)').matches
      const duration = isMobile ? 300 : 450

      e.preventDefault()
      e.stopPropagation()

      const transition = document.startViewTransition(() => {
        root.classList.toggle('dark')
        const isDarkNow = root.classList.contains('dark')
        localStorage.setItem(APPEARANCE_KEY, isDarkNow ? 'dark' : '')
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
