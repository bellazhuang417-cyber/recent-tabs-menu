# Recent Tabs Menu 最近访问标签页（回到刚才）

**English** | [中文](#中文说明)

A tiny Chrome extension that answers one question: *"Which tab was I just looking at?"*

When you switch back to Chrome from another app (an IDE, a terminal, Claude Code…), dozens of squeezed tab titles make it hard to find the page you were reading seconds ago — especially when several tabs look alike (report v2, report v3…). This extension puts your **5 most recently accessed tabs right in the right-click menu**, sorted by last-accessed time, so you can jump back in two clicks.

## Features

- **Right-click → "最近访问的标签页" (Recent tabs)** — a submenu lists your 5 most recently accessed tabs with relative time ("2 min ago"), click to jump. Works across windows.
- **Toolbar popup fallback** — right-click menus don't work on `chrome://` pages or the Web Store; click the toolbar icon to see the same list (top 10) with favicons and URLs.
- **Zero tracking** — reads Chrome's built-in `tab.lastAccessed` only. No background history, no network requests, no data stored.

## Install

1. Open `chrome://extensions` in Chrome
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select this folder

Requires Chrome 121+.

## Notes

- The list excludes the tab you're currently on — item #1 is always "the previous one".
- Relative times refresh on every tab switch, and every 5 minutes when idle.

---

## 中文说明

一个只回答一个问题的小扩展：**"我刚才在看哪个页面？"**

当你从别的应用（IDE、终端、Claude Code……）切回 Chrome 时，一排挤扁的标签让你找不到几秒前还在看的页面——尤其当好几个标签长得很像（报告 v2、报告 v3……）。这个扩展把**最近访问的 5 个标签直接放进右键菜单**，按最后访问时间倒序，两下点击就能跳回去。

## 功能

- **右键 → 「最近访问的标签页」** —— 子菜单列出最近访问的 5 个标签，带相对时间（"2 分钟前"），点击跳转，跨窗口有效
- **工具栏图标弹窗兜底** —— `chrome://` 设置页、Chrome 商店页面右键菜单不可用时，点工具栏图标看同一份列表（前 10 个，含图标和网址）
- **零追踪** —— 只读取 Chrome 自带的 `tab.lastAccessed`，不记录历史、不联网、不存储任何数据

## 安装

1. Chrome 打开 `chrome://extensions`
2. 右上角打开「开发者模式」
3. 点「加载已解压的扩展程序」，选择本文件夹

需要 Chrome 121 或更高版本。

## 说明

- 列表排除当前正在看的标签，第 1 项永远是"上一个"
- 相对时间在切换标签时实时刷新，静止状态下每 5 分钟刷新一次

---

made by Bella Zhuang
