# leafer-x-effect-text

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

一个功能强大的 Leafer UI 特效文字插件，支持多层文字特效叠加，实现描边、阴影、渐变等丰富的视觉效果。

## ✨ 特性

- 🎨 **多层特效叠加** - 支持无限层文字特效组合
- 📐 **响应式偏移** - 特效偏移随字体大小自动缩放
- 🎯 **精确控制** - 独立控制每层的填充、描边、偏移
- 🚀 **高性能渲染** - 优化的渲染机制，流畅的交互体验
- 🔧 **完全可配置** - 支持纯色、渐变、描边等丰富配置
- 📦 **轻量无依赖** - 仅依赖 Leafer UI 核心库

## 📦 安装

```bash
# npm
npm install leafer-x-effect-text

# pnpm
pnpm add leafer-x-effect-text

# yarn
yarn add leafer-x-effect-text
```

## 🚀 快速开始

### 基础使用

```typescript
import { App } from 'leafer-ui'
import { EffectText } from 'leafer-x-effect-text'

const app = new App({ view: 'app' })

const text = new EffectText({
  text: '特效文字',
  fontSize: 48,
  x: 100,
  y: 100,
  fill: '#ff4400',
  textEffects: [
    {
      visible: true,
      offset: { x: 3, y: 3 },
      fill: '#000000',
      stroke: {
        type: 'solid',
        color: '#ffffff',
        style: { strokeWidth: 2 }
      }
    }
  ]
})

app.tree.add(text)
```

<img alt="基础特效.png" src="images/%E5%9F%BA%E7%A1%80%E7%89%B9%E6%95%88.png" width="200"/>

### 渐变填充特效

```typescript
const text = new EffectText({
  text: '渐变文字',
  fontSize: 64,
  fill: '#f40',
  textEffects: [
    {
      visible: true,
      offset: { x: 0, y: 10 },
      fill: {
        type: 'linear',
        from: { x: 0, y: 0.5, type: 'percent' },
        to: { x: 1, y: 0.5, type: 'percent' },
        stops: [
          { offset: 0, color: '#ff0000' },
          { offset: 1, color: '#ffff00' }
        ]
      },
      stroke: {
        type: 'solid',
        color: '#ffffff',
        style: { strokeWidth: 3, strokeJoin: 'round' }
      }
    }
  ],
  editable: true
})
```

<img alt="渐变填充.png" src="images/%E6%B8%90%E5%8F%98%E5%A1%AB%E5%85%85.png" width="200"/>

### 多层特效叠加

```typescript
const text = new EffectText({
  text: '多层特效',
  fontSize: 72,
  fill: '#ff4400',
  textEffects: [
    // 底层阴影
    {
      visible: true,
      offset: { x: 5, y: 5 },
      fill: 'rgba(0, 0, 0, 0.5)'
    },
    // 外描边
    {
      visible: true,
      offset: { x: 0, y: 0 },
      stroke: {
        type: 'solid',
        color: '#ffffff',
        style: { strokeWidth: 8 }
      }
    },
    // 内描边
    {
      visible: true,
      offset: { x: 0, y: 0 },
      stroke: {
        type: 'solid',
        color: '#000000',
        style: { strokeWidth: 4 }
      }
    }
  ]
})
```

<img alt="多层特效.png" src="images/%E5%A4%9A%E5%B1%82%E7%89%B9%E6%95%88.png" width="200"/>

## 📖 API 文档

### EffectText 属性

继承自 Leafer UI 的 `Text` 组件，拥有所有 Text 属性，并额外支持：

| 属性            | 类型              | 说明     |
|---------------|-----------------|--------|
| `textEffects` | `ITextEffect[]` | 特效配置数组 |

### ITextEffect 配置

| 属性        | 类型              | 默认值    | 说明             |
|-----------|-----------------|--------|----------------|
| `visible` | `boolean`       | `true` | 是否显示该特效层       |
| `offset`  | `IEffectOffset` | -      | 偏移配置           |
| `fill`    | `IPaint`        | -      | 填充配置（支持纯色、渐变等） |
| `stroke`  | `IStrokePaint`  | -      | 描边配置           |

### IEffectOffset 配置

| 属性        | 类型        | 默认值    | 说明       |
|-----------|-----------|--------|----------|
| `visible` | `boolean` | `true` | 是否启用偏移   |
| `x`       | `number`  | `0`    | 水平偏移（像素） |
| `y`       | `number`  | `0`    | 垂直偏移（像素） |

## 🎯 核心特性

### 响应式偏移

特效偏移会根据字体大小自动缩放，保持视觉比例一致：

```typescript
const text = new EffectText({
  text: '响应式特效',
  fontSize: 36, // 基准字体大小
  textEffects: [
    { offset: { x: 10, y: 10 } } // 基于 fontSize: 36 的偏移
  ]
})

// 改变字体大小时，offset 会自动缩放
text.fontSize = 72 // offset 自动变为 { x: 20, y: 20 }
text.fontSize = 18 // offset 自动变为 { x: 5, y: 5 }
```

### 视图变换支持

完美支持视图滚动、缩放、旋转、翻折等变换的渲染，支持默认的文本编辑

<img alt="翻折效果" src="images/翻折.png" width="200"/>

## 💡 使用场景

- 🎮 游戏标题文字
- 🎨 艺术设计海报
- 📱 应用界面装饰
- 🎬 视频封面文字
- 🏷️ 品牌 Logo 文字
- 📊 数据可视化标注

## 🔗 相关链接

- [在线演示](https://leafer-x-effect-text.vercel.app/)
- [Leafer UI 文档](https://www.leaferjs.com/ui/guide/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## License

[MIT](./LICENSE) License © 2024-PRESENT [XiaDeYu](https://github.com/Xdy1579883916)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/leafer-x-effect-text?style=flat&colorA=080f12&colorB=1fa669

[npm-version-href]: https://npmjs.com/package/leafer-x-effect-text

[npm-downloads-src]: https://img.shields.io/npm/dm/leafer-x-effect-text?style=flat&colorA=080f12&colorB=1fa669

[npm-downloads-href]: https://npmjs.com/package/leafer-x-effect-text

[bundle-src]: https://img.shields.io/bundlephobia/minzip/leafer-x-effect-text?style=flat&colorA=080f12&colorB=1fa669&label=minzip

[bundle-href]: https://bundlephobia.com/result?p=leafer-x-effect-text

[license-src]: https://img.shields.io/github/license/Xdy1579883916/leafer-x-effect-text.svg?style=flat&colorA=080f12&colorB=1fa669

[license-href]: https://github.com/Xdy1579883916/leafer-x-effect-text/blob/master/LICENSE
