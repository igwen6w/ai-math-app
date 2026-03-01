# 学前儿童数学游戏 PWA - 开发计划

## 项目概述
制作一个针对 iPad 优化的学前儿童数学学习游戏 PWA 应用。

## 技术栈选择

### 框架：**Next.js 14 + TypeScript**
- 服务端渲染支持
- 内置 PWA 配置
- 优秀的移动端性能
- App Router 支持渐进式增强

### UI 库：**shadcn/ui + Tailwind CSS**
- 美观的现代组件
- 高度可定制
- 优秀的触摸交互支持
- 内置响应式设计

### PWA 配置：**next-pwa**
- 自动生成 Web App Manifest
- Service Worker 缓存策略
- 离线功能支持
- 安装提示优化

## 游戏设计

### 游戏模式

1. **数数游戏** (Counting Game)
   - 显示 1-10 个可爱的物品（水果、动物、星星等）
   - 让孩子点击正确的数字
   - 视觉反馈和音效奖励

2. **简单加减法** (Addition & Subtraction)
   - 使用可视化物品演示运算
   - 例如：🍎🍎 + 🍎 = 3
   - 拖拽交互增加趣味性

3. **数字配对** (Number Matching)
   - 数字与物品数量配对
   - 记忆翻牌游戏形式

4. **大小比较** (Comparison)
   - 哪边更多？
   - 选择 > < = 符号

### iPad 优化要点

- **大按钮设计**：最小 44x44px 触摸区域
- **横竖屏适配**：响应式布局
- **手势支持**：滑动、拖拽交互
- **全屏模式**：隐藏浏览器 UI
- **禁用缩放**：防止误触
- **高对比度**：儿童友好的配色

### PWA 特性

- 可安装到主屏幕
- 离线游戏支持
- 启动画面
- 全屏体验
- 进度持久化（LocalStorage）

## 开发阶段

### Phase 1: 项目初始化 ✓
- 创建 Next.js 项目
- 配置 PWA
- 设置 Tailwind + shadcn/ui
- 基础布局结构

### Phase 2: 核心游戏开发
- 数数游戏
- 加减法游戏
- 数字配对游戏
- 大小比较游戏

### Phase 3: iPad 优化
- 触摸交互优化
- 响应式布局
- 手势支持
- 性能优化

### Phase 4: PWA 完善
- Manifest 配置
- Service Worker
- 离线功能
- 安装提示

### Phase 5: 打磨
- 动画效果
- 音效
- 进度保存
- 多语言支持（中英文）

## 项目结构

```
ai-math-app/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页/菜单
│   ├── globals.css         # 全局样式
│   └── games/
│       ├── counting/
│       ├── arithmetic/
│       ├── matching/
│       └── comparison/
├── components/
│   ├── ui/                 # shadcn/ui 组件
│   └── games/              # 游戏组件
├── public/
│   ├── icons/              # PWA 图标
│   └── sounds/             # 音效文件
├── lib/
│   └── utils.ts
├── manifest.json           # PWA Manifest
└── next.config.js          # PWA 配置
```

## 部署计划

- **GitHub Pages** 或 **Vercel** 托管
- 自动部署 workflow
- 自定义域名支持

## 预计时间

- Phase 1: 30分钟
- Phase 2-3: 2-3小时
- Phase 4-5: 1-2小时
- 总计：约 4-6 小时
