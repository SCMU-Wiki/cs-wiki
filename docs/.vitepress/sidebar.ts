import type { DefaultTheme } from 'vitepress'

/**
 * 侧边栏配置（独立文件，板块增多后便于维护）
 * 后续板块拆分多页时，在这里扩展子项即可
 */
export const sidebar: DefaultTheme.Sidebar = {
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
}
