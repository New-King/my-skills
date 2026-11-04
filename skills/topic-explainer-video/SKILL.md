---
name: topic-explainer-video
description: 用户给出一个主题、要一段带配音/字幕/BGM 的科普或解释短视频时使用。默认直接做成 30 秒 16:9 中文 MP4；不追问风格、受众、细节，除非信息真的不足。
whenToUse: 用户说“做一个科普视频”“解释一下 X”“把 X 讲清楚”“30 秒动画”“做个视频讲明白……”等。
---

# 主题解释视频

## 第一原则：给主题就开做

用户给一个主题，默认目标就是**直接交付一条能看的成片**，不是先做需求访谈。

不要问这些问题，它们都有默认答案：

- 受众是谁 → 默认普通成年人/泛知识受众
- 什么风格 → 默认深色编辑部/科技感，暖白字 + 琥珀/红/青绿点缀
- 要不要字幕 → 默认要，底部卡拉 OK 式字幕
- 用什么音色 → 默认 `zh-CN-XiaoxiaoNeural`，语速 `+5%`
- 多长 → 默认 30 秒
- 要不要 BGM → 默认要，低音量环境铺底
- 文案多少字 → 默认 125–150 个汉字，最后一句在 28 秒前说完

**只有以下情况才值得问用户：**

1. 主题本身无法确定，例如只说“做个视频”而没有主题。
2. 用户给的材料互相矛盾，且无法判断以哪份为准。
3. 涉及高风险事实（医疗、法律、投资、安全操作），且检索不到可靠来源。
4. 用户提出硬约束，但默认值明显不适用，例如明确要 4K、竖屏、英文、10 分钟。

其余情况一律自行取默认值，继续做。交付时用一句话列出“本次假设”，不要在做之前反复确认。

## 内容深度：由用户给的信息量决定

- **只给主题**：按主流、可靠的通识写；需要数字或最新事实时做 2–4 次检索；不编造具体统计。30 秒只讲一个核心机制。
- **给了文章/链接/数据**：以用户材料为主，不改变其立场；补充必要背景，不引入冲突说法。
- **给了很长的材料**：不要全塞进去。选一个最值得解释的因果链，其余舍弃。
- **主题很宽**（“物理”“AI”“经济”）：自己收窄成一个具体问题，例如“为什么天空是蓝的”，并在交付时说明收窄了什么。
- **高风险主题**：只做通用科普，不提供个体诊断/操作建议；必要时在画面角落加一句“通用科普，不构成建议”。

## 默认成片规格

| 项目 | 默认 |
| --- | --- |
| 时长 | 30.0 秒 / 900 帧 |
| 画幅 | 1920×1080，16:9 |
| 帧率 | 30fps |
| 语言 | 普通话 |
| 配音 | Edge TTS `zh-CN-XiaoxiaoNeural`，`+5%` |
| 字幕 | 烧录，底部词级高亮 |
| 音乐 | 合成环境铺底，约 -16 LUFS 整体 |
| 交付 | `~/demo/<slug>-30s/`，含 mp4、poster、源码、README |

## 五段脚本公式

默认 5 句、5 个场景，目标 125–150 字：

1. **钩子/定义**：反常识现象或一句定义。
2. **机制起点**：一个最小原因，越具体越好。
3. **放大/传播**：这个原因如何变成更大的结果。
4. **解法/纠偏**：一个可执行的动作，或一个常见误解。
5. **结论**：把话题收回到人/系统/节奏，给一句记得住的话。

写作要求：

- 像说话，不像论文；避免“首先、其次、综上所述”。
- 一句一个意思；每句 20–35 字。
- 数字必须准确；不确定就用“大约/往往”，不要伪造。
- 最后一句必须在 28 秒前说完；不够就删，不要加速到听不清。
- 画面文案和配音不要逐字重复；字幕负责逐字，画面负责关键词。

## 生产流程

### 0. 建目录

```bash
SLUG=my-topic
DEST=~/demo/${SLUG}-30s
cp -R ~/.dsh/skills/topic-explainer-video/template "$DEST"
cd "$DEST"
```

如果 `~/demo` 不可写，改用当前 workspace，并在交付时说明。

### 1. 写 `script.json`

只改 `title`、`slug`、`scenes[].text`。时长、音色、语速、gain 先用默认值。

### 2. 生成配音和时间轴

```bash
python3 -m venv .venv-tts
.venv-tts/bin/pip install -q edge-tts
.venv-tts/bin/python scripts/tts.py
.venv-tts/bin/python scripts/music.py
```

`scripts/tts.py` 会逐句生成 `public/audio/s*.wav`，读取 WordBoundary 词级时间戳，裁掉句尾静音，做增益，然后写 `src/timing.json` 和 `NARRATION.md`。

检查输出的 `endsAt`：如果大于 `duration - 0.3`，先删字，不要硬压。

### 3. 做画面

模板里的 `src/scenes/Scene1.tsx` … `Scene5.tsx` 目前是「幽灵塞车」的工作示例。**保留管线，重写内容**：

- 保留：`src/index.ts`、`Root.tsx`、`Video.tsx` 的时间线结构、`components/` 的外壳、`Caption`、`Chrome`。
- 重写：5 个场景、Kicker 的章节名、关键词、配色重点。
- 不要复用汽车/道路，除非主题真的适合交通隐喻。

优先复用这 5 种镜头：

1. **大标题/定义**：巨字 + 一句定义 + 一个主视觉。
2. **机制链**：3–4 个节点，箭头连接，按词时间逐个点亮。
3. **场/波**：大量小点/粒子/车辆，一条移动的边界或波前。
4. **前后对比**：左右或上下分区，红/青绿对照。
5. **结论**：一句大字 + 一条从锯齿变平的线/从乱到齐的阵列。

每个场景只讲一件事，最多两个文字块；动画元素控制在 2–3 个，不要满屏。

### 4. 渲染

```bash
npm install
npx remotion still Explainer30 out/check.png --frame=150 \
  --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

先半分辨率渲染一版检查节奏：

```bash
npx remotion render Explainer30 out/draft.mp4 --scale=0.5 --concurrency=4 \
  --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

确认后出 1080p：

```bash
npx remotion render Explainer30 out/explainer.mp4 --concurrency=4 \
  --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

如果本机没有 Chrome，去掉 `--browser-executable`，让 Remotion 自己下载 Headless Shell；下载慢时不要反复重试，优先找本机 Chrome。

## 声画同步契约

- `script.json` 是唯一文案源；`src/timing.json` 由 `scripts/tts.py` 生成，**不要手改时间戳**。
- 场景起点、配音 `<Sequence>`、字幕高亮都读同一份 timing。
- 场景画面比配音提前约 0.10 秒出现，字幕在切换点前约 0.12 秒切换；不要改成大交叉淡化，容易出现双曝光。
- 动画关键点用 `findCue(scene, "关键词")` 取词时间，例如“轻刹车”“更重”“什么都没有”。
- 改了某句文案，必须同步改所有引用该句关键词的 cue；否则 `findCue` 会返回 0，动画会在开头误触发。
- 最后一句的最后一个词必须早于 28.6 秒；否则删字。

## QA 清单

交付前逐项过：

- [ ] 视频 900 帧 / 30.0 秒，有音频流。
- [ ] 整体响度约 -16 LUFS（±1），真峰值低于 -1 dBTP。
- [ ] 最后一句在 28.6 秒前说完，片尾留 1–2 秒。
- [ ] 抽 6 帧检查：0.5s、5s、10s、14s、21s、27s。
- [ ] 字幕不溢出、不被裁切；关键词高亮和配音一致。
- [ ] 大标题没有裁字、没有双曝光、没有超过 0.5 秒的全黑/空白场景。
- [ ] 每个场景只有一个视觉中心，手机尺寸下也能看清。
- [ ] 事实/数字没有编造；高风险主题有边界说明。

可用 Remotion 自带的 ffmpeg 量响度：

```bash
FF=node_modules/@remotion/compositor-darwin-arm64/ffmpeg
DYLD_LIBRARY_PATH=node_modules/@remotion/compositor-darwin-arm64 \
  "$FF" -hide_banner -nostats -i out/explainer.mp4 -vn \
  -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -ar 48000 /tmp/loud.wav
```

## 失败处理

- **Chrome Headless 下载卡住**：用 `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`，不要等。
- **edge-tts 网络失败**：重试一次；仍失败就明确告诉用户“配音服务不可用”，不要假装有配音。
- **没有 WordBoundary**：检查 `edge-tts` 版本（需要 7+）和 `boundary="WordBoundary"`。
- **字体不对**：使用 `Hiragino Sans GB`、`PingFang SC`、`Noto Sans SC` 回退链。
- **音频削波**：把 `script.json` 的 `gain` 从 1.55 降到 1.35，重新生成。
- **旁白太长**：删字，不要简单提高语速；30 秒塞不下就砍到 4 句。

## 交付

默认把成片复制到 `~/demo/<slug>-30s/`，至少包含：

- `out/explainer.mp4`
- `out/poster.png`（代表性帧，不要黑场）
- `README.md`、`script.json`、`src/`、`scripts/`

最终回复只讲：

1. 目录和成片链接
2. 时长/画幅/配音语言
3. 本次自行做的 1–3 个假设
4. 一句“如果要改，告诉我主题或文案即可”

不要写长篇制作过程，也不要在交付后追问“要不要调整风格”。
