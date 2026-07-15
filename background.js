// 最近访问标签页（回到刚才）
// 核心逻辑：读取每个 tab 自带的 lastAccessed，按时间倒序取前 5 个，
// 挂到右键菜单的子菜单里。点击子菜单项即跳转到对应标签页（跨窗口有效）。

const MAX_ITEMS = 5;
const PARENT_ID = 'recent-tabs-parent';
const MENU_CONTEXTS = ['page', 'frame', 'selection', 'link', 'image', 'video', 'audio'];

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  return `${Math.floor(hr / 24)} 天前`;
}

async function getRecentTabs(limit) {
  const tabs = await chrome.tabs.query({});
  const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tabs
    .filter((t) => t.id !== activeTab?.id && t.lastAccessed)
    .sort((a, b) => b.lastAccessed - a.lastAccessed)
    .slice(0, limit);
}

function menuTitle(tab, index) {
  let title = tab.title || tab.url || '(无标题)';
  if (title.length > 50) title = title.slice(0, 50) + '…';
  // & 在部分平台的菜单里是快捷键转义符，需要写成 &&
  title = title.replace(/&/g, '&&');
  return `${index + 1}  ${timeAgo(tab.lastAccessed)} · ${title}`;
}

// 串行化重建，避免并发 removeAll/create 产生重复 id 报错
let rebuildQueue = Promise.resolve();
let rebuildTimer = null;

function scheduleRebuild() {
  if (rebuildTimer) clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => {
    rebuildQueue = rebuildQueue.then(rebuildMenu).catch(() => {});
  }, 300);
}

async function rebuildMenu() {
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: PARENT_ID,
    title: '最近访问的标签页',
    contexts: MENU_CONTEXTS,
  });
  const recent = await getRecentTabs(MAX_ITEMS);
  if (recent.length === 0) {
    chrome.contextMenus.create({
      id: 'recent-tabs-empty',
      parentId: PARENT_ID,
      title: '（暂无其他标签页）',
      enabled: false,
      contexts: MENU_CONTEXTS,
    });
    return;
  }
  for (let i = 0; i < recent.length; i++) {
    chrome.contextMenus.create({
      id: `tab-${recent[i].id}`,
      parentId: PARENT_ID,
      title: menuTitle(recent[i], i),
      contexts: MENU_CONTEXTS,
    });
  }
}

chrome.contextMenus.onClicked.addListener(async (info) => {
  const id = String(info.menuItemId);
  if (!id.startsWith('tab-')) return;
  const tabId = parseInt(id.slice(4), 10);
  try {
    const tab = await chrome.tabs.get(tabId);
    await chrome.windows.update(tab.windowId, { focused: true });
    await chrome.tabs.update(tabId, { active: true });
  } catch {
    // 标签页已被关闭，刷新菜单
    scheduleRebuild();
  }
});

// 标签切换 / 关闭 / 标题变化 / 窗口焦点变化时刷新菜单
chrome.tabs.onActivated.addListener(scheduleRebuild);
chrome.tabs.onRemoved.addListener(scheduleRebuild);
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.title || changeInfo.status === 'complete') scheduleRebuild();
});
chrome.windows.onFocusChanged.addListener(scheduleRebuild);

// 长时间不切换标签时，「X 分钟前」会过时，每 5 分钟刷新一次
chrome.alarms.create('refresh-menu', { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'refresh-menu') scheduleRebuild();
});

chrome.runtime.onInstalled.addListener(scheduleRebuild);
chrome.runtime.onStartup.addListener(scheduleRebuild);
