# DS Visualizer - 数据结构与算法可视化

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5-purple?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind-3-cyan?style=for-the-badge&logo=tailwindcss" alt="Tailwind">
</p>

<p align="center">
  <strong>🎓 交互式数据结构与算法可视化学习平台</strong>
</p>

<p align="center">
  通过动画演示深入理解数据结构与算法，让抽象概念变得生动直观
</p>

<p align="center">
  <a href="#-快速开始">快速开始</a> •
  <a href="#-特性">特性</a> •
  <a href="#-支持的数据结构与算法">算法列表</a> •
  <a href="#-架构设计">架构设计</a> •
  <a href="#-贡献">贡献</a>
</p>

---

## 📸 界面预览

<p align="center">
  <img src="docs/images/home.png" alt="首页" width="45%">
  <img src="docs/images/sort.png" alt="排序算法" width="45%">
</p>

> 💡 运行项目后访问 `http://localhost:5173` 查看完整界面

## ✨ 特性

- 🎬 **实时动画** - 流畅的 60fps 动画效果展示算法每一步执行过程
- 📝 **代码同步** - 动画与伪代码高亮同步，深入理解算法逻辑
- 🎮 **交互控制** - 自由控制播放、暂停、步进、速度调节（0.5x - 4x）
- 📊 **自定义输入** - 支持自定义数据输入，验证学习成果
- 🌙 **现代 UI** - 精美的暗色主题界面，毛玻璃效果，沉浸式学习体验
- 📱 **响应式设计** - 完美支持桌面端和移动端
- 🔧 **可扩展架构** - 基于执行器模式，轻松添加新算法

## 📚 支持的数据结构与算法

### 线性表

- [x] 单链表（头插法、尾插法、删除操作）
- [ ] 双向链表
- [ ] 循环链表
- [x] 顺序表操作可视化

### 栈与队列

- [x] 栈（Push/Pop 操作演示）
- [x] 队列（入队/出队操作演示）
- [ ] 循环队列
- [ ] 表达式求值
- [ ] 括号匹配

### 树

- [x] 二叉树遍历（前序、中序、后序、层序）
- [ ] 二叉搜索树（BST）
- [ ] AVL 树旋转
- [ ] 哈夫曼树构造

### 图

- [ ] DFS 深度优先搜索
- [ ] BFS 广度优先搜索
- [ ] Dijkstra 最短路径
- [ ] Floyd 最短路径
- [ ] Prim 最小生成树
- [ ] Kruskal 最小生成树
- [ ] 拓扑排序

### 排序算法

- [x] 冒泡排序
- [x] 选择排序
- [x] 插入排序
- [x] 快速排序
- [ ] 归并排序
- [ ] 堆排序
- [ ] 希尔排序

### 查找算法

- [x] 二分查找（折半查找）
- [ ] 哈希查找
- [ ] 二叉搜索树查找

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **动画**: Framer Motion
- **可视化**: D3.js
- **样式**: Tailwind CSS
- **路由**: React Router 6
- **图标**: Lucide React

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0

### 安装

```bash
# 克隆项目
git clone https://github.com/K-zhaochao/DataStructure.git

# 进入项目目录
cd DataStructure

# 安装依赖
npm install
# 或使用 pnpm
pnpm install
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 打开浏览器访问 http://localhost:5173
```

### 构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📁 项目结构

```
ds-visualizer/
├── public/                  # 静态资源
│   └── vite.svg            # 网站图标
├── src/
│   ├── algorithms/         # 算法执行器
│   │   ├── AlgorithmExecutor.ts    # 执行器基类
│   │   ├── sorting/        # 排序算法
│   │   ├── linkedList/     # 链表算法
│   │   └── tree/           # 树算法
│   ├── components/         # React 组件
│   │   ├── Layout.tsx      # 布局组件
│   │   ├── PlayerControls.tsx      # 播放控制器
│   │   ├── CodePanel.tsx   # 代码面板
│   │   ├── ArrayVisualizer.tsx     # 数组可视化
│   │   ├── LinkedListVisualizer.tsx # 链表可视化
│   │   ├── TreeVisualizer.tsx      # 树可视化
│   │   └── StackQueueVisualizer.tsx # 栈队列可视化
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx        # 首页
│   │   ├── LinearList.tsx  # 线性表页面
│   │   ├── StackQueue.tsx  # 栈队列页面
│   │   ├── TreePage.tsx    # 树页面
│   │   ├── GraphPage.tsx   # 图页面
│   │   ├── SortPage.tsx    # 排序页面
│   │   └── SearchPage.tsx  # 查找页面
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx             # 应用入口
│   ├── main.tsx            # 渲染入口
│   └── index.css           # 全局样式
├── index.html              # HTML 模板
├── package.json            # 项目配置
├── tailwind.config.js      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── vite.config.ts          # Vite 配置
```

## 🎨 架构设计

本项目采用 **算法执行器 + 播放器** 的架构模式：

### 算法执行器 (Algorithm Executor)

- 纯 TypeScript 类，不包含 UI 逻辑
- 算法每一步生成快照 (Snapshot)
- 支持前进、后退、跳转到任意步骤

```typescript
// 执行器基类
abstract class AlgorithmExecutor<T> {
  protected snapshots: Snapshot<T>[] = [];
  
  abstract execute(...args: unknown[]): void;
  
  nextStep(): Snapshot<T> | null;
  prevStep(): Snapshot<T> | null;
  goToStep(step: number): Snapshot<T> | null;
}
```

### 播放器 (Player Controls)

- 读取快照并渲染动画
- 提供播放、暂停、步进控制
- 支持速度调节 (0.5x - 4x)

## 🔧 自定义算法

添加新的算法只需要：

1. 继承 `AlgorithmExecutor` 基类
2. 实现 `execute()` 方法
3. 在关键步骤调用 `addSnapshot()` 记录状态

```typescript
class MyAlgorithm extends AlgorithmExecutor<MySnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'my-algorithm',
    name: '我的算法',
    category: '分类',
    description: '算法描述',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    pseudocode: ['line 1', 'line 2', ...],
  };

  execute(data: number[]): void {
    // 算法逻辑
    this.addSnapshot('步骤描述', snapshotData, highlightedIds, codeLineIndex);
  }
}
```

## 📖 学习资源

### 推荐书籍

| 书籍 | 适合人群 | 推荐指数 |
|------|----------|----------|
| [《数据结构（C语言版）》- 严蔚敏](https://book.douban.com/subject/24699581/) | 初学者 | ⭐⭐⭐⭐⭐ |
| [《算法导论》](https://book.douban.com/subject/20432061/) | 进阶学习 | ⭐⭐⭐⭐⭐ |
| [《算法（第4版）》- Robert Sedgewick](https://book.douban.com/subject/19952400/) | 实践应用 | ⭐⭐⭐⭐ |
| [《大话数据结构》](https://book.douban.com/subject/6424904/) | 轻松入门 | ⭐⭐⭐⭐ |

### 在线资源

- [LeetCode 力扣](https://leetcode.cn/) - 算法刷题平台
- [VisuAlgo](https://visualgo.net/) - 数据结构可视化
- [Algorithm Visualizer](https://algorithm-visualizer.org/) - 算法可视化
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/) - 时间复杂度速查表

## 🎯 学习路线

```
基础阶段                    进阶阶段                    高级阶段
   │                          │                          │
   |—— 数组与链表              |—— 二叉搜索树              |—— 红黑树
   |—— 栈与队列                |—— AVL树                  |—— B树/B+树
   |—— 简单排序                |—— 堆与优先队列            |—— 图的高级算法
   └── 二分查找                |—— 高级排序                └── 动态规划
                              └── 基础图算法
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 添加新算法

如果你想贡献新的算法可视化，请参考以下步骤：

1. 在 `src/algorithms/` 下创建新的算法执行器
2. 在 `src/types/index.ts` 中定义快照类型
3. 创建或复用可视化组件
4. 在对应页面中集成

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件使用函数式写法
- 算法需要包含完整的元数据（复杂度、伪代码等）

## 📄 License

[GPL-3.0](LICENSE) - 可自由使用、修改和分发

## 🙏 致谢

- [React](https://react.dev/) - 用户界面库
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 图标库
- 所有数据结构与算法学习者的启发

---

<p align="center">
  Made with ❤️ for learning Data Structures and Algorithms
</p>

<p align="center">
  如果这个项目对你有帮助，请给一个 ⭐ Star 支持一下！
</p>
