/**
 * 桥组件：包装 VitePress 默认 Layout
 * 职责：
 * 1. 把 isDark ref 挂到全局（供主题切换动画同步）
 * 2. 首页 features 卡片点击跳转（VitePress 默认不支持链接）
 * 3. 注入页头信息条（PageInfo）和页尾（意见反馈 + 页面历史）
 */
import { defineComponent, h, nextTick, onMounted, watch, type Ref } from 'vue'
import { useData, withBase } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { NolebaseGitChangelog } from '@nolebase/vitepress-plugin-git-changelog/client'
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import { NolebaseHighlightTargetedHeading } from '@nolebase/vitepress-plugin-highlight-targeted-heading/client'
import PageInfo from './components/PageInfo.vue'
import FeedbackBox from './components/FeedbackBox.vue'

declare global {
  interface Window {
    __vpIsDark?: Ref<boolean>
  }
}

const Bridge = defineComponent({
  name: 'ThemeBridge',
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
          'doc-before': () =>
            h('div', null, [
              h(
                'div',
                { class: 'trial-notice' },
                '⚠️ SCMU CS Wiki 目前处于试运行阶段，内容可能不准确或存在错误，请仔细甄别。'
              ),
              h(PageInfo),
              h(NolebaseHighlightTargetedHeading),
            ]),
          'doc-after': () =>
            h('div', { class: 'vp-doc' }, [h(FeedbackBox), h(NolebaseGitChangelog)]),
          // 阅读增强（含聚光灯）：导航栏 + 移动端菜单
          'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu),
          'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu),
        },
      )
  },
})

export default Bridge
