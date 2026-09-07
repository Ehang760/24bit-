/*==========================================
  一、搜索数据 & 搜索逻辑
  【方案B】每条数据手动写 id，id = 榜单排名（1~10）
  注意：不要再用 forEach 强制覆盖 item.id
==========================================*/

const SEARCH_DATA = [
  {
    id: '1',
    title: '九张机',
    artist: '叶炫清',
    badge: '原唱',
    badges: ['原唱', 'HQ','Hi-Res'],
    desc: '',
    cover: 'cover/叶炫清.png',
    type: '歌曲',
    audio: 'song/九张机.mp3',
    lrc: `
[00:00.00]叶炫清-九张机
[00:02.00]作词：张富贵
[00:04.00]作曲：周琦
[00:06.00]编曲：周琦
[00:08.00]缩混：王路遥
[00:10.00]笛子：叶炫清
[00:12.00]吉他：周琦
[00:14.30]光阴如梭
[00:16.02]一梭才去一梭痴
[00:20.59]情丝百转
[00:22.54]丝丝缠乱犹不知
[00:27.24]织一段 锦绣纹饰
[00:31.04]并连理双枝
[00:35.42]难寄托 这相思
[00:40.33]兜兜转转
[00:41.61]朝花夕拾却已迟
[00:46.89]寻寻觅觅
[00:48.75]醉生梦死又一世
[00:52.91]还记得 前生盟誓
[00:57.86]欲言竟无词
[01:01.11]恨对面 不相识
[01:08.15]我愿化作 望断天涯
[01:11.47]那一方青石
[01:15.24]篆刻心头 是你的名字
[01:19.33]轮回彩蝶 化茧自缚
[01:22.83]织就春蚕丝
[01:25.52]剪不断 共缠绵
[01:28.59]生生世世
[01:59.43]兜兜转转
[02:00.89]朝花夕拾却已迟
[02:05.89]寻寻觅觅
[02:07.34]醉生梦死又一世
[02:11.79]还记得 前生盟誓
[02:16.30]欲言竟无词
[02:19.60]恨对面 不相识
[02:24.55]我愿化作 望断天涯
[02:28.90]那一方青石
[02:31.94]篆刻心头 是你的名字
[02:38.00]轮回彩蝶 化茧自缚
[02:41.99]织就春蚕丝
[02:44.93]剪不断 共缠绵
[02:47.62]生生世世
[02:51.50]我愿化作 望断天涯
[02:56.71]那一方青石
[02:59.13]篆刻心头 是你的名字
[03:04.47]轮回彩蝶 化茧自缚
[03:08.75]织就春蚕丝
[03:11.47]剪不断 共缠绵
[03:13.69]生生世世
[03:17.61]剪不断 共缠绵
[03:20.39]生生世世
`
  },
  {
    id: '2',
    title: '叹云兮',
    artist: '鞠婧祎',
    badge: '原唱',
    badges: ['原唱', 'HQ'],
    desc: '',
    cover: 'cover/鞠婧祎.png',
    type: '歌曲',
    audio: 'song/叹云兮.mp3',
    lrc:  `
[00:00.00]叹云兮-鞠婧祎
[00:00.01]TOP500第357名
[00:00.02]影视金曲榜第23名
[00:00.02]作词：郭德紫毅
[00:00.03]作曲：SHIMA
[00:00.05]编曲：SHIMA
[00:15.40]若这个世界凋谢
[00:17.99]我会守在你身边
[00:22.87]用沉默坚决
[00:24.29]对抗万语千言
[00:29.71]倘若这世间
[00:31.23]一切都在无情的崩裂
[00:36.27]我会用手中的线为你缝原
[00:42.81]陪你看日升月潜
[00:46.12]陪你看沧海变迁
[00:50.18]陪你一字又一言
[00:53.24]谱下回忆的诗篇
[00:56.72]陪你将情节改写
[01:00.49]陪你将八荒走遍
[01:03.45]只因你读得懂我
[01:06.81]而你注定
[01:09.88]是我的心头血
[01:13.58]这是缘
[01:15.28]亦是命中最美的相见
[01:20.20]别恨天
[01:22.22]笑容更适合你的脸
[01:27.47]再一遍
[01:30.02]记起从前的一滴一点
[01:34.44]别怨我不在身边
[01:37.44]记住
[01:39.21]我会在你的心里面
[01:55.79]当我们命运重叠
[01:57.81]恍然大悟才发现
[02:01.98]原来这世间
[02:06.37]完美可以残缺
[02:09.15]时间不停歇
[02:11.93]仿佛落叶飞花
[02:13.48]般无解
[02:15.89]而你在这里
[02:17.68]就温柔了一切
[02:22.23]陪你看梅海的月
[02:26.50]陪你踱天宁的街
[02:29.34]陪你把我的所念
[02:32.63]写成最后的药笺
[02:36.99]陪你过的那些年
[02:40.05]终究会化作永远
[02:42.93]记得我不曾后退
[02:46.20]在你心上
[02:48.80]陪你每个黑夜
[02:53.37]唇齿间
[02:54.91]不舍的是对你的留恋
[03:00.12]叹离别
[03:02.05]总是在该圆满之前
[03:06.63]我的愿
[03:08.94]并非执手相看泪满眼
[03:12.76]而是你
[03:14.99]一往无前
[03:17.27]拾起曾因我而有的笑脸
[03:21.97]若故事重演
[03:24.57]我想我依然会
[03:25.72]用我的一切
[03:28.04]换明天
[03:30.07]就算我不在里面
[03:31.73]可你会明白
[03:33.98]我对你的永世不变
[03:40.90]这是缘
[03:43.16]亦是命中最美的相见
[03:47.76]别恨天
[03:50.03]笑容更适合你的脸
[03:54.80]再一遍
[03:56.82]记起从前的一滴一点
[04:01.35]别怨我不在身边
[04:04.64]记住
[04:06.01]我会在你的心里面
[04:09.44]我会在你心间
[04:12.28]做你心头血
    `
  },
  {
    id: '3',
    title: 'Sofia',
    artist: 'Alvaro Soler',
    badge: '原唱',
    badges: ['原唱', 'HQ'],
    desc: '',
    cover: 'cover/Alvaro Soler.png',
    type: '歌曲',
    audio: 'song/Sofia.mp3',
    lrc: `
[00:00.00]Sofia
[00:07.47]Sueño cuando era pequeño
[00:10.44]Sin preocupación, en el corazón
[00:15.40]Sigo viendo aquel momento
[00:17.86]Se desvaneció, desapareció
[00:22.55]Ya no te creo, ya no te deseo, eh-oh
[00:30.11]Solo te veo, solo te deseo, eh-oh
[00:39.39]Mira, Sofía
[00:43.22]Sin tu mirada sigo
[00:44.98]Sin tu mirada sigo
 [00:47.11]Dime, Sofía, ah-ah-ah
[00:50.70]¿Cómo te mira? Dime
[00:52.73]¿Cómo te mira? Dime
[00:54.72]Sé que no, sé que no, oh
[00:57.31]Sé que solo
[00:59.30]Sé que ya no soy, oy-oy-oy
[01:02.12]Mira, Sofía
[01:05.68]Sin tu mirada sigo
[01:07.47]Sin tu mirada, Sofía
[01:16.90]Dices que éramos felices
[01:19.79]Todo ya pasó, todo ya pasó
[01:24.53]Sé que te corté las alas
[01:27.40]Él te hizo volar, él te hizo soñar
[01:32.40]Ya no te creo, ya no te deseo, eh-oh
[01:39.28]Solo te veo, solo te deseo, eh-oh
[01:48.84]Mira, Sofía
[01:52.59]Sin tu mirada sigo
[01:54.43]Sin tu mirada sigo
[01:56.50]Dime, Sofía, ah-ah-ah
[02:00.19]¿Cómo te mira? Dime
[02:02.12]¿Cómo te mira? Dime
[02:03.93]Sé que no, sé que no, oh
[02:06.60]Sé que solo
[02:08.32]Sé que ya no soy, oy-oy-oy
[02:11.31]Mira, Sofía
[02:15.21]Sin tu mirada sigo
[02:17.20]Sin tu mirada, Sofía
[02:24.80]¿Y por qué no me dices la verdad? Eh
[02:31.45]Sigo sin tu mirada Sofía, eh, eh, eh, eh
[02:39.90]¿Y por qué no me dices la verdad?
[02:48.00]Mira, Sofía
[02:50.00]Sin tu mirada sigo
[02:52.00]Dime, Sofía
[02:54.00]¿Cómo te mira? Dime
[02:56.00]¿Cómo te mira?
[02:58.00]Mira, Sofía
[03:00.00]Sin tu mirada sigo
[03:02.00]Sin tu mirada sigo 
[03:04.00]Dime, Sofía, ah-ah-ah
[03:07.00]¿Cómo te mira? Dime
[03:09.00]¿Cómo te mira? Dime
[03:11.00]Sé que no, sé que no
[03:13.00]Sé que solo
[03:15.00]Sé que ya no soy, oy-oy-oy
[03:18.00]Mira, Sofía
[03:21.00]Sin tu mirada sigo
[03:23.00]Sin tu mirada, Sofía
  `
  },
  {
    id: '4',
    title: '地球ぎ',
    artist: '松泽由美',
    badge: '原唱',
    badges: ['原唱', 'HQ'],
    desc: '',
    cover: 'cover/地球仪.png',
    type: '歌曲',
    audio: 'song/地球仪.mp3',
    lrc:`
[00:00.69]涙よりも優しい歌を
[00:07.90]かなしみよりそのぬくもりを
[00:35.95]世界がそんなにも
[00:39.86]簡単に変わるとは思わないけど
[00:44.59]静かに闇を溶かして
[00:49.17]歩いて歩いてみようと思う
[00:53.98]ゆっくりでも近づけるかな
[00:58.56]夢のカケラ大好きな人
[01:03.28]思い描いた愛のカタチは
[01:08.00]ずっとずっと探しつづけて
[01:21.92]あきらめる理由を話すよりも
[01:26.40]出来ることを数えるほうがいいよね
[01:31.24]つまづくことがあって
[01:33.98]振り返りそうになって
[01:35.73]それでもそれでも
[01:39.86]もう決めたんだ
[01:40.53]あなたのために出来ることなんて
[01:45.13]たいしたことないかもしれない
[01:49.76]でもそれでも触れていたいよ
[01:54.47]かなしみよりそのぬくもりを
[01:59.16]ゆっくりでも近づけるかな
[02:03.70]夢のカケラ大好きな人
[02:08.48]思い描いた愛のカタチは
[02:13.19]ずっとずっと探しつづけて
[02:36.55]グルグル廻る地球ぎ
[02:41.24]クルクル変わる時間
[02:46.00]世界の果てに愛を
[02:50.53]喜びの先に夢を
[02:59.90]ゆっくりでも近づけるかな
[03:04.28]夢のカケラ大好きな人
[03:09.21]思い描いた愛のカタチは
[03:13.81]ずっとずっと探しつづけて
[03:27.63]涙よりも優しい歌を
[03:32.33]かなしみよりそのぬくもりを
    `
  },
  {
    id: '5',
    title: 'Hop',
    artist: 'Azis',
    badge: 'Hi-Res',
    badges: ['Hi-Res', 'HQ'],
    desc: '',
    cover: 'cover/Hop.png',
    type: '歌曲',
    audio: 'song/Hop.mp3',
    lrc: `
[00:00.00]Azis - Hop
[00:35.14]Мило, обичаш ли ме още?
[00:37.57]Бейби, събличаш ли ме нощем?
[00:40.42]Карай бавно няма да бързаш
[00:43.12]Как ще стане много мърдаш!
[00:46.60]Хоп, и влиза малко по малко
[00:49.11]Хоп, движи се бавно и бавно
[00:52.15]Хоп, и вкарай го точно сега
[00:55.32]Ритъма на любовта!
[00:58.50]Хоп, и влиза малко по малко
[01:01.10]Хоп, движи се бавно и бавно
[01:03.94]Хоп, и вкарай го точно сега
[01:06.88]Ритъма на любовта!
[01:09.88]Lover, lover, fucker, fucker, lover
[01:15.50]Love me, love me now
[01:22.28]Love me, love me now
[01:32.34]Гледай без да се ядосваш
[01:35.40]Пипай без да се докосваш
[01:38.34]Недей да свършваш точно сега
[01:41.28]Задръж се малко, да да така
[01:43.84]Хоп, и влиза малко по малко
[01:46.72]Хоп, движи се бавно и бавно
[01:49.59]Хоп, и вкарай го точно сега
[01:52.47]Ритъма на любовта!
[01:55.32]Хоп, и влиза малко по малко
[01:58.19]Хоп, движи се бавно и бавно
[02:00.94]Хоп, и вкарай го точно сега
[02:03.88]Ритъма на любовта!
[02:06.70]
[02:40.99]Хоп, и влиза малко по малко
[02:43.86]Хоп, движи се бавно и бавно
[02:46.74]Хоп, и вкарай го точно сега
[02:49.55]Ритъма на любовта!
[02:52.36]Хоп, и влиза малко по малко
[02:55.24]Хоп, движи се бавно и бавно
[02:58.17]Хоп, и вкарай го точно сега
[03:00.99]Ритъма на любовта!
[03:03.50]
    `
  },
  {
    id: '6',
    title: '24bit无损音质合集',
    artist: 'Various Artists',
    badge: '24bit/96kHz',
    badges: ['24bit/96kHz', 'HQ'],
    desc: '高解析无损音乐精选',
    cover: 'https://picsum.photos/seed/24bit/120/120',
    type: '专辑',
    audio: '',
    lrc: ''
  },
  {
    id: '7',
    title: '无损音乐下载站',
    artist: '本站',
    badge: '',
    desc: 'FLAC/APE 无损资源索引',
    cover: 'https://picsum.photos/seed/flac/120/120',
    type: '专辑',
    audio: '',
    lrc: ''
  },
  {
    id: '8',
    title: '青花瓷',
    artist: '周杰伦',
    badge: '',
    desc: '',
    cover: 'cover/青花瓷.png',
    type: '歌曲',
    audio: 'song/青花瓷.mp3',
    lrc: ''
  },
  {
    id: '9',
    title: '海阔天空',
    artist: 'Beyond',
    badge: '',
    desc: '',
    cover: 'cover/海阔天空.png',
    type: '歌曲',
    audio: 'song/海阔天空.mp3',
    lrc: ''
  },
  {
    id: '10',
    title: '山风山风等等我',
    artist: '',
    badge: '',
    desc: '',
    cover: 'cover/default.png',
    type: '歌曲',
    audio: 'song/山风山风等等我.mp3',
    lrc: ''
  }
];

/* 重要：不再用 forEach 强制覆盖 id，保持上面的手动 id（1~10） */

const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const result = document.getElementById('searchResult');

function highlight(text, keyword) {
  if (!keyword) return text;
  const safe = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(safe, 'gi'), m => `<mark>${m}</mark>`);
}

function search(q) {
  q = q.trim().toLowerCase();
  if (!q) return [];
  return SEARCH_DATA.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.artist.toLowerCase().includes(q) ||
    item.desc.toLowerCase().includes(q)
  );
}

let currentList = [];

function render(list, keyword) {
  currentList = list;

  if (!keyword.trim()) {
    result.classList.remove('active');
    result.innerHTML = '';
    return;
  }

  if (!list.length) {
    result.innerHTML = '<div class="result-empty">暂无结果</div>';
    result.classList.add('active');
    return;
  }

  result.innerHTML = list.map(item => `
    <div class="result-card" data-id="${item.id}">
      <img class="result-cover" src="${item.cover}" alt="">
      <div class="result-main">
        <div class="result-title">
          <span class="result-title-text">${highlight(item.title, keyword)}</span>
          ${(item.badges && item.badges.length ? item.badges : (item.badge ? [item.badge] : [])).map(b => `<span class="result-badge badge-${b === 'HQ' ? 'hq' : (b === '原唱' ? 'origin' : 'other')}">${b}</span>`).join('')}
        </div>
        <div class="result-sub">
          <span>${highlight(item.artist, keyword)}</span>
        </div>
        <div class="result-desc">${highlight(item.desc, keyword)}</div>
      </div>
      <div class="result-actions">
        <button class="icon-btn" title="收藏">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6z"/>
          </svg>
        </button>
        <button class="icon-btn" title="更多">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  result.classList.add('active');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  render(search(input.value), input.value);
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-box') && !e.target.closest('.search-result')) {
    result.classList.remove('active');
  }
});

/*==========================================
  二、点击搜索结果 → 跳转播放页（play.html?id=xxx）
==========================================*/

result.addEventListener('click', (e) => {
  if (e.target.closest('.icon-btn')) return;

  const card = e.target.closest('.result-card');
  if (!card) return;

  const id = card.dataset.id;
  if (!id) return;

  input.value = '';
  result.classList.remove('active');
  location.href = `play.html?id=${encodeURIComponent(id)}`;
});
