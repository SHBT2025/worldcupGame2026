# 🏗️ 架构文档

## 整体架构

```
┌─────────────────────────────────────────────┐
│                 index.html                   │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ 赛况首页  │  │ 模拟赛果  │  │ 模拟投注  │   │
│  │ (home)   │  │ (sim)    │  │ (bet)    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │             │          │
│       ▼              ▼             ▼          │
│  ┌─────────────────────────────────────┐     │
│  │          JavaScript 引擎            │     │
│  │  allMatches[]  ← 数据核心           │     │
│  │  calcStandings()  ← 积分计算        │     │
│  │  render*()  ← 渲染函数              │     │
│  │  localStorage  ← 持久化             │     │
│  └─────────────────────────────────────┘     │
│                                              │
│  ┌─────────────────────────────────────┐     │
│  │          CSS 主题系统               │     │
│  │  :root 变量 → 深色足球主题          │     │
│  │  Grid/Flex 响应式布局               │     │
│  └─────────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

## 核心函数调用关系

### 数据获取
```
doRefresh()
  ├── fetch(DATA_URL)
  ├── localStorage.setItem(CACHE_KEY)
  └── renderAll()

loadFromCache()
  └── localStorage.getItem(CACHE_KEY)
```

### 页面渲染
```
renderAll()
  ├── renderGroupTable()     → #gtb
  ├── renderStandings()      → #sg
  ├── renderThirds()         → #td3
  ├── renderKnockout()       → #ktb
  └── renderBetTable()       → #bettb
```

### 积分计算
```
calcStandings(grpName)
  └── 过滤 allMatches → 按组统计 → 排序返回

getAllThirds()
  └── 遍历所有组 → calcStandings() → 取第三名 → 排序
```

### 投注系统
```
addSlip(id, type, label, odds)  → 添加到投注单
confirmBet()                     → 保存到 localStorage
renderHistory()                  → 显示投注历史
updateStats()                    → 更新统计面板
```

## 数据流方向

```
openfootball JSON
     │
     ▼
allMatches[] (内存中)
     │
     ├──► 渲染函数 → DOM
     │
     ├──► calcStandings() → 积分榜
     │
     ├──► 投注系统 → localStorage
     │
     └──► 模拟系统 → localStorage
```

## 样式层级

```
:root 变量 (主题色)
  └── 全局样式 (*, body)
       └── 组件样式 (.hdr, .nav, .tab, .sec, ...)
            └── 响应式 (@media)
```
