import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'

export default defineConfig({
  base: '/cs-wiki/',
  lang: 'zh-CN',
  title: 'SCMU CS Wiki',
  description: '中南民族大学计算机学院新生指南，学生自发维护的校园百科',
  cleanUrls: true,

  themeConfig: {
    // UI 文案中文化（Menu / Search / On this page / Return to top 等）
    outlineTitle: '本页目录',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容',
    docFooter: { prev: '上一页', next: '下一页' },

    nav: [
      { text: '首页', link: '/' },
      { text: '站点导航', link: '/navigation' },
      { text: '贡献指南', link: '/contributing' },
    ],

    sidebar,

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              closeText: '关闭',
              navigateText: '导航到结果',
            },
          },
        },
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/SCMU-Wiki/cs-wiki' },
    ],

    footer: {
      message: '由学生自发维护 · 内容仅供参考，请以学校官方通知为准',
      copyright: '基于 CC BY-NC 4.0 协议共享',
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },
  },
})
