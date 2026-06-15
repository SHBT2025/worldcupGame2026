# 项目记忆 - 2026世界杯竞猜游戏

> 最后更新: 2026-06-15

## 技术决策

### PWA 实现
- **manifest.json**: display=standalone, 背景色 #0A0E1A, 主题色 #FFD700
- **sw.js**: 网络优先策略，预缓存核心资源，离线时使用缓存
- **图标**: 从 512.png 用 ffmpeg 缩放生成 48/72/96/144/192/512 六种尺寸
- **iOS 支持**: apple-touch-icon + apple-mobile-web-app-capable meta 标签

### 缓存策略
- Service Worker 使用"网络优先"策略
- 外部 API 请求（非本域）只在失败时回退缓存
- 本地静态资源正常缓存

## 注意事项
- 修改 index.html 后需要更新 sw.js 中的 CACHE_NAME 版本号，否则浏览器不会更新缓存
- 当前 sw.js 版本: worldcup2026-v1
- 512.png 保留为原始图标源文件，不可删除
- 测试 PWA 时建议用 Chrome DevTools -> Application -> Service Workers 面板

## 文件说明
| 文件 | 用途 |
|------|------|
| 512.png | 原始图标源文件 (1928KB) |
| icon-*.png | 各尺寸 PWA 图标 |
| manifest.json | PWA 清单文件 |
| sw.js | Service Worker 缓存策略 |
