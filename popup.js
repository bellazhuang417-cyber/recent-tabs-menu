// 弹窗兜底：右键菜单在 chrome:// 等页面不可用时，点工具栏图标看同一份列表
const MAX_ITEMS = 10;

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  return `${Math.floor(hr / 24)} 天前`;
}

async function render() {
  const list = document.getElementById('list');
  const tabs = await chrome.tabs.query({});
  const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const recent = tabs
    .filter((t) => t.id !== activeTab?.id && t.lastAccessed)
    .sort((a, b) => b.lastAccessed - a.lastAccessed)
    .slice(0, MAX_ITEMS);

  if (recent.length === 0) {
    list.innerHTML = '<li class="empty">暂无其他标签页</li>';
    return;
  }

  for (const tab of recent) {
    const li = document.createElement('li');

    const img = document.createElement('img');
    img.src = tab.favIconUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" rx="3" fill="%23ddd"/></svg>';
    img.onerror = () => { img.style.visibility = 'hidden'; };

    const info = document.createElement('div');
    info.className = 'info';
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = tab.title || '(无标题)';
    const meta = document.createElement('div');
    meta.className = 'meta';
    try {
      meta.textContent = new URL(tab.url).hostname + new URL(tab.url).pathname;
    } catch {
      meta.textContent = tab.url || '';
    }
    info.append(title, meta);

    const ago = document.createElement('span');
    ago.className = 'ago';
    ago.textContent = timeAgo(tab.lastAccessed);

    li.append(img, info, ago);
    li.addEventListener('click', async () => {
      await chrome.windows.update(tab.windowId, { focused: true });
      await chrome.tabs.update(tab.id, { active: true });
      window.close();
    });
    list.append(li);
  }
}

render();
