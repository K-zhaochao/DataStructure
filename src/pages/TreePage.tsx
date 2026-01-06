import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TreeVisualizer, PlayerControls, CodePanel } from '../components';
import { BinaryTreeExecutor } from '../algorithms';
import { TreeSnapshot, Snapshot } from '../types';

type TraversalType = 'preorder' | 'inorder' | 'postorder' | 'levelorder';

export default function TreePage() {
  const [executor] = useState(() => new BinaryTreeExecutor());
  const [currentStep, setCurrentStep] = useState(0);
  const [traversalType, setTraversalType] = useState<TraversalType>('preorder');
  const [inputValue, setInputValue] = useState('1, 2, 3, 4, 5, 6, 7');
  const [isExecuted, setIsExecuted] = useState(false);

  const handleExecute = useCallback(() => {
    const values = inputValue
      .split(',')
      .map((v) => {
        const trimmed = v.trim();
        if (trimmed === 'null' || trimmed === '') return null;
        return parseInt(trimmed);
      });

    if (values.length === 0 || values[0] === null) return;

    executor.execute(values as (number | null)[], traversalType);
    setCurrentStep(0);
    setIsExecuted(true);
  }, [executor, inputValue, traversalType]);

  const handleReset = useCallback(() => {
    executor.reset();
    setCurrentStep(0);
    setIsExecuted(false);
  }, [executor]);

  const snapshots = executor.getSnapshots();
  const currentSnapshot = snapshots[currentStep] as Snapshot<TreeSnapshot> | undefined;
  const snapshotData = currentSnapshot?.data;

  const traversalButtons: { type: TraversalType; label: string; order: string }[] = [
    { type: 'preorder', label: '前序遍历', order: '根-左-右' },
    { type: 'inorder', label: '中序遍历', order: '左-根-右' },
    { type: 'postorder', label: '后序遍历', order: '左-右-根' },
    { type: 'levelorder', label: '层序遍历', order: '逐层扫描' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">树</h1>
          <p className="text-slate-400">
            树是一种非线性数据结构，二叉树是每个节点最多有两个子节点的树结构
          </p>
        </div>

        {/* 输入控制 */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4">构建二叉树（层序输入）</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="例如: 1, 2, 3, 4, 5, null, 7"
                />
                <p className="text-xs text-slate-500 mt-1">使用逗号分隔，null 表示空节点</p>
              </div>
            </div>

            {/* 遍历方式选择 */}
            <div className="flex flex-wrap gap-2">
              {traversalButtons.map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => setTraversalType(btn.type)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    traversalType === btn.type
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <span className="font-medium">{btn.label}</span>
                  <span className="text-xs opacity-70 ml-2">({btn.order})</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleExecute}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                开始遍历
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                重置
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 可视化区域 */}
          <div className="lg:col-span-2 space-y-6">
            <TreeVisualizer
              nodes={snapshotData?.nodes || new Map()}
              rootId={snapshotData?.rootId || null}
              visitedNodes={snapshotData?.visitedNodes || []}
              currentNode={snapshotData?.currentNode}
              highlightedEdges={snapshotData?.highlightedEdges}
            />

            {isExecuted && snapshots.length > 0 && (
              <PlayerControls
                snapshots={snapshots}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                onReset={handleReset}
              />
            )}
          </div>

          {/* 代码面板 */}
          <div className="lg:col-span-1">
            <CodePanel
              meta={executor.meta}
              currentLineIndex={currentSnapshot?.codeLineIndex || 0}
            />
          </div>
        </div>

        {/* 知识点 */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">🌳 二叉树的性质</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-mono">1.</span>
                第 i 层最多有 2<sup>i-1</sup> 个节点
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-mono">2.</span>
                深度为 k 的二叉树最多有 2<sup>k</sup>-1 个节点
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-mono">3.</span>
                叶子节点数 = 度为2的节点数 + 1
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-mono">4.</span>
                n 个节点的完全二叉树深度为 ⌊log₂n⌋+1
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">🔄 遍历顺序对比</h3>
            <div className="space-y-4">
              {traversalButtons.map((btn) => (
                <div
                  key={btn.type}
                  className={`p-3 rounded-lg border ${
                    traversalType === btn.type
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">{btn.label}</span>
                    <span className="text-sm text-slate-400 font-mono">{btn.order}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {btn.type === 'preorder' && '常用于复制树结构、前缀表达式'}
                    {btn.type === 'inorder' && '二叉搜索树中序遍历得到有序序列'}
                    {btn.type === 'postorder' && '常用于计算目录大小、后缀表达式'}
                    {btn.type === 'levelorder' && '常用于计算树的宽度、最短路径'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
