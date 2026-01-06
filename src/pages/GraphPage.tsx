import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Network, Route, TreePine, ListOrdered } from 'lucide-react';
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
    description: '沿着一条路径尽可能深入，直到无法继续时回溯',
    icon: <Network size={18} />,
  },
  bfs: {
    name: '广度优先搜索 (BFS)',
    description: '先访问所有相邻节点，再访问下一层节点',
    icon: <Network size={18} />,
  },
  dijkstra: {
    name: 'Dijkstra 最短路径',
    description: '贪心策略计算单源最短路径，适用于非负权边',
    icon: <Route size={18} />,
  },
  prim: {
    name: 'Prim 最小生成树',
    description: '从一个顶点开始，每次选择最小权边扩展 MST',
    icon: <TreePine size={18} />,
  },
  topological: {
    name: '拓扑排序',
    description: '将有向无环图的顶点排成线性序列',
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
      >
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">图算法可视化</h1>
          <p className="text-slate-400">
            图是由顶点和边组成的非线性数据结构，用于表示多对多的关系
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧控制面板 */}
          <div className="space-y-4">
            {/* 算法选择 */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">选择算法</h3>
              <div className="space-y-2">
                {(Object.keys(algorithmInfo) as GraphAlgorithm[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleAlgorithmChange(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      algorithm === key
                        ? 'bg-blue-600 text-white'
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
              <div className="glass rounded-xl p-4">
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
            <div className="glass rounded-xl p-4">
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
            <div className="glass rounded-xl p-4">
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
            <div className="glass rounded-xl p-6">
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

        {/* 算法说明 */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">📚 图的存储结构</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-blue-400 font-medium mb-2">邻接矩阵</h4>
                <p className="text-sm text-slate-400">
                  用二维数组存储顶点间的关系，适合稠密图，空间复杂度 O(V²)
                </p>
              </div>
              <div>
                <h4 className="text-purple-400 font-medium mb-2">邻接表</h4>
                <p className="text-sm text-slate-400">
                  用链表存储每个顶点的邻接顶点，适合稀疏图，空间复杂度 O(V+E)
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">🔢 复杂度对比</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-2">算法</th>
                  <th className="text-left py-2">时间复杂度</th>
                  <th className="text-left py-2">应用场景</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">DFS/BFS</td>
                  <td className="py-2 font-mono text-green-400">O(V+E)</td>
                  <td className="py-2 text-xs">遍历、连通性</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">Dijkstra</td>
                  <td className="py-2 font-mono text-amber-400">O((V+E)logV)</td>
                  <td className="py-2 text-xs">单源最短路</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">Prim</td>
                  <td className="py-2 font-mono text-amber-400">O((V+E)logV)</td>
                  <td className="py-2 text-xs">最小生成树</td>
                </tr>
                <tr>
                  <td className="py-2">拓扑排序</td>
                  <td className="py-2 font-mono text-green-400">O(V+E)</td>
                  <td className="py-2 text-xs">任务调度</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
