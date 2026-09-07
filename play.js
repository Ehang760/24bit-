/*==========================================
  播放页逻辑（play.html）— 完整版
  - 读取 URL 参数 ?id=xxx，从 SEARCH_DATA 取对应歌曲
  - 播放器交互：播放/暂停、进度条、歌词滚动
  - 歌词高亮用 requestAnimationFrame 驱动
  - 上一首 / 下一首切换
  - 播放进度记忆（localStorage，按歌曲 id 区分）
  - 键盘快捷键：空格 播放/暂停，← → 快进快退，Ctrl+← → 切歌
  - 右下角快捷键提示浮层
  - 【已修改】歌曲播完自动暂停 + 进度条重置 + 点播放键重新播放
==========================================*/

(function () {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const player = document.getElementById('player');
  const playBtn = document.getElementById('playBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressFill = document.getElementById('progressFill');
  const progress = document.getElementById('progress');
  const timeEl = document.getElementById('time');
  const audio = document.getElementById('audio');
  const lyricsEl = document.getElementById('lyrics');

  const coverText = document.getElementById('coverText');
  const coverSub = document.getElementById('coverSub');
  const songTitle = document.getElementById('songTitle');
  const artistEl = document.getElementById('artist');

  // ===== 默认歌词（无匹配时使用）=====
  const defaultLrc = ``;

  let lyrics = [];
  let playing = false;
  let currentSong = null; // 当前歌曲对象引用

  // ===== 播放列表（只保留有音频的歌）=====
  let playlist = [];
  let currentIndex = 0;

  // ===== rAF 歌词同步相关状态 =====
  let lastLyricIdx = -1;
  let lineEls = null;
  let rafId = null;

  // ===== 快捷键提示浮层 =====
  const hint = document.getElementById('shortcutHint');
  const hintText = document.getElementById('hintText');
  let hintTimer = null;

  function showHint(text) {
    if (!hint || !hintText) return;
    hintText.textContent = text;
    hint.classList.add('show', 'flash');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      hint.classList.remove('show', 'flash');
    }, 1200);
  }

  // ===== 解析 LRC =====
  function parseLRC(text) {
    const lines = text.trim().split('\n');
    const result = [];
    const regex = /\[(\d+):(\d+\.\d+)\](.*)/;
    lines.forEach(line => {
      const match = line.match(regex);
      if (match) {
        const min = parseInt(match[1]);
        const sec = parseFloat(match[2]);
        const t = match[3].trim();
        result.push([min * 60 + sec, t]);
      }
    });
    return result;
  }

  function renderLyrics() {
    lyricsEl.innerHTML = '';
    lyrics.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'lyric-line';
      div.textContent = item[1];
      div.dataset.index = i;
      lyricsEl.appendChild(div);
    });
    lineEls = lyricsEl.children;
    lastLyricIdx = -1;
    // 重置滚动位置
    lyricsEl.style.transform = 'translateY(0)';
  }

  function fmt(s) {
    s = Math.max(0, Math.floor(s));
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  }

  function updateUI() {
    const total = audio.duration || 0;
    const current = audio.currentTime;
    const percent = total ? (current / total) * 100 : 0;
    progressFill.style.width = percent + '%';
    timeEl.textContent = `${fmt(current)} / ${fmt(total)}`;
  }

  // ===== rAF 驱动歌词高亮 =====
  function syncLyricsLoop() {
    const current = audio.currentTime;
    let activeIdx = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (current >= lyrics[i][0]) activeIdx = i;
      else break;
    }
    if (activeIdx !== lastLyricIdx) {
      if (lineEls && lineEls[lastLyricIdx]) {
        lineEls[lastLyricIdx].classList.remove('active');
      }
      if (lineEls && lineEls[activeIdx]) {
        lineEls[activeIdx].classList.add('active');
      }
      lastLyricIdx = activeIdx;

      const activeLine = lineEls ? lineEls[activeIdx] : null;
      if (activeLine) {
        const wrapHeight = 140;
        const lineHeight = 32;
        const offset = activeLine.offsetTop + lineHeight / 2 - wrapHeight / 2;
        lyricsEl.style.transform = `translateY(${-offset}px)`;
      }
    }
    rafId = requestAnimationFrame(syncLyricsLoop);
  }

  function startLyricsSync() {
    if (rafId) return;
    lastLyricIdx = -1;
    rafId = requestAnimationFrame(syncLyricsLoop);
  }

  function stopLyricsSync() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // ===== 更新播放/暂停按钮图标 =====
  function updatePlayIcon() {
    if (!playBtn) return;
    playBtn.innerHTML = playing
      ? `<svg viewBox="0 0 24 24">
           <rect x="7" y="5" width="3.5" height="14" rx="1" fill="#fff"/>
           <rect x="13.5" y="5" width="3.5" height="14" rx="1" fill="#fff"/>
         </svg>`
      : `<svg viewBox="0 0 24 24"><path fill="#fff" d="M8 5v14l11-7z"/></svg>`;
  }

  function togglePlay() {
    if (!audio.src) return;
    playing = !playing;
    if (playing) {
      audio.play();
      player.classList.add('playing');
      startLyricsSync();
    } else {
      audio.pause();
      player.classList.remove('playing');
      stopLyricsSync();
    }
    updatePlayIcon();
    saveProgress(); // 保存进度
  }

  // ===== 加载指定歌曲 =====
  function loadSong(song) {
    if (!song) return;
    currentSong = song;

    const downloadBtn = document.getElementById('downloadBtn');

if (downloadBtn) {
  if (song.audio) {
    downloadBtn.href = song.audio;
    downloadBtn.download = `${song.artist}-${song.title}.mp3`;
    downloadBtn.style.display = 'inline-flex';
  } else {
    downloadBtn.style.display = 'none';
  }
}
  // 下面保留你原来的封面/标题/音频赋值代码



    // 更新文字
    if (songTitle) songTitle.textContent = song.title;
    if (artistEl) artistEl.innerHTML = `${song.artist}&nbsp;&nbsp;[${song.title}]`;
    if (coverText) coverText.textContent = song.title && song.title.length > 4 ? song.title.slice(0, 4) : (song.title || '');
    if (coverSub) coverSub.textContent = song.artist;

    // 加载对应封面（每首歌自动换封面）
    const coverImg = document.getElementById('coverImg');
    if (coverImg && song.cover) {
      coverImg.src = song.cover;
    }

    // 歌词
    lyrics = parseLRC(song.lrc && song.lrc.trim() ? song.lrc : defaultLrc);
    renderLyrics();
    
    // 音频源
    if (song.audio) {
      audio.src = song.audio;
      audio.load();
      // 读取该歌曲的进度记忆
      const savedTime = localStorage.getItem('playTime_' + song.id);
      if (savedTime) audio.currentTime = parseFloat(savedTime);
      updateUI();
    } else {
      audio.removeAttribute('src');
      timeEl.textContent = '00:00 / 00:00';
    }

    // 重置播放状态（不自动播放，等用户点）
    stopLyricsSync();
    playing = false;
    player.classList.remove('playing');
    updatePlayIcon();
  }

  // ===== 上一首 / 下一首 =====
  function playPrev() {
    if (!playlist.length) return;
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadSong(playlist[currentIndex]);
    // 切歌后若之前在播放则继续播放
    if (playing) {
      audio.play();
      player.classList.add('playing');
      startLyricsSync();
    }
    showHint('⏮ 上一首');
  }

  function playNext() {
    if (!playlist.length) return;
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(playlist[currentIndex]);
    if (playing) {
      audio.play();
      player.classList.add('playing');
      startLyricsSync();
    }
    showHint('⏭ 下一首');
  }

  // ===== 进度记忆 =====
  function saveProgress() {
    if (currentSong && currentSong.id != null && audio.duration) {
      localStorage.setItem('playTime_' + currentSong.id, audio.currentTime);
    }
  }
  
  // ===== 构建播放列表（所有有音频的歌）=====
  function buildPlaylist(currentId) {
    playlist = SEARCH_DATA.filter(s => s.audio);
    currentIndex = 0;
    if (currentId != null) {
      const idx = playlist.findIndex(s => s.id === currentId);
      if (idx >= 0) currentIndex = idx;
    }
  }

  // ===== 初始化 =====
  buildPlaylist(id);
  const song = SEARCH_DATA.find(it => it.id === id);
  if (song) {
    loadSong(song);
  } else {
    lyrics = parseLRC(defaultLrc);
    renderLyrics();
    updateUI();
    console.warn('未找到 id=' + id + ' 的歌曲，显示默认内容');
  }

  // ===== 事件绑定 =====
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (prevBtn) prevBtn.addEventListener('click', playPrev);
  if (nextBtn) nextBtn.addEventListener('click', playNext);

  if (progress) {
    progress.addEventListener('click', (e) => {
      const rect = progress.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      if (audio.duration) audio.currentTime = ratio * audio.duration;
      updateUI();
      lastLyricIdx = -1;
      saveProgress();
    });
  }

  audio.addEventListener('loadedmetadata', updateUI);
  
  // 进度条 + 持续保存进度
  audio.addEventListener('timeupdate', () => {
    updateUI();
    saveProgress();
  });

  // ===== 歌曲播完：暂停 + 进度条重置 + 可重新播放 =====
  audio.addEventListener('ended', () => {
    playing = false;
    player.classList.remove('playing');
    updatePlayIcon();
    stopLyricsSync();

    // 进度条 & 时间归零
    audio.currentTime = 0;
    updateUI();

    // 歌词回到第一行
    lastLyricIdx = -1;
    lyricsEl.style.transform = 'translateY(0)';
    if (lineEls && lineEls.length) {
      [...lineEls].forEach(l => l.classList.remove('active'));
      lineEls[0].classList.add('active');
    }

    showHint('⏹ 播放结束');
    // 此时再点播放键，togglePlay() 会从 0 秒重新播放
  });
  
  // ===== 键盘快捷键 =====
  document.addEventListener('keydown', (e) => {
    // 输入框内不拦截
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        showHint(playing ? '▶ 播放' : '⏸ 暂停');
        break;
      case 'ArrowLeft':
        if (e.ctrlKey) {
          e.preventDefault();
          playPrev();
        } else {
          e.preventDefault();
          audio.currentTime = Math.max(0, audio.currentTime - 5);
          updateUI();
          lastLyricIdx = -1;
          showHint('⏪ 后退 5 秒');
        }
        break;
      case 'ArrowRight':
        if (e.ctrlKey) {
          e.preventDefault();
          playNext();
        } else {
          e.preventDefault();
          audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
          updateUI();
          lastLyricIdx = -1;
          showHint('⏩ 前进 5 秒');
        }
        break;
    }
  });
})();
