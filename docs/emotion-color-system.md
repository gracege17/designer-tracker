# 🎨 设计师情绪分类系统 v1.0（共 16 种情绪）

我们将情绪根据心理能量与情绪极性，分为四大类（四象限模型）：

## 📊 情绪维度定义

| 维度 | 含义 |
|------|------|
| **情绪极性（Valence）** | 积极（Positive） vs 消极（Negative） |
| **能量水平（Arousal）** | 高能（High energy） vs 低能（Low energy） |

---

## ✅ 四大情绪类型（主色域）

| 类型 | 特征 | 主色域 | 代表情绪 |
|------|------|--------|----------|
| **① 热情高涨型** | 高能量 + 积极 | 🔴 暖橘红 `#FF2D55` | Energized, Excited, Proud |
| **② 平和满足型** | 低能量 + 积极 | 💛 柔黄 `#F4C95D` | Happy, Satisfied, Calm, Meaningful |
| **③ 精疲力尽型** | 低能量 + 消极 | ⚫ 灰蓝 `#48484A` | Tired, Drained, Sad, Annoyed |
| **④ 紧张警觉型** | 高能量 + 消极（或中性） | 🟣 紫色 `#AF52DE` | Anxious, Frustrated, Surprised, Curious |
| **⑤ 中性状态（补充）** | 无明显情绪波动 | ⚪ 浅灰 `#E3E3E3` | Neutral, Normal |

---

## 🧠 每个 Emoji 的分类 + 建议颜色

| Emoji | Label | 类型分类 | 建议颜色 | 说明 |
|-------|-------|----------|----------|------|
| 😄 | Happy | 平和满足型② | `#F4C95D` | 稳定正面、轻松愉悦 |
| 🥰 | Calm | 平和满足型② | `#F4C95D` | 宁静、心情安稳 |
| 🤩 | Excited | 热情高涨型① | `#FF2D55` | 情绪高涨，富有激情 |
| 😠 | Frustrated | 紧张警觉型④ | `#AF52DE` | 心理紧张，易爆发 |
| 😢 | Sad | 精疲力尽型③ | `#48484A` | 情绪低落、孤独 |
| 😰 | Anxious | 紧张警觉型④ | `#AF52DE` | 焦虑、紧张不安 |
| 😮 | Surprised | 紧张警觉型④ | `#AF52DE` | 情绪突变、惊讶中性偏负 |
| 😐 | Neutral | 中性状态⑤ | `#E3E3E3` | 情绪稳定、无波动 |
| 🥹 | Nostalgic | 平和满足型② | `#F4C95D` | 柔和、有情感深度 |
| ⚡ | Energized | 热情高涨型① | `#FF2D55` | 高能量，充满活力 |
| 🙂 | Normal | 中性状态⑤ | `#E3E3E3` | 日常平稳状态 |
| 😴 | Tired | 精疲力尽型③ | `#48484A` | 精神疲惫，低能 |
| 😊 | Satisfied | 平和满足型② | `#F4C95D` | 满意、成就感 |
| 😖 | Annoyed | 精疲力尽型③ | `#48484A` | 烦躁、情绪低落 |
| 😫 | Drained | 精疲力尽型③ | `#48484A` | 精力透支、需要恢复 |
| 👏 | Proud | 热情高涨型① | `#FF2D55` | 自豪、有所成就感 |

---

## 🎨 颜色应用场景

### 1. 情绪指示器（Flower Shape）- 每日混合色
在 Dashboard 中，使用花朵形状的 SVG clipPath 展示当日的情绪混合色：
- 根据所有任务的情绪计算每个颜色家族的比例
- 在 RGB 色彩空间中按权重混合颜色
- 生成单一的每日代表色填充花朵形状
- 颜色平滑过渡，视觉效果优雅

**实现位置**: 
- `src/components/Dashboard.tsx` (显示组件)
- `src/utils/emotionColorBlender.ts` (颜色计算服务)

### 2. 情绪雷达图
在 Insights 页面展示一周情绪分布：
- 使用主色域的颜色
- 透明度为 0.6-0.8

### 3. 情绪标签
在任务列表和详情页展示情绪标签时使用对应颜色。

---

## 💡 设计原则

1. **色彩心理学一致性**: 颜色与情绪的心理关联保持一致
2. **可访问性**: 确保颜色对比度符合 WCAG AA 标准
3. **情绪可视化**: 通过颜色直观传达情绪状态
4. **系统一致性**: 在所有组件中使用统一的颜色映射

---

## 📝 技术实现

### 颜色混合算法

**工作原理**:
1. **分组统计**: 遍历当日所有任务，将每个情绪映射到对应的颜色家族
2. **计算比例**: 统计每个颜色家族出现的次数，计算百分比
3. **RGB 混合**: 在 RGB 色彩空间中，按比例对各颜色家族进行加权平均
4. **生成结果**: 将混合后的 RGB 值转换为 Hex 颜色代码

**示例计算**:
```
假设今天有 5 个任务：
- 2 个 Happy (Golden Yellow #F4C95D) = 40%
- 2 个 Excited (Red/Pink #FF2D55) = 40%
- 1 个 Anxious (Purple #AF52DE) = 20%

混合结果：
R = (244 * 0.4 + 255 * 0.4 + 175 * 0.2) = 234.6 ≈ 235
G = (201 * 0.4 + 45 * 0.4 + 82 * 0.2) = 114.8 ≈ 115
B = (93 * 0.4 + 85 * 0.4 + 222 * 0.2) = 115.6 ≈ 116

最终颜色: #EB7374
```

**服务文件**: `src/utils/emotionColorBlender.ts`

### 情绪到颜色的映射（TypeScript）

```typescript
const emotionColorMap: Record<string, string> = {
  // 热情高涨型 ①
  'Excited': '#FF2D55',
  'Energized': '#FF2D55',
  'Proud': '#FF2D55',
  
  // 平和满足型 ②
  'Happy': '#F4C95D',
  'Calm': '#F4C95D',
  'Satisfied': '#F4C95D',
  'Nostalgic': '#F4C95D',
  
  // 精疲力尽型 ③
  'Tired': '#48484A',
  'Drained': '#48484A',
  'Sad': '#48484A',
  'Annoyed': '#48484A',
  
  // 紧张警觉型 ④
  'Anxious': '#AF52DE',
  'Frustrated': '#AF52DE',
  'Surprised': '#AF52DE',
  
  // 中性状态 ⑤
  'Neutral': '#E3E3E3',
  'Normal': '#E3E3E3'
}
```

### 情绪 ID 到标签的映射

```typescript
const emotionLevelMap: Record<number, string> = {
  1: 'Happy',
  2: 'Calm',
  3: 'Excited',
  4: 'Frustrated',
  5: 'Sad',
  6: 'Anxious',
  7: 'Surprised',
  8: 'Neutral',
  9: 'Nostalgic',
  10: 'Energized',
  11: 'Normal',
  12: 'Tired',
  13: 'Satisfied',
  14: 'Annoyed',
  15: 'Drained',
  16: 'Proud'
}
```

---

## 🔧 API 函数

### `calculateDailyColor(entry: Entry | undefined): string`
计算并返回当日的混合情绪颜色（Hex 格式）

**使用示例**:
```typescript
import { calculateDailyColor } from '../utils/emotionColorBlender'

const dailyColor = calculateDailyColor(todayEntry)
// 返回: "#EB7374" (示例)
```

### `calculateColorProportions(entry: Entry | undefined): Record<string, number>`
计算各颜色家族的比例分布

**返回格式**:
```typescript
{
  "#FF2D55": 0.4,  // Red/Pink - 40%
  "#F4C95D": 0.4,  // Golden Yellow - 40%
  "#AF52DE": 0.2   // Purple - 20%
}
```

### `getColorFamilyBreakdown(entry: Entry | undefined): Array<...>`
获取详细的颜色家族分布信息（用于调试或显示）

**返回格式**:
```typescript
[
  {
    color: "#FF2D55",
    proportion: 0.4,
    percentage: "40%",
    familyName: "Red/Pink (热情高涨)"
  },
  // ...
]
```

---

## 🔄 更新历史

**Version 1.1** - October 2025
- ✨ 新增颜色混合算法 (`emotionColorBlender.ts`)
- 🎨 实现每日情绪混合色计算
- 🌸 应用于 Dashboard 花朵形状指示器
- 📊 提供颜色比例分析 API

**Version 1.0** - October 2025
- 初始版本发布
- 定义四象限情绪分类模型
- 建立 16 种情绪的颜色映射系统
- 应用于 Dashboard 花朵形状情绪指示器

---

**相关文档**:
- [Design Style Guide](./design-style.md)
- [Emotional Summary Feature](./emotional-summary-feature.md)
- [Card Design System](./card-design-system.md)

