import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TreeVisualizer, PlayerControls, CodePanel } from '../components';
import { BinaryTreeExecutor } from '../algorithms';
import { TreeSnapshot, Snapshot } from '../types';
import { BookOpen, Lightbulb, Code, Clock, AlertTriangle, Zap, GitBranch } from 'lucide-react';

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

  const traversalButtons: { type: TraversalType; label: string; order: string; desc: string }[] = [
    { type: 'preorder', label: '前序遍历', order: '根-左-右', desc: '复制树结构、前缀表达式' },
    { type: 'inorder', label: '中序遍历', order: '左-根-右', desc: 'BST中序遍历得到有序序列' },
    { type: 'postorder', label: '后序遍历', order: '左-右-根', desc: '计算目录大小、后缀表达式' },
    { type: 'levelorder', label: '层序遍历', order: '逐层扫描', desc: '计算树的宽度、BFS' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* ===== 第一部分：章节标题与核心导论 ===== */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-green-400 font-medium">第五章</p>
              <h1 className="text-3xl font-bold text-white">树和二叉树</h1>
            </div>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed max-w-4xl">
            如果说线性表是一维的平原，那么树就是二维的山脉。在这里，数据不再是一个接一个地排队，
            而是<span className="text-green-400 font-semibold">层层递进，开枝散叶</span>。
            本章知识密度极大，我们重点攻克三个堡垒：
            <span className="text-amber-400">二叉树的核心性质、遍历算法、以及赫夫曼树（Huffman Tree）</span>。
          </p>
        </header>

        {/* ===== 第二部分：核心概念讲解 ===== */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="text-amber-400" size={24} />
            <h2 className="text-xl font-bold text-white">核心概念：二叉树的本质</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <GitBranch size={20} /> 什么是二叉树？
              </h3>
              <p className="text-slate-300 mb-4">
                二叉树<span className="text-amber-400">不是</span>树的特例，它是一种独立的逻辑结构。
                每个结点最多两个孩子，且必须分清<span className="text-green-400 font-semibold">左孩子</span>和<span className="text-green-400 font-semibold">右孩子</span>。
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">基本术语</p>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• <span className="text-green-400">度（Degree）</span>：结点拥有的子树数。叶子结点度为 0</li>
                    <li>• <span className="text-green-400">深度（Depth）</span>：树的最大层次数</li>
                    <li>• <span className="text-green-400">有序树</span>：孩子结点从左到右有次序，不能互换</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-green-400 mb-4">🌳 特殊形态</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-sm text-green-400 font-medium mb-1">满二叉树</p>
                  <p className="text-xs text-slate-400">
                    每一层都塞满了，一个坑都不缺。深度为 k 的满二叉树有 2^k - 1 个结点。
                  </p>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <p className="text-sm text-blue-400 font-medium mb-1">完全二叉树</p>
                  <p className="text-xs text-slate-400">
                    只有最后一层可以不满，且叶子必须紧紧靠在左边。这是<span className="text-blue-400">堆（Heap）</span>的基础。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 核心性质 */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/30 mb-6">
            <h3 className="text-lg font-bold text-green-400 mb-4">📐 核心性质（必考公式）</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-white font-medium">1. 第 i 层结点数</p>
                  <p className="text-slate-400 text-sm">最多 <code className="text-green-400">2^(i-1)</code> 个</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-white font-medium">2. 深度为 k 的树总结点数</p>
                  <p className="text-slate-400 text-sm">最多 <code className="text-green-400">2^k - 1</code> 个（满二叉树）</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-white font-medium">3. 叶子与度为2结点的关系</p>
                  <p className="text-slate-400 text-sm"><code className="text-amber-400">n₀ = n₂ + 1</code></p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-white font-medium">4. 完全二叉树的父子关系</p>
                  <p className="text-slate-400 text-sm">
                    左孩子 <code className="text-green-400">2i</code>，右孩子 <code className="text-green-400">2i+1</code>，父亲 <code className="text-blue-400">⌊i/2⌋</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 第三部分：遍历算法讲解 ===== */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-yellow-400" size={24} />
            <h2 className="text-xl font-bold text-white">遍历算法：所有二叉树算法的根基</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {traversalButtons.map((btn) => (
              <div
                key={btn.type}
                onClick={() => setTraversalType(btn.type)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  traversalType === btn.type
                    ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white">{btn.label}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    traversalType === btn.type ? 'bg-green-500/30 text-green-400' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {btn.order}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{btn.desc}</p>
              </div>
            ))}
          </div>

          {/* 遍历伪代码 */}
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
            <h4 className="text-sm font-medium text-slate-400 mb-4">递归实现伪代码</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <p className="text-sm text-purple-400 font-medium mb-2">前序 (Pre-order)</p>
                <pre className="text-xs text-slate-300 font-mono">{`void PreOrder(T) {
    if (T == NULL) return;
    visit(T.data);      // 先访问根
    PreOrder(T.left);   // 再左子树
    PreOrder(T.right);  // 后右子树
}`}</pre>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <p className="text-sm text-blue-400 font-medium mb-2">中序 (In-order)</p>
                <pre className="text-xs text-slate-300 font-mono">{`void InOrder(T) {
    if (T == NULL) return;
    InOrder(T.left);    // 先左子树
    visit(T.data);      // 再访问根
    InOrder(T.right);   // 后右子树
}`}</pre>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <p className="text-sm text-green-400 font-medium mb-2">后序 (Post-order)</p>
                <pre className="text-xs text-slate-300 font-mono">{`void PostOrder(T) {
    if (T == NULL) return;
    PostOrder(T.left);  // 先左子树
    PostOrder(T.right); // 再右子树
    visit(T.data);      // 后访问根
}`}</pre>
              </div>
            </div>
            <div className="mt-4 p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <p className="text-sm text-amber-400">
                <strong>层序遍历</strong>：必须借助<span className="text-white">队列（Queue）</span>实现。
                先访问所有邻居，再访问邻居的邻居。
              </p>
            </div>
          </div>

          {/* 经典考题 */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-400 mb-4">🎯 经典考题：根据前序和中序还原二叉树</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-300 mb-3">
                  给出一棵树的前序序列和中序序列，请画出这棵树。
                </p>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-purple-400 font-medium mb-2">解题秘籍：前序找根，中序分左右</p>
                  <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                    <li>前序第一个字母一定是根</li>
                    <li>去中序里找到这个根</li>
                    <li>根左边的是左子树，右边的是右子树</li>
                    <li>递归重复此过程</li>
                  </ol>
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <p className="text-sm text-white font-medium mb-2">示例</p>
                <p className="text-xs text-slate-400 mb-2">前序：A B D E C F</p>
                <p className="text-xs text-slate-400 mb-2">中序：D B E A F C</p>
                <p className="text-xs text-green-400">
                  → A 是根，中序中 "DBE" 在左，"FC" 在右
                  → 递归处理左子树 (前序 BDE，中序 DBE)...
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 第四部分：动画演示区 ===== */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Code className="text-green-400" size={24} />
            <h2 className="text-xl font-bold text-white">动画演示：二叉树遍历</h2>
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
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                    placeholder="例如: 1, 2, 3, 4, 5, null, 7"
                  />
                  <p className="text-xs text-slate-500 mt-1">使用逗号分隔，null 表示空节点</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleExecute}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  开始 {traversalButtons.find(b => b.type === traversalType)?.label}
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
        </section>

        {/* ===== 第五部分：赫夫曼树 ===== */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-yellow-400" size={24} />
            <h2 className="text-xl font-bold text-white">赫夫曼树（Huffman Tree）与编码</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-amber-400 mb-4">📦 什么是赫夫曼树？</h3>
              <p className="text-slate-300 mb-4">
                赫夫曼树是<span className="text-amber-400 font-bold">带权路径长度（WPL）最小</span>的二叉树。
                这是二叉树最经典的压缩应用。
              </p>
              
              <div className="p-4 bg-slate-900/50 rounded-lg mb-4">
                <p className="text-sm text-white font-medium mb-2">构造算法（贪心策略）</p>
                <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                  <li>把所有权值看作森林中的孤立树</li>
                  <li><span className="text-amber-400">挑</span>：选出权值最小的两棵树</li>
                  <li><span className="text-green-400">合</span>：造一个新根，权值为两棵树之和</li>
                  <li><span className="text-blue-400">放</span>：把新根放回森林，删掉原来的两棵树</li>
                  <li>重复，直到只剩下一棵树</li>
                </ol>
              </div>
            </div>

            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-green-400 mb-4">🔐 赫夫曼编码</h3>
              <p className="text-slate-400 text-sm mb-4">
                <span className="text-green-400 font-medium">前缀编码</span>：没有任何一个编码是另一个编码的前缀。
                赫夫曼树天然满足这个性质，因为所有字符都在叶子上。
              </p>
              
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 mb-4">
                <p className="text-sm text-green-400 font-medium mb-2">编码规则</p>
                <p className="text-xs text-slate-400">
                  左分支记为 <span className="text-blue-400 font-bold">0</span>，
                  右分支记为 <span className="text-amber-400 font-bold">1</span>
                </p>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <p className="text-sm text-amber-400 font-medium mb-2">WPL 快速计算技巧</p>
                <p className="text-xs text-slate-400">
                  方法一：Σ(叶子权值 × 路径长度)<br/>
                  方法二：<span className="text-amber-400 font-bold">所有非叶子结点的权值之和</span>（更快！）
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 第六部分：时间复杂度 ===== */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold text-white">时间与空间复杂度</h2>
          </div>

          <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-3 px-4">操作</th>
                  <th className="text-left py-3 px-4">时间复杂度</th>
                  <th className="text-left py-3 px-4">空间复杂度</th>
                  <th className="text-left py-3 px-4">说明</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium">前/中/后序遍历</td>
                  <td className="py-3 px-4"><span className="text-green-400 font-mono">O(n)</span></td>
                  <td className="py-3 px-4"><span className="text-amber-400 font-mono">O(h)</span></td>
                  <td className="py-3 px-4 text-slate-500">h 为树的高度（递归栈）</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium">层序遍历</td>
                  <td className="py-3 px-4"><span className="text-green-400 font-mono">O(n)</span></td>
                  <td className="py-3 px-4"><span className="text-amber-400 font-mono">O(w)</span></td>
                  <td className="py-3 px-4 text-slate-500">w 为树的最大宽度（队列）</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">构建赫夫曼树</td>
                  <td className="py-3 px-4"><span className="text-amber-400 font-mono">O(n log n)</span></td>
                  <td className="py-3 px-4"><span className="text-green-400 font-mono">O(n)</span></td>
                  <td className="py-3 px-4 text-slate-500">需要排序或使用优先队列</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== 第七部分：考试避坑指南 ===== */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-red-400" size={24} />
            <h2 className="text-xl font-bold text-white">考试避坑指南</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-6 border border-red-500/30">
              <h3 className="text-lg font-bold text-red-400 mb-3">❌ 常见错误</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">1.</span>
                  <span>试图人肉跟踪每一层递归。要<span className="text-amber-400">相信你的函数能处理好子问题</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">2.</span>
                  <span>后序遍历非递归最难，因为根结点要第三次经过才能访问，需要记录"上一次访问的结点"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">3.</span>
                  <span>混淆"深度"和"高度"的计算起点</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/30">
              <h3 className="text-lg font-bold text-green-400 mb-3">✅ 递归的思维</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">1.</span>
                  <span>求树高：<code className="text-green-400">Height(T) = max(Height(L), Height(R)) + 1</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">2.</span>
                  <span>求结点数：<code className="text-green-400">Count(T) = Count(L) + Count(R) + 1</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">3.</span>
                  <span>树与森林的转换口诀：<span className="text-amber-400">长子变左孩，兄弟变右孩</span></span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
