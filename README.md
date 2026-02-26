# 一键复制文档到微信公众号

这是一个 [Visual Studio Code](https://code.visualstudio.com/) 扩展，可将当前 Markdown 文档以微信公众号格式复制到剪贴板，方便直接在公众号后台粘贴，实现快速分享。

扩展支持 **Markdown 正文、本地图片与网络图片** 的完整复制，无需依赖第三方网站，也不需要配置公众号密钥、Token 等任何信息。只需在 VSCode 中执行一次命令，复制后粘贴即可完成发布流程。

## 使用演示

![使用演示](./docs/2025-12-24-14-17-44.gif)

## 功能特性

- 支持通过 **命令面板（Ctrl + Shift + P）** 运行 `Copy As HTML for MP` 命令，也可绑定快捷键
- 支持：复制 **选中内容**，未选中内容时，复制 **整个文档**
- 自动将内容转换为 **微信公众号可直接粘贴的 HTML 格式**
- 媒体支持：支持本地图片和网络图片（本地图片自动转为 Base64 内嵌）
- 18 种内置样式：在 Webview 预览面板中实时切换样式主题（样式来源于 [花生公众号排版器](https://editor.huasheng.ai/)）
- Webview 实时预览：执行命令后会在侧边栏打开预览面板，可实时查看排版效果
- 一键复制：预览面板提供 **复制按钮**，点击即可复制格式化后的 HTML 内容到剪贴板
- 代码高亮：支持代码块语法高亮（基于 highlight.js），复制后在公众号中保持高亮效果
- 配置功能：可在设置中选择是否将 Markdown 文件名作为文章标题插入

## 使用说明

### 安装

#### 从 VSCode 扩展市场安装（推荐）

在 VSCode 扩展侧边栏搜索 `Copy to MP`，找到后点击安装即可。

#### 本地安装

1. 下载最新的 `.vsix` 文件
2. 打开 VSCode，进入扩展面板
3. 点击右上角 `...` → `从 VSIX 安装...`，选择下载的文件

发现问题可在 [Issues](../../issues) 中反馈。

### 使用方式

1. 在 VSCode 中打开一个 Markdown 文件
2. 按 `Ctrl + Shift + P` 打开命令面板
3. 输入并选择 `Copy As HTML for MP`
4. 侧边栏将打开预览面板，可在此切换样式主题
5. 点击预览面板中的 **复制（Copy）** 按钮
6. 前往微信公众号后台编辑器，粘贴即可

### 切换样式

在预览面板顶部的工具栏中选择不同的主题即可实时切换样式。

PS: 样式预览可以在[花生公众号排版器](https://editor.huasheng.ai/)查看。

### 配置项

在 VSCode 设置中搜索 `Copy to MP`，可配置以下选项：

| 配置项                     | 说明               |      默认值      |
| :------------------------- | :----------------- | :--------------: |
| `copyToMp.styleSheetStyle` | 选择应用的样式主题 | `wechat-default` |

## 开发

- 推荐 Node.js 版本：v20.11.1

```bash
# 安装依赖
npm install

# 编译
npm run compile

# 开发模式（监听文件变化自动编译）
npm run watch

# 打包为 VSIX 扩展安装包
npx @vscode/vsce package
```

在 VSCode 中按 `F5` 即可启动扩展开发宿主进行调试。

## 关于问题反馈与贡献

我们非常重视每一位用户的反馈，并欢迎社区的积极参与：

- 问题与建议：如果您在使用过程中发现了任何 Bug，或者有改进产品的想法，欢迎在 Issues 中留言。我会定期查看并处理。
- 代码贡献：如果您有时间并且有兴趣，我们也非常欢迎您通过提交 Pull Request (PR) 的方式直接贡献代码或修复问题。

感谢您帮助项目变得更好！

## 致谢

本项目参考并基于以下优秀开源项目，特此感谢：

- [花生编辑器](https://github.com/alchaincyf/huasheng_editor)
- [copy-as-html 插件](https://github.com/mvdkwast/obsidian-copy-as-html)
- [obsidian-copy-to-mp](https://github.com/Spute/obsidian-copy-to-mp)
