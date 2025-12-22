<!-- # 参考结构

README.md 中描述的主要部分包括：

1. 封面与简介
   - 项目名、Logo、一句话介绍与定位（更优雅的 Markdown 公众号排版工具）
   - 官网/在线使用/文档/下载等快速链接
   - 许可证与技术栈徽章（React、Electron、pnpm 等）

2. 特性（✨ 特性）
   - 功能表格列举的若干功能项（Markdown 语法、主题切换、一键复制、多图床、本地优先、跨平台、深色模式预览、高级搜索、滑动图组 等）

3. 技术亮点（💡 技术亮点）
   - 重点介绍微信深色模式预览算法（基于 wechatjs/mp-darkmode 的迁移与优化）
   - 链接到算法原理解析与源码位置（packages/core/src/wechatDarkMode.ts）

4. 快速开始（🚀 快速开始）
   - 在线使用（edit.wemd.app）
   - 桌面版下载说明与平台安装包格式（macOS、Windows、Linux）
   - 平台注意事项（macOS、Windows、Linux 的启动/权限提示）

5. 本地开发（🛠️ 本地开发）
   - 环境要求（Node.js、pnpm）
   - 安装与运行命令（pnpm install、pnpm dev:web、pnpm dev:desktop 等）
   - 构建命令示例（构建 Web 与桌面应用的命令）

6. 项目结构（📁 项目结构）
   - 仓库目录树说明（apps、packages、templates、turbo.json 等）

7. 截图（📸 截图）
   - 提示有示例截图（.github/assets/screenshot.png）

8. 反馈（💬 反馈）
   - 提交 Issue 的链接

9. 致谢（🤝 致谢）
   - 对 wechatjs/mp-darkmode 的引用与感谢

10. 许可证（📄 License）
    - MIT 许可声明与版权（WeMD Team）

如果需要，我可以把这些部分以更结构化的形式（例如目录列表或提纲）导出为 JSON、Markdown 目录或中文摘要。要哪个格式？ -->

# 复制文档为微信公众号

这是一个 [Obsidian](https://obsidian.md) 插件，可将当前文档复制到微信公众号，以便快速将文档内容分享到微信公众号。

该插件提供了 `复制文档为公众号` 命令，可以绑定到键盘快捷键（见下文）。也可以从文件资源管理器视图中复制内容。


## 功能特性

### 命令

这些命令可以从热键菜单绑定到键盘快捷键，或使用命令菜单运行（Ctrl+P）

**复制选中内容或整个文档到剪贴板**：如果选中了文本，将其复制到剪贴板。如果没有选中文本，则复制整个文档。这应该是你的默认键盘快捷键。（建议：`Ctrl+Shift+C`）

**复制整个文档到剪贴板**：复制整个文档

**复制当前选中内容到剪贴板**：仅复制选中的文本

### 媒体支持

目前支持：

- ✅ 图片
- ✅ PlantUML
- ✅ 图表
- ✅ Obsidian 任务
- ✅ Obsidian Dataview - 对于大型 Dataview 块，内容可能不完整
- ✅ Excalidraw - 渲染为位图以解决在 Gmail 中粘贴的问题
- ✅ Mermaid


### 样式

默认情况下，文档会应用简单的样式。可以通过插件设置自定义样式表，例如自定义表格或引用的外观。

## 高级功能

- 您可以选择是否要嵌入外部链接（http、https）。如果不嵌入（默认），您需要互联网访问才能查看文档，并且链接的图片可能会离线。如果嵌入，您的文档会更大。
- 可以在设置对话框中自定义或替换样式表。
- 默认将 SVG 转换为位图以获得更好的兼容性，但可能会损失质量。如果您知道要粘贴到支持 .svg 良好的应用程序中，可以禁用 `将 SVG 转换为位图` 设置。
- 可以将代码块和标注渲染为 HTML 表格。这会使它们变得丑陋，除了在 Google Docs 中会使文档稍微漂亮一些。
- 如果您的 Markdown 文件中有标题，使用文件名作为标题
- 如果您不需要完整的 HTML 文档，只需要 HTML 片段，例如要粘贴到现有文档中，请启用"仅复制 HTML 片段"选项。
- 您也可以通过粘贴到非 HTML 编辑器（如记事本）来检索 HTML 内容。
- 提供您自己的 HTML 模板

## 实现原理

该插件将图片引用转换为数据 URL，因此转换后的内容不包含对图片的引用。

## 已知问题

- 不支持移动端
- 对删除特殊 Dataview 字段（双冒号属性等）的支持是实验性的，不支持括号表示法。它们也不会从包含的文件中删除。
- 数据 URI 对于大/多图片可能会占用大量内存

## 安装

在 Obsidian 设置的社区插件部分中查找 *复制文档为 HTML*。

如果发现任何问题，请不要害怕[报告](https://github.com/mvdkwast/obsidian-copy-as-html/issues)或[提问](https://github.com/mvdkwast/obsidian-copy-as-html/discussions)！

## 开发

请参阅 [Obsidian 示例插件](https://github.com/obsidianmd/obsidian-sample-plugin)。
官方文档：https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin

```
npm run dev
```

推荐node版本为v20.11.1

### 项目目录结构

```
obsidian-copy-as-html/
├── .github/                    # GitHub 相关文件
│   └── workflows/              # CI/CD 工作流配置
├── node_modules/               # 依赖包
├── .editorconfig               # 编辑器配置
├── .eslintignore               # ESLint 忽略文件配置
├── .eslintrc                   # ESLint 代码检查配置
├── .gitignore                  # Git 忽略文件配置
├── .npmrc                      # npm 配置
├── esbuild.config.mjs          # esbuild 构建配置
├── LICENSE                     # 许可证文件
├── main.js                     # 编译后的主插件文件
├── main.ts                     # 主 TypeScript 源代码
├── manifest.json               # Obsidian 插件清单文件
├── package.json                # npm 包配置
├── package-lock.json           # npm 依赖锁定文件
├── pnpm-lock.yaml              # pnpm 依赖锁定文件
├── README_zh.md                # 中文版 README (此文件)
├── styles.css                  # 插件样式文件
├── tsconfig.json               # TypeScript 配置
├── version-bump.mjs            # 版本更新脚本
└── versions.json               # 版本历史记录
```


## 致谢

- 花生编辑器：https://github.com/alchaincyf/huasheng_editor
- copy-as-html插件：https://github.com/mvdkwast/obsidian-copy-as-html