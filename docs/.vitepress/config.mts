import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/cs-wiki/',
  lang: 'zh-CN',
  title: 'SCMU CS Wiki',
  description: '中南民族大学计算机学院新生指南，学生自发维护的校园百科',
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '入学必看', link: '/guide/admission' },
      { text: '生活指南', link: '/guide/living' },
      { text: '学业', link: '/guide/academic' },
      { text: '学生组织', link: '/guide/organizations' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南总览',
          items: [
            { text: '欢迎', link: '/guide/welcome' },
            { text: '入学必看', link: '/guide/admission' },
            { text: '生活指南', link: '/guide/living' },
            { text: '学业', link: '/guide/academic' },
            { text: '学生组织', link: '/guide/organizations' },
          ],
        },
      ],
    },

    search: {
      provider: 'local',
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
