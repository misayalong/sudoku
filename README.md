# Cyber Sudoku 🎮

一个具有科技感 UI 的现代 H5 数独游戏，无需登录，打开即玩。

A modern H5 Sudoku game with a futuristic tech-themed UI. No login required - play instantly.

---

## 功能特性 | Features

- 🎯 **三种难度模式** - 简单/中等/困难
- ⏱️ **实时计时器** - 记录游戏时间
- 📝 **笔记模式** - 标记候选数字
- 🔍 **智能高亮** - 选中数字、行、列自动高亮
- ❌ **冲突检测** - 实时检测数字冲突
- 🎉 **胜利弹窗** - 完成游戏时的庆祝动画
- 🎨 **科技感 UI** - 现代化设计，发光动画效果
- ⌨️ **键盘支持** - 完整的键盘操作

- 🎯 **Three Difficulty Levels** - Easy/Medium/Hard
- ⏱️ **Real-time Timer** - Track your gameplay time
- 📝 **Notes Mode** - Mark candidate numbers
- 🔍 **Smart Highlighting** - Auto-highlight selected numbers, rows, and columns
- ❌ **Conflict Detection** - Real-time conflict checking
- 🎉 **Victory Modal** - Celebration animation on completion
- 🎨 **Futuristic UI** - Modern design with glowing animations
- ⌨️ **Keyboard Support** - Full keyboard controls

---

## 技术栈 | Tech Stack

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **TailwindCSS 4** - 实用优先的 CSS 框架
- **JavaScript** - 原生 ES6+

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend build tool
- **TailwindCSS 4** - Utility-first CSS framework
- **JavaScript** - Native ES6+

---

## 安装与运行 | Installation & Run

### 开发模式 | Development

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 生产构建 | Production Build

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

```bash
# Build
npm run build

# Preview build
npm run preview
```

### 使用静态服务器 | Using Static Server

```bash
# 构建后使用 Python
npm run build
cd dist
python3 -m http.server 5175

# 或使用 serve
npm install -g serve
npm run build
serve dist -l 5175
```

```bash
# Use Python after building
npm run build
cd dist
python3 -m http.server 5175

# Or use serve
npm install -g serve
npm run build
serve dist -l 5175
```

---

## 游戏操作 | Game Controls

### 鼠标/触摸 | Mouse/Touch

- **点击格子** - 选中格子
- **点击数字按钮** - 填入数字
- **笔记模式开关** - 切换笔记模式
- **清除按钮** - 清除当前选中格子

- **Click cell** - Select cell
- **Click number button** - Fill number
- **Toggle notes** - Switch to notes mode
- **Clear button** - Clear selected cell

### 键盘快捷键 | Keyboard Shortcuts

| 按键 | 功能 | Key | Function |
|------|------|-----|----------|
| `1-9` | 填入数字 | Fill number |
| `0` / `Delete` / `Backspace` | 清除当前格子 | Clear current cell |
| `N` | 切换笔记模式 | Toggle notes mode |
| `↑` `↓` `←` `→` | 移动选择 | Move selection |

---

## 游戏规则 | Game Rules

数独是一个 9×9 的格子游戏，目标是填满所有格子，同时满足以下条件：

Sudoku is a 9×9 grid puzzle where the goal is to fill all cells following these rules:

1. 每行包含数字 1-9，不重复
2. 每列包含数字 1-9，不重复
3. 每个 3×3 宫格包含数字 1-9，不重复

1. Each row must contain numbers 1-9 without repetition
2. Each column must contain numbers 1-9 without repetition
3. Each 3×3 box must contain numbers 1-9 without repetition

---

## 项目结构 | Project Structure

```
sudoku-h5/
├── src/
│   ├── composables/
│   │   └── useSudoku.js      # 数独核心逻辑
│   ├── App.vue                # 主应用组件
│   ├── main.js                # 应用入口
│   └── style.css              # 全局样式
├── dist/                      # 构建输出目录
├── index.html                 # HTML 模板
├── vite.config.js             # Vite 配置
└── package.json               # 项目配置
```

```
sudoku-h5/
├── src/
│   ├── composables/
│   │   └── useSudoku.js      # Core Sudoku logic
│   ├── App.vue                # Main app component
│   ├── main.js                # App entry point
│   └── style.css              # Global styles
├── dist/                      # Build output
├── index.html                 # HTML template
├── vite.config.js             # Vite config
└── package.json               # Project config
```

---

## 浏览器兼容 | Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 许可证 | License

MIT

---

## 贡献 | Contributing

欢迎提交 Issue 和 Pull Request！

Issues and Pull Requests are welcome!
