# 一键复制文档到微信公众号

这是一个 [Obsidian](https://obsidian.md) 插件，可将当前文档以微信公众号格式复制到剪贴板，方便直接在公众号后台粘贴，实现快速分享。

## 功能特性

### 命令

可通过命令面板（Ctrl+P）运行，或绑定热键：

* **复制选中内容或整个文档**：如果选中了文本，将复制选中部分；否则复制整个文档。

### 媒体支持

* ✅ 图片
* ✅ PlantUML
* ✅ 图表
* ✅ Obsidian 任务
* ✅ Obsidian Dataview（大型块可能不完整）
* ✅ Excalidraw（渲染为位图以兼容 Gmail）
* ✅ Mermaid

### 样式

* 默认应用插件自带样式，后续可扩展支持多样化样式。

## 高级功能

* 可选择是否嵌入外部链接（http/https），默认不嵌入以兼容微信公众号。
* SVG 默认转换为位图，提高兼容性，但可能略有损失。
* Markdown 文件标题会自动使用文件名作为文章标题。
* 可粘贴到非 HTML 编辑器（如记事本）查看 HTML 内容。

## 实现原理

* 插件将图片引用转换为 Data URL，使复制后的内容无需依赖外部图片。

## 已知问题

* 不支持移动端
* 数据 URI 对于大或多图片可能占用大量内存
* 列表在部分加粗后可能自动换行

## 安装

在 Obsidian 设置 → 社区插件中搜索 `copy-to-mp` 并安装。

发现问题可在 Issue 中反馈。


## 开发

参考：[Obsidian 示例插件](https://github.com/obsidianmd/obsidian-sample-plugin)
官方文档：[Build a plugin](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)

* 推荐 Node.js 版本：v20.11.1

### 项目目录结构

```
obsidian-copy-as-html/
├── .github/                    # GitHub 相关文件
│   └── workflows/              # CI/CD 工作流
├── node_modules/               # 依赖包
├── .editorconfig               # 编辑器配置
├── .eslintignore               # ESLint 忽略配置
├── .eslintrc                   # ESLint 配置
├── .gitignore                  # Git 忽略文件
├── .npmrc                      # npm 配置
├── esbuild.config.mjs          # 构建配置
├── LICENSE                     # 许可证
├── main.js                     # 编译后的主插件文件
├── main.ts                     # 主 TypeScript 源代码
├── manifest.json               # Obsidian 插件清单
├── package.json                # npm 包配置
├── package-lock.json           # npm 依赖锁定
├── pnpm-lock.yaml              # pnpm 依赖锁定
├── README_zh.md                # 中文版 README
├── styles.css                  # 插件样式
├── tsconfig.json               # TypeScript 配置
├── version-bump.mjs            # 版本更新脚本
└── versions.json               # 版本历史
```

## 赞赏码

<img src="https://pic.520233.best/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20251222142804_282_346.jpg" width="100" height="100" alt="赞赏码">

WX联系方式，请道明来意

<img src="https://pub-2326c75947ef43449218077f86785a82.r2.dev/my-wechat.jpg" width="100"  alt="WX">

## 致谢

* [花生编辑器](https://github.com/alchaincyf/huasheng_editor)
* [copy-as-html 插件](https://github.com/mvdkwast/obsidian-copy-as-html)

