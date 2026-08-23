import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'
import { GitChangelog } from '@nolebase/vitepress-plugin-git-changelog/vite'

export default defineConfig({
  base: '/cs-wiki/',
  lang: 'zh-CN',
  title: 'SCMU CS Wiki',
  description: '中南民族大学计算机学院指南，学生自发维护的校园百科',
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
    // SEO / 分享预览（QQ、微信、Twitter 等平台抓取 og 标签生成卡片）
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'SCMU CS Wiki' }],
    ['meta', { property: 'og:title', content: 'SCMU CS Wiki - 中南民族大学计算机学院新生指南' }],
    ['meta', { property: 'og:description', content: '学生自发维护的校园百科，涵盖入学必看、生活指南、学业规划、学生组织四大板块。' }],
    ['meta', { property: 'og:url', content: 'https://scmu-wiki.github.io/cs-wiki/' }],
    ['meta', { property: 'og:image', content: 'https://scmu-wiki.github.io/cs-wiki/images/logo-v2.webp' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],

  vite: {
    ssr: {
      // Nolebase 系插件含 .vue 组件，需打包处理（否则 SSR 阶段报未知扩展名）
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-highlight-targeted-heading',
      ],
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
              // 目录从 docs/guide/ 改为 docs/wiki/：匹配新路径，回溯到历史旧路径
              ['docs/wiki/admission/', 'docs/guide/admission.md'],
              ['docs/wiki/living/', 'docs/guide/living.md'],
              ['docs/wiki/academic/', 'docs/guide/academic.md'],
              ['docs/wiki/organizations/', 'docs/guide/organizations.md'],
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
    // 导航栏左上角 logo（仿上交：小 logo + 站名）
    logo: '/images/logo-v2.webp',
    // UI 文案中文化（Menu / Search / On this page / Return to top 等）
    outlineTitle: '本页大纲',
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
        // 中文分词优化：minisearch 默认不拆中文，配置 2-gram 让中文关键词可检索
        miniSearch: {
          options: {
            tokenize: (text: string) => {
              const english = text.match(/[a-zA-Z0-9]+/g) || []
              const chinese = text.match(/[\u4e00-\u9fa5]+/g) || []
              const tokens: string[] = [...english]
              for (const seg of chinese) {
                if (seg.length === 1) {
                  tokens.push(seg)
                  continue
                }
                // 2-gram：相邻两字一组（“绩点”→[绩点]，中文搜索更准）
                for (let i = 0; i < seg.length - 1; i++) {
                  tokens.push(seg.slice(i, i + 2))
                }
              }
              return tokens
            },
          },
        },
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
