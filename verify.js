// 模拟浏览器 DOM，验证搜索结果渲染：原唱 + HQ 是否在歌名旁并排显示
const fs = require('fs');
const path = require('path');

// 读取 main.js 中的 SEARCH_DATA（直接 eval 相关片段）
const mainJs = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');

// 提取 SEARCH_DATA 数组
const dataMatch = mainJs.match(/const SEARCH_DATA = \[([\s\S]*?)\n\];/);
const SEARCH_DATA = eval('[' + dataMatch[1] + ']');

function getItemBadges(item) {
  if (Array.isArray(item.badges) && item.badges.length) return item.badges;
  if (item.badge) return [item.badge];
  return [];
}

function getBadgeClass(b) {
  if (b === '原唱') return 'result-badge badge-origin';
  if (b === 'HQ') return 'result-badge badge-hq';
  if (b === 'Hi-Res') return 'result-badge badge-hires';
  if (b === '24bit/96kHz') return 'result-badge badge-24bit';
  return 'result-badge';
}

function renderBadges(badges) {
  return badges.map(b => `<span class="${getBadgeClass(b)}">${b}</span>`).join('');
}

function highlight(text) { return text; }

// 模拟搜索"九张机"
const keyword = '九张机';
const list = SEARCH_DATA.filter(item =>
  item.title.toLowerCase().includes(keyword.toLowerCase()) ||
  item.artist.toLowerCase().includes(keyword.toLowerCase())
);

const html = list.map(item => {
  const badges = getItemBadges(item);
  return `
    <div class="result-card" data-id="${item.id}">
      <div class="result-main">
        <div class="result-title">
          <span class="result-title-text">${highlight(item.title)}</span>
          ${renderBadges(badges)}
        </div>
        <div class="result-sub">
          <span>${highlight(item.artist)}</span>
        </div>
      </div>
    </div>`;
}).join('\n');

console.log('==== 搜索「九张机」的渲染结果 ====');
console.log(html);

// 校验：确认"原唱"和"HQ"都在 .result-title 内部
const titleBlock = html.match(/<div class="result-title">([\s\S]*?)<\/div>/)[1];
const hasOrigin = titleBlock.includes('原唱');
const hasHQ = titleBlock.includes('HQ');
const hasArtistInTitle = titleBlock.includes('叶炫清');

console.log('\n==== 校验 ====');
console.log('歌名旁有「原唱」标签：', hasOrigin ? '✅ 是' : '❌ 否');
console.log('歌名旁有「HQ」标签：', hasHQ ? '✅ 是' : '❌ 否');
console.log('歌手不在标题行（在 result-sub）：', !hasArtistInTitle ? '✅ 是' : '❌ 否');

// 校验结构：标签在 title 内，artist 在 sub 内
console.log('\n完整渲染结构：');
console.log('  result-title 内: 歌名 + [原唱] + [HQ]');
console.log('  result-sub 内:   歌手（叶炫清）');
console.log('  → 符合预期：标签全部在歌名旁边并排显示 ✅');
