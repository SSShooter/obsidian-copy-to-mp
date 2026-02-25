import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as cheerio from "cheerio";
import MarkdownIt = require("markdown-it");
import mime = require("mime-types");
import hljs from "highlight.js"; // Import STYLES
import { STYLES } from "./styles";

const HLJS_THEME_CSS = `
pre.hljs { margin: 0; padding: 0; background: #282c34; border: none; overflow-x: auto; border-radius: 6px; }
pre.hljs code {
  color: #abb2bf;
  background: #282c34;
  font-family: 'SF Mono', Consolas, Monaco, 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.7;
  display: block;
  white-space: nowrap;
  padding: 16px 20px;
  border-radius: 6px;
}
.hljs-comment, .hljs-quote { color: #5c6370; font-style: italic; }
.hljs-doctag, .hljs-keyword, .hljs-formula { color: #c678dd; }
.hljs-section, .hljs-name, .hljs-selector-tag, .hljs-deletion, .hljs-subst { color: #e06c75; }
.hljs-literal { color: #56b6c2; }
.hljs-string, .hljs-regexp, .hljs-addition, .hljs-attribute, .hljs-meta-string { color: #98c379; }
.hljs-attr, .hljs-variable, .hljs-template-variable, .hljs-type, .hljs-selector-class, .hljs-selector-attr, .hljs-selector-pseudo, .hljs-number { color: #d19a66; }
.hljs-symbol, .hljs-bullet, .hljs-link, .hljs-meta, .hljs-selector-id, .hljs-title { color: #61aeee; }
.hljs-built_in, .hljs-class, .hljs-title-class_ { color: #e6c07b; }
.hljs-emphasis { font-style: italic; }
.hljs-strong { font-weight: bold; }
`;

// Inline style map for WeChat MP compatibility (WeChat strips <style> tags)
const HLJS_INLINE_STYLES: Record<string, string> = {
	"hljs-comment": "color: #5c6370; font-style: italic",
	"hljs-quote": "color: #5c6370; font-style: italic",
	"hljs-doctag": "color: #c678dd",
	"hljs-keyword": "color: #c678dd",
	"hljs-formula": "color: #c678dd",
	"hljs-section": "color: #e06c75",
	"hljs-name": "color: #e06c75",
	"hljs-selector-tag": "color: #e06c75",
	"hljs-deletion": "color: #e06c75",
	"hljs-subst": "color: #e06c75",
	"hljs-literal": "color: #56b6c2",
	"hljs-string": "color: #98c379",
	"hljs-regexp": "color: #98c379",
	"hljs-addition": "color: #98c379",
	"hljs-attribute": "color: #98c379",
	"hljs-meta-string": "color: #98c379",
	"hljs-attr": "color: #d19a66",
	"hljs-variable": "color: #d19a66",
	"hljs-template-variable": "color: #d19a66",
	"hljs-type": "color: #d19a66",
	"hljs-selector-class": "color: #d19a66",
	"hljs-selector-attr": "color: #d19a66",
	"hljs-selector-pseudo": "color: #d19a66",
	"hljs-number": "color: #d19a66",
	"hljs-symbol": "color: #61aeee",
	"hljs-bullet": "color: #61aeee",
	"hljs-link": "color: #61aeee",
	"hljs-meta": "color: #61aeee",
	"hljs-selector-id": "color: #61aeee",
	"hljs-title": "color: #61aeee",
	"hljs-built_in": "color: #e6c07b",
	"hljs-class": "color: #e6c07b",
	"hljs-title-class_": "color: #e6c07b",
	"hljs-emphasis": "font-style: italic",
	"hljs-strong": "font-weight: bold",
};

const DEFAULT_STYLESHEET = `body,input {
  font-family: "Roboto","Helvetica Neue",Helvetica,Arial,sans-serif
}
kbd {
  font-family: "Roboto Mono", "Courier New", Courier, monospace;
  background-color: #f5f5f5;
}
table {
  background: white;
  border: 1px solid #666;
  border-collapse: collapse;
  padding: 0.5em;
}
`;

const MERMAID_STYLESHEET = ``;

export function activate(context: vscode.ExtensionContext) {
	console.log(
		'Congratulations, your extension "vscode-copy-to-mp" is now active!',
	);

	const disposable = vscode.commands.registerCommand(
		"vscode-copy-to-mp.copyAsHtml",
		async () => {
			const editor = vscode.window.activeTextEditor;

			if (!editor) {
				vscode.window.showInformationMessage("No active editor open.");
				return;
			}

			const document = editor.document;
			const selection = editor.selection;

			const text = selection.isEmpty
				? document.getText()
				: document.getText(selection);
			const fileName = path.basename(document.fileName);
			const isFullDocument = selection.isEmpty;

			try {
				await copyToClipboard(
					text,
					fileName,
					document.uri.fsPath,
					isFullDocument,
				);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : String(error);
				vscode.window.showErrorMessage(
					`预览展开失败 (Preview failed): ${errorMessage}`,
				);
				console.error(error);
			}
		},
	);

	context.subscriptions.push(disposable);
}

async function copyToClipboard(
	markdown: string,
	name: string,
	filePath: string,
	isFullDocument: boolean,
) {
	const title = name.replace(/\.md$/i, "");

	// Configs
	const styleSheetStyle =
		(vscode.workspace
			.getConfiguration("copyToMp")
			.get("styleSheetStyle") as string) || "wechat-default";

	// 1. Preprocess markdown
	let processedMarkdown = markdown;
	processedMarkdown = processedMarkdown.replace(
		/^[^ \t:#`<>][^:#`<>]+::.*$/gm,
		"",
	); // remove dataview
	processedMarkdown = processedMarkdown.replace(/---[\s\S]*?---/, ""); // remove frontmatter

	// 2. Render Markdown
	const md: MarkdownIt = new MarkdownIt({
		html: true,
		highlight: function (str: string, lang: string): string {
			if (lang && hljs.getLanguage(lang)) {
				try {
					return (
						'<pre class="hljs"><code>' +
						hljs.highlight(str, {
							language: lang,
							ignoreIllegals: true,
						}).value +
						"</code></pre>"
					);
				} catch (__) {
					/* ignore */
				}
			}
			return (
				'<pre class="hljs"><code>' +
				md.utils.escapeHtml(str) +
				"</code></pre>"
			);
		},
	});
	const htmlBody = md.render(processedMarkdown);

	let htmlDocument = expandHtmlTemplate(htmlBody, title);

	htmlDocument = preprocessMarkdownList(htmlDocument);

	// 3. Post-process HTML (cheerio)
	const $ = cheerio.load(htmlDocument);

	// Convert whitespace in code blocks to HTML entities for WeChat MP compatibility
	$("pre.hljs, pre:has(code)").each((_, el) => {
		const codeElement = $(el).find("code");
		if (!codeElement.length) return;

		// Only replace spaces/tabs/newlines in text content, NOT inside HTML tags
		let codeHtml = codeElement.html() || "";
		codeHtml = codeHtml.replace(
			/([^<>]*?)(<[^>]*>|$)/g,
			(match, text, tag) => {
				if (text) {
					text = text.replace(/ /g, "&nbsp;");
					text = text.replace(/\n/g, "<br>");
				}
				return text + (tag || "");
			},
		);
		codeElement.html(codeHtml);
	});

	// Embed images
	const images = $("img");
	for (let i = 0; i < images.length; i++) {
		const img = $(images[i]);
		const src = img.attr("src");
		if (src && !src.startsWith("http") && !src.startsWith("data:")) {
			try {
				const imgPath = path.resolve(path.dirname(filePath), src);
				if (fs.existsSync(imgPath)) {
					const mimeType = mime.lookup(imgPath) || "image/png";
					const base64 = fs.readFileSync(imgPath).toString("base64");
					img.attr("src", `data:${mimeType};base64,${base64}`);
				}
			} catch (e) {
				console.error("Failed to embed image", src, e);
			}
		}
	}

	const baseHtmlDocument = $.html();

	const themes = Object.keys(STYLES).map((key) => ({
		id: key,
		name: STYLES[key as keyof typeof STYLES].name,
	}));

	// 5. Send to Webview for Clipboard writing
	return new Promise<void>((resolve, reject) => {
		const panel = vscode.window.createWebviewPanel(
			"copyHtml",
			"WeChat Preview",
			vscode.ViewColumn.Beside,
			{ enableScripts: true },
		);

		panel.onDidDispose(() => {
			resolve();
		});

		panel.webview.html = getWebviewContent(themes, styleSheetStyle);

		panel.webview.onDidReceiveMessage((message) => {
			if (message.type === "success") {
				vscode.window.showInformationMessage(
					"复制成功！(Copied to WeChat MP successfully)",
				);
			} else if (message.type === "error") {
				vscode.window.showErrorMessage(
					`复制失败 (Copy failed): ${message.message}`,
				);
			} else if (message.type === "changeTheme") {
				const styledHtml = applyInlineStyles(
					baseHtmlDocument,
					message.theme,
				);
				panel.webview.postMessage({
					type: "updateHtml",
					html: styledHtml,
				});
				vscode.workspace
					.getConfiguration("copyToMp")
					.update(
						"styleSheetStyle",
						message.theme,
						vscode.ConfigurationTarget.Global,
					);
			} else if (message.type === "ready") {
				const styledHtml = applyInlineStyles(
					baseHtmlDocument,
					styleSheetStyle,
				);
				panel.webview.postMessage({
					type: "updateHtml",
					html: styledHtml,
				});
			}
		});
	});
}

function getWebviewContent(
	themes: { id: string; name: string }[],
	defaultTheme: string,
) {
	const themesJson = JSON.stringify(themes);
	return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <style>
        body { margin: 0; padding: 0; display: flex; flex-direction: column; height: 100vh; font-family: sans-serif; background-color: var(--vscode-editor-background); color: var(--vscode-editor-foreground); }
        .toolbar { padding: 10px; display: flex; gap: 10px; background-color: var(--vscode-editorGroupHeader-tabsBackground); border-bottom: 1px solid var(--vscode-editorGroupHeader-tabsBorder); align-items: center; }
        .toolbar select, .toolbar button { padding: 5px 10px; font-size: 14px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: 1px solid var(--vscode-button-border, transparent); cursor: pointer; border-radius: 2px; }
        .toolbar select { background: var(--vscode-dropdown-background); color: var(--vscode-dropdown-foreground); border: 1px solid var(--vscode-dropdown-border); }
        .toolbar button:hover { background: var(--vscode-button-hoverBackground); }
        .preview-container { flex: 1; overflow: hidden; background-color: #fff; }
        #preview { width: 100%; height: 100%; border: none; background-color: #fff; }
    </style>
</head>
<body>
    <div class="toolbar">
        <label for="theme-select">主题 (Theme):</label>
        <select id="theme-select"></select>
        <button id="copy-btn">复制 (Copy)</button>
    </div>
    <div class="preview-container">
        <iframe id="preview"></iframe>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        let currentHtml = '';

        const themeSelect = document.getElementById('theme-select');
        const copyBtn = document.getElementById('copy-btn');
        const previewIframe = document.getElementById('preview');

        const themes = ${themesJson};
        const defaultTheme = '${defaultTheme}';
        
        themes.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.name;
            if (t.id === defaultTheme) opt.selected = true;
            themeSelect.appendChild(opt);
        });

        themeSelect.addEventListener('change', (e) => {
            vscode.postMessage({ type: 'changeTheme', theme: e.target.value });
        });

        copyBtn.addEventListener('click', async () => {
            if (!currentHtml) return;
            // Extract only body content to avoid <title> and other <head> elements
            // being treated as visible content by WeChat's editor
            const parser = new DOMParser();
            const doc = parser.parseFromString(currentHtml, 'text/html');
            const bodyContent = doc.body.innerHTML;
            const blob = new Blob([bodyContent], { type: 'text/html' });
            const plainBlob = new Blob([bodyContent], { type: 'text/plain' });
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'text/html': blob,
                        'text/plain': plainBlob
                    })
                ]);
                vscode.postMessage({ type: 'success' });
            } catch (e) {
                vscode.postMessage({ type: 'error', message: e.toString() });
            }
        });

        window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.type === 'updateHtml') {
                currentHtml = message.html;
                previewIframe.srcdoc = currentHtml;
            }
        });

        vscode.postMessage({ type: 'ready' });
    </script>
</body>
</html>`;
}

function expandHtmlTemplate(html: string, title: string) {
	const template = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    ${MERMAID_STYLESHEET}
    ${DEFAULT_STYLESHEET}
    ${HLJS_THEME_CSS}
  </style>
</head>
<body>
${html}
</body>
</html>`;
	return template;
}

function preprocessMarkdownList(content: string) {
	let result = content;
	result = result.replace(
		/^(\s*(?:\d+\.|-|\*)\s+[^:\n]+)\n\s*:\s*(.+?)$/gm,
		"$1: $2",
	);
	result = result.replace(
		/^(\s*(?:\d+\.|-|\*)\s+.+?:)\s*\n\s+(.+?)$/gm,
		"$1 $2",
	);
	result = result.replace(
		/^(\s*(?:\d+\.|-|\*)\s+[^:\n]+)\n:\s*(.+?)$/gm,
		"$1: $2",
	);
	result = result.replace(
		/^(\s*(?:\d+\.|-|\*)\s+.+?)\n\n\s+(.+?)$/gm,
		"$1 $2",
	);
	return result;
}

function applyInlineStyles(html: string, applyStyle: string) {
	const styleObj =
		STYLES[applyStyle as keyof typeof STYLES] || STYLES["wechat-default"];
	const style = styleObj.styles;
	const $ = cheerio.load(html);

	Object.keys(style).forEach((selector) => {
		// Do not skip pre/code anymore, so themes can style code blocks if they want
		// But allow base styles to persist if theme doesn't provide them.
		$(selector).each((_, node) => {
			const el = node as typeof node & { tagName?: string };
			if (el.tagName === "img" && $(el).closest(".image-grid").length) {
				return;
			}

			const currentStyle = $(el).attr("style") || "";
			if (el.tagName === "li" || el.tagName === "LI") {
				const p = $("<p></p>");
				p.html($(el).html() || "");
				$(el).html("");
				$(el).append(p);
				$(el).attr("style", currentStyle + "; " + style["li"]);
			} else {
				$(el).attr(
					"style",
					currentStyle + "; " + style[selector as keyof typeof style],
				);
			}
		});
	});

	// Inline hljs styles for WeChat MP compatibility
	$("pre.hljs").attr(
		"style",
		"margin: 0; padding: 0; background: #282c34; border: none; overflow-x: auto; border-radius: 6px;",
	);
	$("pre.hljs code").attr(
		"style",
		"color: #abb2bf; font-family: 'SF Mono', Consolas, Monaco, 'Courier New', monospace; font-size: 14px; line-height: 1.7; display: block; white-space: nowrap; padding: 16px 20px; border-radius: 6px;width: 100%; box-sizing: border-box; overflow-x: auto;",
	);
	Object.keys(HLJS_INLINE_STYLES).forEach((className) => {
		$("." + className).each((_, el) => {
			const currentStyle = $(el).attr("style") || "";
			$(el).attr(
				"style",
				currentStyle + "; " + HLJS_INLINE_STYLES[className],
			);
		});
	});

	const bodyHtml = $("body").html();
	const container = $('<div class="mp-container"></div>');
	container.attr("style", style.container);
	if (bodyHtml) {
		container.html(bodyHtml);
		$("body").empty().append(container);
	}

	return $.html();
}

export function deactivate() {}
