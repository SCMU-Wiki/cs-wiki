# SCMU CS Wiki

中南民族大学计算机学院（人工智能学院）新生指南，由学生自发维护的校园百科。

📖 在线访问：<https://scmu-wiki.github.io/cs-wiki/>

## 项目简介

基于学长"牢大"的超详细新生攻略整理而成，涵盖**入学必看、生活指南、学业规划、学生组织**四大板块。目标是做成一份长期维护、不断生长的新生指南，让每一届新生少踩坑、不迷路，同时便于老生查询相关信息。

## 特性

- ✍️ **零门槛贡献**：写一个 Markdown 文件（`title` + `order`）放进对应目录，侧边栏自动识别，无需改任何配置（详见[贡献指南](docs/contributing.md)）
- 🔍 **中文搜索**：2-gram 分词，中文关键词精准检索
- 📜 **页面历史**：每个页面展示自己的 Git 变更记录
- 👤 **作者署名**：frontmatter 写 `author` 即显示，不写默认匿名
- 🌗 **主题切换**：浅色/深色模式 + 页面过渡动画
- 📱 **响应式**：手机、平板、桌面端一致体验

## 技术栈

- [VitePress](https://vitepress.dev/)：Vue 驱动的静态站点生成器
- [Nolebase 插件](https://github.com/nolebase)：页面历史、阅读增强、搜索高亮
- GitHub Pages：免费静态托管
- GitHub Actions：自动构建部署（push 即发布）
- KaTeX：高性能数学公式渲染库

## 目录结构

```
docs/
├── wiki/                  # 内容页（按板块分目录）
│   ├── admission/         # 入学必看
│   ├── living/            # 生活指南
│   ├── academic/          # 学业规划
│   └── organizations/     # 学生组织
├── public/images/         # 图片资源
└── .vitepress/            # 站点配置与主题
```

## 构建项目

### 环境要求

- Node.js ≥ 20（推荐 24）
- npm（随 Node 安装）

### 克隆代码

```bash
git clone https://github.com/SCMU-Wiki/cs-wiki.git
cd cs-wiki
```

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run docs:dev     # 开发模式（localhost:5173，热更新）
npm run docs:build   # 构建静态站点
npm run docs:preview # 预览构建产物（localhost:4173）
```

也可以直接双击 `start-dev.bat` / `start-preview.bat` 一键启动。

### 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages，无需手动操作。

## 参与建设

内容由学生自发维护，三种方式任选：

- 📝 **在线问卷**：零门槛反馈，不会用 GitHub 也能贡献（链接见[贡献指南](docs/contributing.md)）
- 🐛 **提 Issue**：纠错、时效信息更新提醒、功能建议
- 🔀 **提交 PR**：直接改内容（Fork → 写 Markdown → PR，详见[贡献指南](docs/contributing.md)）

所有内容仅供参考，**请以学校官方通知为准**。

## 致谢

- 站点思路参考自 [SJTU Wiki](https://sjtu-geek.github.io/SJTU-Wiki/)，其主题包 [vitepress-theme-sjtu-wiki](https://github.com/SJTU-Geek/vitepress-theme-sjtu-wiki) 基于 MIT License 开源，参考了部分内容架构
- 绝大部分基础内容整理自学长"牢大"的 `中南民族大学计算机学院新生攻略.docx`
- 主题色取自中南民族大学校徽标准绿（#007248）

## 协议

内容采用 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans)（署名-非商业性使用）协议共享。
