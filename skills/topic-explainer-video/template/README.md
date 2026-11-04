# Remotion Explainer Template

这是 `topic-explainer-video` skill 的工作模板。当前内容仍是「幽灵塞车」示例，用来保留一套已经跑通的
TTS → 词级 timing → Remotion → 渲染 管线。

## 新视频怎么用

1. 复制整个目录到 `~/demo/<slug>-30s`。
2. 改 `script.json` 的 `title`、`slug` 和 5 句 `scenes[].text`。
3. 生成配音与时间轴：

```bash
python3 -m venv .venv-tts
.venv-tts/bin/pip install -q edge-tts
.venv-tts/bin/python scripts/tts.py
.venv-tts/bin/python scripts/music.py
```

4. 重写 `src/scenes/Scene1.tsx` … `Scene5.tsx`，保留 `src/components/` 和 `src/Video.tsx` 的
   时间线结构。
5. 安装依赖并渲染：

```bash
npm install
npx remotion render Explainer30 out/explainer.mp4 --concurrency=4 \
  --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

## 当前模板里哪些是通用的

- `scripts/tts.py`：读 `script.json`，逐句 TTS，写 `src/timing.json`
- `scripts/music.py`：合成 30 秒环境铺底
- `src/components/Backdrop.tsx` / `SceneShell.tsx` / `Kicker.tsx` / `Caption.tsx` / `Chrome.tsx`
- `src/Video.tsx` 的音频 `<Sequence>` 和场景时间窗计算
- `src/theme.ts` 的字体和颜色 token

## 哪些必须重写

- `script.json` 的文案
- 5 个场景文件
- Kicker 的章节名（现象/放大/传播/解药/结论只是示例）
- 所有 `findCue(scene, "…")` 里的关键词
- `package.json` 里的项目名、输出文件名（可选）
