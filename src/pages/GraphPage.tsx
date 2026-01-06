import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Network, Route, TreePine, ListOrdered, BookOpen, AlertTriangle, Lightbulb, GitBranch, Compass, Database, Share2 } from 'lucide-react';
import GraphVisualizer from '../components/GraphVisualizer';
import PlayerControls from '../components/PlayerControls';
import CodePanel from '../components/CodePanel';
import {
  DFSExecutor,
  BFSExecutor,
  DijkstraExecutor,
  PrimExecutor,
  TopologicalSortExecutor,
  GraphSnapshot,
  GraphNode,
  GraphEdge,
} from '../algorithms/graph';
import { Snapshot } from '../types';

type GraphAlgorithm = 'dfs' | 'bfs' | 'dijkstra' | 'prim' | 'topological';

// 示例图数据 - 普通无向图
const defaultNodes: GraphNode[] = [
  { id: 'A', label: 'A', x: 100, y: 100, state: 'default' },
  { id: 'B', label: 'B', x: 250, y: 60, state: 'default' },
  { id: 'C', label: 'C', x: 400, y: 100, state: 'default' },
  { id: 'D', label: 'D', x: 100, y: 250, state: 'default' },
  { id: 'E', label: 'E', x: 250, y: 200, state: 'default' },
  { id: 'F', label: 'F', x: 400, y: 250, state: 'default' },
  { id: 'G', label: 'G', x: 250, y: 340, state: 'default' },
];

const defaultEdges: GraphEdge[] = [
  { from: 'A', to: 'B', weight: 4, state: 'default' },
  { from: 'A', to: 'D', weight: 2, state: 'default' },
  { from: 'B', to: 'C', weight: 3, state: 'default' },
  { from: 'B', to: 'E', weight: 5, state: 'default' },
  { from: 'C', to: 'F', weight: 6, state: 'default' },
  { from: 'D', to: 'E', weight: 1, state: 'default' },
  { from: 'D', to: 'G', weight: 7, state: 'default' },
  { from: 'E', to: 'F', weight: 4, state: 'default' },
  { from: 'E', to: 'G', weight: 3, state: 'default' },
  { from: 'F', to: 'G', weight: 2, state: 'default' },
];

// 有向无环图 (DAG) 用于拓扑排序
const dagNodes: GraphNode[] = [
  { id: 'A', label: 'A', x: 100, y: 180, state: 'default' },
  { id: 'B', label: 'B', x: 200, y: 80, state: 'default' },
  { id: 'C', label: 'C', x: 200, y: 280, state: 'default' },
  { id: 'D', label: 'D', x: 320, y: 180, state: 'default' },
  { id: 'E', label: 'E', x: 440, y: 80, state: 'default' },
  { id: 'F', label: 'F', x: 440, y: 280, state: 'default' },
  { id: 'G', label: 'G', x: 540, y: 180, state: 'default' },
];

const dagEdges: GraphEdge[] = [
  { from: 'A', to: 'B', state: 'default' },
  { from: 'A', to: 'C', state: 'default' },
  { from: 'B', to: 'D', state: 'default' },
  { from: 'C', to: 'D', state: 'default' },
  { from: 'D', to: 'E', state: 'default' },
  { from: 'D', to: 'F', state: 'default' },
  { from: 'E', to: 'G', state: 'default' },
  { from: 'F', to: 'G', state: 'default' },
];

const algorithmInfo: Record<GraphAlgorithm, { name: string; description: string; icon: React.ReactNode }> = {
  dfs: {
    name: '深度优先搜索 (DFS)',
    description: '一条路走到黑，撞墙了再回溯',
    icon: <Network size={18} />,
  },
  bfs: {
    name: '广度优先搜索 (BFS)',
    description: '先访问所有邻居，再访问邻居的邻居',
    icon: <Network size={18} />,
  },
  dijkstra: {
    name: 'Dijkstra 最短路径',
    description: '贪心策略计算单源最短路径',
    icon: <Route size={18} />,
  },
  prim: {
    name: 'Prim 最小生成树',
    description: '加点法，每次选最小权边',
    icon: <TreePine size={18} />,
  },
  topological: {
    name: '拓扑排序',
    description: '将 DAG 顶点排成线性序列',
    icon: <ListOrdered size={18} />,
  },
};

export default function GraphPage() {
  const [algorithm, setAlgorithm] = useState<GraphAlgorithm>('dfs');
  const [startNode, setStartNode] = useState('A');
  const [endNode, setEndNode] = useState('G');
  const [currentStep, setCurrentStep] = useState(0);
  const [isExecuted, setIsExecuted] = useState(false);

  // 根据算法选择合适的图数据
  const { nodes, edges } = useMemo(() => {
    if (algorithm === 'topological') {
      return { nodes: dagNodes, edges: dagEdges };
    }
    return { nodes: defaultNodes, edges: defaultEdges };
  }, [algorithm]);

  const executor = useMemo(() => {
    switch (algorithm) {
      case 'dfs': return new DFSExecutor();
      case 'bfs': return new BFSExecutor();
      case 'dijkstra': return new DijkstraExecutor();
      case 'prim': return new PrimExecutor();
      case 'topological': return new TopologicalSortExecutor();
      default: return new DFSExecutor();
    }
  }, [algorithm]);

  const handleReset = useCallback(() => {
    executor.reset();
    setCurrentStep(0);
    setIsExecuted(false);
  }, [executor]);

  const handleRun = useCallback(() => {
    const nodesCopy = nodes.map(n => ({ ...n }));
    const edgesCopy = edges.map(e => ({ ...e }));
    
    if (algorithm === 'topological') {
      (executor as TopologicalSortExecutor).execute(nodesCopy, edgesCopy);
    } else if (algorithm === 'dijkstra') {
      (executor as DijkstraExecutor).execute(nodesCopy, edgesCopy, startNode, endNode);
    } else {
      (executor as DFSExecutor | BFSExecutor | PrimExecutor).execute(nodesCopy, edgesCopy, startNode);
    }
    setCurrentStep(0);
    setIsExecuted(true);
  }, [algorithm, executor, nodes, edges, startNode, endNode]);

  const handleAlgorithmChange = useCallback((newAlgorithm: GraphAlgorithm) => {
    setAlgorithm(newAlgorithm);
    setIsExecuted(false);
    setCurrentStep(0);
  }, []);

  const snapshots = executor.getSnapshots();
  const currentSnapshot = snapshots[currentStep] as Snapshot<GraphSnapshot> | undefined;
  const snapshotData = currentSnapshot?.data;

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* 章节标题 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 border border-indigo-700/30 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-indigo-400 font-medium">第六章</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">图 (Graph)</h1>
            <p className="text-slate-300 text-lg max-w-3xl">
              相比于线性表（一对一）和树（一对多），图处理的是<strong className="text-indigo-400">多对多</strong>的数据关系。
              图 G 由顶点集 V 和边集 E 组成：<span className="font-mono text-purple-400">G = (V, E)</span>
            </p>
          </div>
        </div>

        {/* ==================== 6.1 基本概念 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Share2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">6.1 图的定义与基本术语</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 基本定义 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">基本定义</h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-white font-medium mb-1">无向图</div>
                  <p className="text-slate-400">边没有方向，表示为 (v₁, v₂)。<span className="text-green-400">(v₁, v₂) = (v₂, v₁)</span></p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-white font-medium mb-1">有向图</div>
                  <p className="text-slate-400">边有方向（称为弧），表示为 &lt;v₁, v₂&gt;。v₁ 为弧尾，v₂ 为弧头。</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-white font-medium mb-1">网 (Network)</div>
                  <p className="text-slate-400">带权的图（边上有数值，代表距离、耗费等）</p>
                </div>
              </div>
            </div>

            {/* 重要公式 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">重要性质与公式</h3>
              <div className="space-y-3">
                <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                  <div className="text-purple-400 font-medium mb-2">边的数量限制</div>
                  <div className="text-sm space-y-1 font-mono">
                    <p className="text-slate-300">无向图：0 ≤ e ≤ <span className="text-green-400">n(n-1)/2</span></p>
                    <p className="text-slate-300">有向图：0 ≤ e ≤ <span className="text-amber-400">n(n-1)</span></p>
                  </div>
                </div>
                <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-medium">握手定理（必考）</span>
                  </div>
                  <p className="text-lg font-mono text-center text-white mt-2">Σ TD(vᵢ) = 2e</p>
                  <p className="text-xs text-slate-400 text-center mt-1">所有顶点的度数之和 = 边数的2倍</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-white font-medium mb-1">度 (Degree)</div>
                  <p className="text-slate-400 text-sm">有向图：TD(v) = ID(v) + OD(v) （入度 + 出度）</p>
                </div>
              </div>
            </div>
          </div>

          {/* 连通性 */}
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
              <div className="text-green-400 font-semibold mb-2">连通图（无向）</div>
              <p className="text-slate-300 text-sm">任意两个顶点之间都有路径。<strong>连通分量</strong>是无向图的极大连通子图。</p>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
              <div className="text-amber-400 font-semibold mb-2">强连通图（有向）</div>
              <p className="text-slate-300 text-sm">任意一对顶点 vᵢ, vⱼ，从 vᵢ → vⱼ 和 vⱼ → vᵢ 都有路径。</p>
            </div>
          </div>
        </div>

        {/* ==================== 6.2 存储结构 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">6.2 图的存储结构</h2>
          </div>

          <p className="text-slate-400 mb-6">图无法像数组那样物理连续存储，主要有两种存储方式：</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 邻接矩阵 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">邻接矩阵 (Adjacency Matrix)</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <p>二维数组 <code className="px-1 bg-slate-700 rounded">A[n][n]</code>。若有边 (i, j)，则 A[i][j] = 1（或权值）；否则为 0（或 ∞）。</p>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-slate-400 mb-2">空间复杂度：<span className="text-amber-400 font-mono">O(n²)</span></div>
                </div>
                <div className="space-y-2">
                  <div className="text-green-400">✓ 优点：</div>
                  <ul className="text-slate-400 text-xs space-y-1 ml-4">
                    <li>• 易判断两点是否直连</li>
                    <li>• 易求度</li>
                  </ul>
                  <div className="text-red-400">✗ 缺点：</div>
                  <ul className="text-slate-400 text-xs ml-4">
                    <li>• 稀疏图时浪费空间</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 邻接表 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">邻接表 (Adjacency List)</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <p>数组 + 链表。每个顶点有一个链表，挂着所有与它相邻的边。</p>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-slate-400 mb-1">空间复杂度：</div>
                  <p className="text-xs">无向：<span className="text-green-400 font-mono">O(n+2e)</span>，有向：<span className="text-green-400 font-mono">O(n+e)</span></p>
                </div>
                <div className="space-y-2">
                  <div className="text-green-400">✓ 优点：</div>
                  <ul className="text-slate-400 text-xs space-y-1 ml-4">
                    <li>• 节省空间（稀疏图）</li>
                    <li>• 易找邻接点</li>
                  </ul>
                  <div className="text-red-400">✗ 缺点：</div>
                  <ul className="text-slate-400 text-xs ml-4">
                    <li>• 不易判断两点是否直连</li>
                    <li>• 有向图求入度难（需逆邻接表）</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 6.3 图的遍历 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">6.3 图的遍历</h2>
          </div>

          <p className="text-slate-400 mb-6">遍历是后续复杂算法的基础。</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* DFS */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">深度优先搜索 (DFS)</h3>
              <div className="space-y-3 text-slate-300">
                <p className="text-sm">
                  <strong>思路</strong>：类似于树的<span className="text-cyan-400">先序遍历</span>。<strong>一条路走到黑，撞墙了再回溯</strong>。
                </p>
                <div className="bg-slate-900/50 rounded-lg p-3 text-sm">
                  <div className="text-cyan-400 font-medium mb-2">实现方式</div>
                  <p className="text-slate-400">通常使用<strong className="text-white">递归</strong>或<strong className="text-white">栈</strong></p>
                </div>
                <div className="bg-cyan-500/10 rounded-lg p-3 text-sm">
                  <div className="text-cyan-400 font-medium mb-1">应用</div>
                  <p className="text-slate-400">判断回路、求连通分量</p>
                </div>
              </div>
            </div>

            {/* BFS */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">广度优先搜索 (BFS)</h3>
              <div className="space-y-3 text-slate-300">
                <p className="text-sm">
                  <strong>思路</strong>：类似于树的<span className="text-blue-400">层次遍历</span>。<strong>先访问所有邻居，再访问邻居的邻居</strong>。
                </p>
                <div className="bg-slate-900/50 rounded-lg p-3 text-sm">
                  <div className="text-blue-400 font-medium mb-2">实现方式</div>
                  <p className="text-slate-400">必须使用<strong className="text-white">队列</strong></p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3 text-sm">
                  <div className="text-blue-400 font-medium mb-1">应用</div>
                  <p className="text-slate-400">求无权图的最短路径</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 6.4 最小生成树 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <TreePine className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">6.4 最小生成树 (MST)</h2>
          </div>

          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30 mb-6">
            <p className="text-slate-300">
              <strong className="text-green-400">目标</strong>：在 n 个顶点的连通网中，找 <strong className="text-white">n-1 条边</strong>，连通所有顶点且<strong className="text-white">权值之和最小</strong>。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Prim */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-green-400 mb-3">Prim 算法 (普里姆)</h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                  <div className="text-green-400 font-semibold mb-1">策略：加点法</div>
                  <p className="text-slate-400">从一个顶点开始，每次找连接"已选顶点集合"和"未选顶点集合"之间<strong className="text-white">权值最小的边</strong>，将对应的点加入集合。</p>
                </div>
                <p><strong>适用</strong>：<span className="text-amber-400">稠密图</span></p>
              </div>
            </div>

            {/* Kruskal */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Kruskal 算法 (克鲁斯卡尔)</h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                  <div className="text-purple-400 font-semibold mb-1">策略：加边法</div>
                  <p className="text-slate-400">将所有边按权值排序，从小到大选边。如果选的边会构成回路（即两个点已经在一个集合里），则丢弃；否则加入。</p>
                </div>
                <p><strong>适用</strong>：<span className="text-cyan-400">稀疏图</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 6.5 最短路径 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Route className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">6.5 最短路径</h2>
          </div>

          <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30 mb-6">
            <p className="text-slate-300">
              <strong className="text-amber-400">目标</strong>：在带权有向图中，求两个顶点间<strong className="text-white">权值之和最小</strong>的路径。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Dijkstra */}
            <div className="bg-slate-800/50 rounded-xl p-5 border border-amber-500/30">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold text-amber-400">Dijkstra 算法</h3>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">必考</span>
              </div>
              <div className="space-y-3 text-slate-300 text-sm">
                <p><strong>解决问题</strong>：<span className="text-amber-400">单源</span>最短路径（从 v₀ 到其他所有点）</p>
                <p><strong>思想</strong>：贪心策略。按路径长度递增的次序产生最短路径。</p>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-amber-400 font-medium mb-2">核心公式</div>
                  <p className="font-mono text-center text-white">{"D[j] = min{ D[j], D[k] + weight(k,j) }"}</p>
                  <p className="text-xs text-slate-500 text-center mt-1">其中 k 是新加入确定集合的中间点</p>
                </div>
              </div>
            </div>

            {/* Floyd */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">Floyd 算法 (弗洛伊德)</h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <p><strong>解决问题</strong>：<span className="text-indigo-400">所有顶点对</span>之间的最短路径</p>
                <p><strong>思想</strong>：动态规划。逐步允许经过顶点 0, 1, ..., k 作为中间点来更新路径。</p>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-indigo-400 font-medium mb-2">核心公式</div>
                  <p className="font-mono text-center text-white">{"D[i][j] = min{ D[i][j], D[i][k] + D[k][j] }"}</p>
                </div>
                <p><strong>复杂度</strong>：<span className="text-amber-400 font-mono">O(n³)</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 6.6 拓扑排序与关键路径 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">6.6 DAG 的应用</h2>
          </div>

          <p className="text-slate-400 mb-6">DAG (Directed Acyclic Graph) 有向无环图常用于工程规划。</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 拓扑排序 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-pink-400 mb-3">拓扑排序 (AOV 网)</h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <p><strong>AOV (Activity On Vertex)</strong>：顶点表示活动，边表示优先关系。</p>
                <p><strong>目标</strong>：将所有顶点排成线性序列，使得若存在 &lt;vᵢ, vⱼ&gt;，则 vᵢ 必在 vⱼ 前面。</p>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-pink-400 font-medium mb-2">算法步骤</div>
                  <ol className="list-decimal list-inside text-slate-400 space-y-1">
                    <li>找入度为 0 的顶点输出</li>
                    <li>删除该顶点及其发出的边</li>
                    <li>重复直到图空或剩环</li>
                  </ol>
                </div>
                <div className="bg-pink-500/10 rounded-lg p-3 border border-pink-500/30">
                  <div className="text-pink-400 font-medium mb-1">应用</div>
                  <p className="text-slate-400">检测图中是否有环；安排课程学习顺序</p>
                </div>
              </div>
            </div>

            {/* 关键路径 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-red-400 mb-3">关键路径 (AOE 网)</h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <p><strong>AOE (Activity On Edge)</strong>：边表示活动（有持续时间），顶点表示事件。</p>
                <p><strong>关键路径</strong>：从源点到汇点<span className="text-red-400">路径长度最长</span>的路径。决定了整个工程的最短工期。</p>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-red-400 font-medium mb-2">核心计算</div>
                  <div className="space-y-2 text-xs">
                    <p><strong>Ve(i)</strong> 事件最早发生时间：从前向后推，取<span className="text-green-400">最大值</span></p>
                    <p><strong>Vl(i)</strong> 事件最迟发生时间：从后向前推，取<span className="text-amber-400">最小值</span></p>
                    <p><strong>关键活动</strong>：满足 <span className="text-red-400">Ve = Vl</span> 的活动</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 动画演示区域 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">🎯 动画演示</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* 左侧控制面板 */}
            <div className="space-y-4">
              {/* 算法选择 */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">选择算法</h3>
                <div className="space-y-2">
                  {(Object.keys(algorithmInfo) as GraphAlgorithm[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => handleAlgorithmChange(key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        algorithm === key
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {algorithmInfo[key].icon}
                      <div className="text-left">
                        <div className="font-medium text-sm">{algorithmInfo[key].name}</div>
                        <div className="text-xs opacity-70">{algorithmInfo[key].description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 参数设置 */}
              {algorithm !== 'topological' && (
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">参数设置</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-slate-400 text-sm block mb-1">起始节点</label>
                      <select
                        value={startNode}
                        onChange={(e) => setStartNode(e.target.value)}
                        className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm"
                      >
                        {nodes.map((node) => (
                          <option key={node.id} value={node.id}>
                            节点 {node.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {algorithm === 'dijkstra' && (
                      <div>
                        <label className="text-slate-400 text-sm block mb-1">目标节点</label>
                        <select
                          value={endNode}
                          onChange={(e) => setEndNode(e.target.value)}
                          className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm"
                        >
                          {nodes.map((node) => (
                            <option key={node.id} value={node.id}>
                              节点 {node.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex gap-2">
                  <button
                    onClick={handleRun}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 transition-colors"
                  >
                    <Play size={18} />
                    运行
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg px-4 py-2 transition-colors"
                  >
                    <RotateCcw size={18} />
                    重置
                  </button>
                </div>
              </div>

              {/* 复杂度信息 */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">复杂度分析</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">时间复杂度</span>
                    <span className="text-green-400 font-mono">{executor.meta.timeComplexity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">空间复杂度</span>
                    <span className="text-blue-400 font-mono">{executor.meta.spaceComplexity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 中间可视化区域 */}
            <div className="lg:col-span-2 space-y-4">
              {/* 图可视化 */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">
                  {algorithm === 'topological' ? '有向无环图 (DAG)' : '无向加权图'}
                </h3>
                <GraphVisualizer
                  snapshot={snapshotData || {
                    nodes: nodes.map(n => ({ ...n })),
                    edges: edges.map(e => ({ ...e })),
                    visitedNodes: [],
                    highlightedEdges: [],
                  }}
                  width={600}
                  height={400}
                />
              </div>

              {/* 播放控制 */}
              {isExecuted && snapshots.length > 0 && (
                <PlayerControls
                  snapshots={snapshots}
                  currentStep={currentStep}
                  onStepChange={setCurrentStep}
                  onReset={handleReset}
                />
              )}

              {/* 代码面板 */}
              <CodePanel
                meta={executor.meta}
                currentLineIndex={currentSnapshot?.codeLineIndex || 0}
              />
            </div>
          </div>
        </div>

        {/* ==================== 复杂度对比 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-4">📊 图算法复杂度对比</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-3 px-4">算法</th>
                  <th className="text-left py-3 px-4">时间复杂度</th>
                  <th className="text-left py-3 px-4">应用场景</th>
                  <th className="text-left py-3 px-4">数据结构</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium text-white">DFS</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(V+E)</td>
                  <td className="py-3 px-4 text-slate-400">遍历、连通性、回路检测</td>
                  <td className="py-3 px-4 text-cyan-400">栈 / 递归</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium text-white">BFS</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(V+E)</td>
                  <td className="py-3 px-4 text-slate-400">无权图最短路径</td>
                  <td className="py-3 px-4 text-blue-400">队列</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium text-white">Dijkstra ★</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O((V+E)logV)</td>
                  <td className="py-3 px-4 text-slate-400">单源最短路径（非负权）</td>
                  <td className="py-3 px-4 text-amber-400">优先队列</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium text-white">Floyd</td>
                  <td className="py-3 px-4 font-mono text-red-400">O(V³)</td>
                  <td className="py-3 px-4 text-slate-400">所有顶点对最短路径</td>
                  <td className="py-3 px-4 text-indigo-400">DP矩阵</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium text-white">Prim</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O((V+E)logV)</td>
                  <td className="py-3 px-4 text-slate-400">最小生成树（稠密图）</td>
                  <td className="py-3 px-4 text-green-400">加点法</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium text-white">Kruskal</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(ElogE)</td>
                  <td className="py-3 px-4 text-slate-400">最小生成树（稀疏图）</td>
                  <td className="py-3 px-4 text-purple-400">加边法 + 并查集</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">拓扑排序</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(V+E)</td>
                  <td className="py-3 px-4 text-slate-400">任务调度、检测环</td>
                  <td className="py-3 px-4 text-pink-400">入度表 + 队列</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================== 考试避坑指南 ==================== */}
        <div className="glass rounded-2xl p-6 border border-amber-700/30 bg-gradient-to-br from-amber-900/10 to-transparent">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">🎯 考试避坑指南</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <div className="text-red-400 font-semibold mb-2">⚠️ 必背公式</div>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• <strong>握手定理</strong>：Σ TD(vᵢ) = 2e</li>
                  <li>• <strong>Dijkstra 更新</strong>：{"D[j] = min{D[j], D[k] + w(k,j)}"}</li>
                  <li>• <strong>Floyd 更新</strong>：{"D[i][j] = min{D[i][j], D[i][k] + D[k][j]}"}</li>
                </ul>
              </div>

              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <div className="text-blue-400 font-semibold mb-2">🎨 画图题技巧</div>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• 做题时一定要<strong>动手画图</strong>，模拟算法每一步</li>
                  <li>• Prim：标记已选顶点，找最小连接边</li>
                  <li>• Dijkstra：记录 dist[] 数组变化过程</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <div className="text-purple-400 font-semibold mb-2">📚 AOV vs AOE</div>
                <div className="text-slate-300 text-sm space-y-2">
                  <p><strong className="text-pink-400">AOV</strong> 重点在于<strong>顺序</strong>（拓扑排序）</p>
                  <p><strong className="text-red-400">AOE</strong> 重点在于<strong>时间/工期</strong>（关键路径）</p>
                </div>
              </div>

              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                <div className="text-green-400 font-semibold mb-2">💡 Prim vs Kruskal</div>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• <strong>Prim</strong>：加点法，适合<span className="text-amber-400">稠密图</span></li>
                  <li>• <strong>Kruskal</strong>：加边法，适合<span className="text-cyan-400">稀疏图</span></li>
                  <li>• 两者得到的 MST 权值相同，但树形可能不同</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
