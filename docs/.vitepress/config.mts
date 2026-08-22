import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'
import { GitChangelog } from '@nolebase/vitepress-plugin-git-changelog/vite'

export default defineConfig({
  base: '/cs-wiki/',
  lang: 'zh-CN',
  title: 'SCMU CS Wiki',
  description: '中南民族大学计算机学院新生指南，学生自发维护的校园百科',
  cleanUrls: true,

  markdown: {
    image: {
      // 图片懒加载：滚动到才加载，首屏秒开（上交页面无图所以快，我们靠这个追平）
      lazyLoading: true,
    },
  },

  head: [
    // 注意：head 里的路径不会自动加 base，这里写死 /cs-wiki/ 前缀
    ['link', { rel: 'icon', type: 'image/png', href: '/cs-wiki/images/favicon.png' }],
  ],

  vite: {
    ssr: {
      // 阅读增强插件含 .vue 组件，需打包处理（否则 SSR 阶段报未知扩展名）
      noExternal: ['@nolebase/vitepress-plugin-enhanced-readabilities'],
    },
    plugins: [
      GitChangelog({
        locale: 'zh-CN',
        repoURL: 'https://github.com/SCMU-Wiki/cs-wiki',
        rewritePathsBy: {
          handler: (_commit, path) => {
            if (!path) return path
            // 内容拆分前的旧文件：板块内页面追溯到旧文件，显示从 init 到拆分的完整历史
            const legacyMap: [string, string][] = [
              ['docs/guide/admission/', 'docs/guide/admission.md'],
              ['docs/guide/living/', 'docs/guide/living.md'],
              ['docs/guide/academic/', 'docs/guide/academic.md'],
              ['docs/guide/organizations/', 'docs/guide/organizations.md'],
            ]
            for (const [prefix, legacy] of legacyMap) {
              if (path.startsWith(prefix)) return legacy
            }
            return path
          },
        },
      }),
    ],
  },

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

    // 页面历史：跳转到 GitHub 编辑/查看该页（含完整修改记录）
    editLink: {
      pattern: 'https://github.com/SCMU-Wiki/cs-wiki/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

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
