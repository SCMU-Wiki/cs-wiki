import type { DefaultTheme } from 'vitepress'

/**
 * 侧边栏配置（仿上交：按板块分组，每个主题独立页面）
 */
export const sidebar: DefaultTheme.Sidebar = {
  '/guide/': [
    {
      text: '指南总览',
      items: [{ text: '欢迎', link: '/guide/welcome' }],
    },
    {
      text: '入学必看',
      items: [
        { text: '入学准备', link: '/guide/admission/prepare' },
        { text: '军训', link: '/guide/admission/military' },
        { text: '如何来到学校', link: '/guide/admission/arrival' },
        { text: '谨防诈骗', link: '/guide/admission/anti-scam' },
        { text: '班委', link: '/guide/admission/class-committee' },
        { text: '其他事项', link: '/guide/admission/misc' },
      ],
    },
    {
      text: '生活指南',
      items: [
        { text: '校园设施', link: '/guide/living/facilities' },
        { text: '住宿', link: '/guide/living/dorm' },
        { text: '校园卡', link: '/guide/living/campus-card' },
        { text: '校内食堂', link: '/guide/living/canteens' },
        { text: '校外觅食', link: '/guide/living/food-around' },
        { text: '交通', link: '/guide/living/transport' },
        { text: '校园活动', link: '/guide/living/activities' },
      ],
    },
    {
      text: '学业',
      items: [
        { text: '绩点与综测', link: '/guide/academic/gpa' },
        { text: '选课', link: '/guide/academic/courses' },
        { text: '奖学金', link: '/guide/academic/scholarship' },
        { text: '其他学分', link: '/guide/academic/credits' },
        { text: '挂科与保研', link: '/guide/academic/fail-postgraduate' },
        { text: '体测', link: '/guide/academic/pe' },
        { text: '四六级及英语免修', link: '/guide/academic/cet' },
      ],
    },
    {
      text: '学生组织',
      items: [
        { text: '实验室', link: '/guide/organizations/labs' },
        { text: '学生会与团委', link: '/guide/organizations/student-union' },
        { text: '青年志愿者协会', link: '/guide/organizations/volunteers' },
        { text: '其他组织与社团', link: '/guide/organizations/clubs' },
      ],
    },
  ],
}
