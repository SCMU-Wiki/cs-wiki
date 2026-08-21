# SCMU CS Wiki

中南民族大学计算机学院（人工智能学院）新生指南，由学生自发维护的校园百科。

📖 在线访问：https://scmu-wiki.github.io/cs-wiki/

## 项目简介

基于学长的超详细新生攻略整理而成，涵盖**入学必看、生活指南、学业、学生组织**四大板块。目标是做成一份长期维护、不断生长的新生指南，让每一届新生少踩坑、不迷路。

## 技术栈

- [VitePress](https://vitepress.dev/)：Vue 驱动的静态站点生成器
- GitHub Pages：免费静态托管
- GitHub Actions：自动构建部署（push 即发布）

## 本地开发

```bash
npm install
npm run docs:dev     # 开发模式（localhost:5173，热更新）
npm run docs:build   # 构建静态站点
npm run docs:preview # 预览构建产物（localhost:4173）
```

## 贡献

内容由学生自发维护，欢迎提交 PR 或 issue 补充、纠错、更新。所有内容仅供参考，请以学校官方通知为准。

## 致谢

- 站点思路参考自 [SJTU Wiki](https://sjtu-geek.github.io/SJTU-Wiki/)，其主题包 [vitepress-theme-sjtu-wiki](https://github.com/SJTU-Geek/vitepress-theme-sjtu-wiki) 基于 MIT License 开源
- 基础内容整理自学长"牢大"的新生攻略
- 主题色取自中南民族大学校徽标准绿（#007248）

## 协议

内容采用 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans)（署名-非商业性使用）协议共享。
