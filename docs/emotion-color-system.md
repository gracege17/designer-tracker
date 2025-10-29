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

### 1. 情绪指示器（Flower Shape）
在 Dashboard 中，使用花朵形状的 SVG clipPath 展示多个任务情绪的堆叠：
- 每个任务占据相等的垂直空间
- 颜色从底部向上堆叠
- 使用上述颜色映射自动渲染

**实现位置**: `src/components/Dashboard.tsx`

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

## 🔄 更新历史

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

