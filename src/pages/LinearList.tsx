import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LinkedListVisualizer, PlayerControls, CodePanel } from '../components';
import { LinkedListExecutor } from '../algorithms';
import { LinkedListSnapshot, Snapshot } from '../types';
import { BookOpen, Cpu, Clock, AlertTriangle, Lightbulb, Code } from 'lucide-react';

export default function LinearList() {
  const [executor] = useState(() => new LinkedListExecutor());
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('1, 2, 3, 4, 5');
  const [isExecuted, setIsExecuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'sequential' | 'linked'>('linked');

  const handleExecute = useCallback(() => {
    const values = inputValue
      .split(',')
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));

    if (values.length === 0) return;

    executor.execute(values);
    setCurrentStep(0);
    setIsExecuted(true);
  }, [executor, inputValue]);

  const handleReset = useCallback(() => {
    executor.reset();
    setCurrentStep(0);
    setIsExecuted(false);
  }, [executor]);

  const snapshots = executor.getSnapshots();
  const currentSnapshot = snapshots[currentStep] as Snapshot<LinkedListSnapshot> | undefined;
  const snapshotData = currentSnapshot?.data;

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-blue-400 font-medium">第二章</p>
              <h1 className="text-3xl font-bold text-white">线性表</h1>
            </div>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed max-w-4xl">
            线性表是所有复杂数据结构的基础。简单来说，线性表就是<span className="text-blue-400 font-semibold">排队</span>——
            数据元素一个挨着一个，除了头和尾，每个人都有一个"前驱"和一个"后继"。
            本章我们主要解决一个核心矛盾：<span className="text-amber-400">连续的内存（数组）虽好，但不够灵活；
            分散的内存（链表）灵活，但管理麻烦。</span>
          </p>
        </header>

        {/* ===== 第二部分：核心概念讲解 ===== */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="text-amber-400" size={24} />
            <h2 className="text-xl font-bold text-white">核心概念：线性表的两种"肉体"</h2>
          </div>
          
          <p className="text-slate-400 mb-6">
            逻辑上它们都是线性的，但在物理内存中，它们有两种截然不同的生存形态。
          </p>

          {/* 选项卡切换 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('sequential')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'sequential'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              形态一：顺序表
            </button>
            <button
              onClick={() => setActiveTab('linked')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'linked'
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              形态二：链表
            </button>
          </div>

          {/* 顺序表讲解 */}
          {activeTab === 'sequential' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Cpu size={20} /> 顺序表 (Sequential List)
                </h3>
                <p className="text-slate-300 mb-4">
                  这是线性表的<span className="text-blue-400 font-semibold">数组</span>形态。
                  内存地址连续，"邻居"就是物理上的邻居。
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <div>
                      <p className="text-white font-medium">优点：随机存取</p>
                      <p className="text-slate-400 text-sm">
                        想找第 i 个人？直接计算地址 <code className="text-blue-400 bg-slate-900 px-2 py-0.5 rounded">base + i×size</code>，
                        时间复杂度 <span className="text-green-400 font-mono">O(1)</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 font-bold text-lg">✗</span>
                    <div>
                      <p className="text-white font-medium">缺点：插入和删除太累</p>
                      <p className="text-slate-400 text-sm">
                        想在队伍中间插个人，后面的人都得往后挪；想走个人，后面的人都得往前补。
                        时间复杂度 <span className="text-red-400 font-mono">O(n)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 顺序表可视化示意 */}
              <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h4 className="text-sm font-medium text-slate-400 mb-4">内存布局示意</h4>
                <div className="flex items-center gap-1 mb-4">
                  {[10, 20, 30, 40, 50].map((val, i) => (
                    <div key={i} className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border-2 border-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {val}
                      </div>
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-slate-500">[{i}]</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-6">
                  连续的内存地址: 0x1000, 0x1004, 0x1008, 0x100C, 0x1010
                </p>
                
                <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">
                    <AlertTriangle size={14} className="inline text-amber-400 mr-1" />
                    <span className="font-medium text-amber-400">插入操作难点：</span>
                    必须从后往前挪！
                  </p>
                  <pre className="text-xs text-slate-300 font-mono overflow-x-auto">{`for (int j = last; j >= i-1; j--)
    data[j+1] = data[j];  // 元素后移
data[i-1] = x;  // 填入新值`}</pre>
                </div>
              </div>
            </motion.div>
          )}

          {/* 链表讲解 */}
          {activeTab === 'linked' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                  <Cpu size={20} /> 链表 (Linked List)
                </h3>
                <p className="text-slate-300 mb-4">
                  这是线性表的<span className="text-green-400 font-semibold">指针</span>形态。
                  内存地址分散，通过指针（Pointer）手拉手。
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <div>
                      <p className="text-white font-medium">优点：插入删除极快</p>
                      <p className="text-slate-400 text-sm">
                        只需要修改指针指向，不需要移动数据，
                        <span className="text-green-400 font-mono">O(1)</span>
                        （前提是你已经找到了位置）
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 font-bold text-lg">✗</span>
                    <div>
                      <p className="text-white font-medium">缺点：不支持随机存取</p>
                      <p className="text-slate-400 text-sm">
                        想找第 i 个人？必须从头开始数，
                        时间复杂度 <span className="text-red-400 font-mono">O(n)</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-sm text-green-400 font-medium mb-2">🎯 为什么需要头结点？</p>
                  <p className="text-slate-400 text-sm">
                    如果不带头结点，第一个结点的处理逻辑和其他结点不一样（因为没有前驱）。
                    为了代码统一，我们在链表最前面加一个"哨兵"，它的数据域为空，指针域指向真正的第一个元素。
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h4 className="text-sm font-medium text-slate-400 mb-4">核心操作：断链与重连</h4>
                
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 mb-4">
                  <p className="text-sm text-white font-medium mb-2">
                    插入操作口诀：<span className="text-green-400">先连后断</span>
                  </p>
                  <p className="text-xs text-slate-400 mb-2">先让新人拉住后面的人，再让前面的人拉住新人</p>
                  <pre className="text-xs text-slate-300 font-mono">{`newNode->link = current->link; // 1. 新结点指向原后续
current->link = newNode;       // 2. 前驱指向新结点`}</pre>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <p className="text-sm text-white font-medium mb-2">删除操作</p>
                  <pre className="text-xs text-slate-300 font-mono">{`delNode = current->link;       // 要删的结点
current->link = delNode->link; // 跳过被删结点
delete delNode;                // 释放内存！`}</pre>
                  <p className="text-xs text-amber-400 mt-2">
                    ⚠️ 别忘了释放内存！C++没有GC
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </section>

        {/* ===== 第三部分：动画演示区 ===== */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Code className="text-purple-400" size={24} />
            <h2 className="text-xl font-bold text-white">动画演示：链表构建过程</h2>
          </div>

          {/* 输入控制 */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
            <h3 className="text-sm font-medium text-slate-400 mb-4">构建链表（尾插法）</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm text-slate-400 mb-2">
                  输入节点值（逗号分隔）
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="例如: 1, 2, 3, 4, 5"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={handleExecute}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  尾插法构建
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
              <LinkedListVisualizer
                nodes={snapshotData?.nodes || []}
                headId={snapshotData?.headId || null}
                currentPointer={snapshotData?.currentPointer}
                highlightedNodes={snapshotData?.highlightedPointers}
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

        {/* ===== 第四部分：链表的进化形态 ===== */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="text-amber-400" size={24} />
            <h2 className="text-xl font-bold text-white">链表的进化形态</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">单链表</h3>
              <p className="text-slate-400 text-sm mb-3">
                每个结点只有一个指针域 <code className="text-blue-400">link</code>，指向下一个结点。
              </p>
              <div className="flex items-center gap-2">
                {['A', 'B', 'C'].map((v, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500/30 border border-blue-500 rounded flex items-center justify-center text-white text-sm">{v}</div>
                    {i < 2 && <span className="text-blue-400 mx-1">→</span>}
                  </div>
                ))}
                <span className="text-slate-500 text-sm">null</span>
              </div>
            </div>

            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">双向链表</h3>
              <p className="text-slate-400 text-sm mb-3">
                每个结点有 <code className="text-purple-400">llink</code> 和 <code className="text-purple-400">rlink</code> 两个指针。
                删除操作简化，不需要专门找前驱。
              </p>
              <div className="flex items-center gap-1">
                {['A', 'B', 'C'].map((v, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500/30 border border-purple-500 rounded flex items-center justify-center text-white text-sm">{v}</div>
                    {i < 2 && <span className="text-purple-400 mx-1">⇄</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <span className="text-green-400 font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">循环链表</h3>
              <p className="text-slate-400 text-sm mb-3">
                尾结点的 <code className="text-green-400">link</code> 不指向 NULL，而是指向头结点。
                适用于约瑟夫环问题。
              </p>
              <div className="flex items-center gap-1">
                {['A', 'B', 'C'].map((v, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-8 h-8 bg-green-500/30 border border-green-500 rounded flex items-center justify-center text-white text-sm">{v}</div>
                    <span className="text-green-400 mx-1">→</span>
                  </div>
                ))}
                <span className="text-green-400 text-xs">(回到A)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 第五部分：时间复杂度对比 ===== */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold text-white">时间复杂度对比（考试重点）</h2>
          </div>

          <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-3 px-4">操作</th>
                  <th className="text-left py-3 px-4">顺序表</th>
                  <th className="text-left py-3 px-4">链表</th>
                  <th className="text-left py-3 px-4">说明</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium">访问第 i 个元素</td>
                  <td className="py-3 px-4"><span className="text-green-400 font-mono">O(1)</span></td>
                  <td className="py-3 px-4"><span className="text-red-400 font-mono">O(n)</span></td>
                  <td className="py-3 px-4 text-slate-500">数组可直接计算地址，链表需从头遍历</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium">已知位置插入/删除</td>
                  <td className="py-3 px-4"><span className="text-red-400 font-mono">O(n)</span></td>
                  <td className="py-3 px-4"><span className="text-green-400 font-mono">O(1)</span></td>
                  <td className="py-3 px-4 text-slate-500">数组需移动元素，链表只改指针</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium">在第 i 位置插入</td>
                  <td className="py-3 px-4"><span className="text-red-400 font-mono">O(n)</span></td>
                  <td className="py-3 px-4"><span className="text-amber-400 font-mono">O(n)</span></td>
                  <td className="py-3 px-4 text-slate-500">⚠️ 链表也是 O(n)，因为需要先找到位置</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">空间利用率</td>
                  <td className="py-3 px-4"><span className="text-amber-400">可能浪费</span></td>
                  <td className="py-3 px-4"><span className="text-green-400">按需分配</span></td>
                  <td className="py-3 px-4 text-slate-500">链表需额外存储指针</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== 第六部分：考试避坑指南 ===== */}
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
                  <span>指针操作顺序错误：先断链后连接会导致链表后半段丢失（内存泄漏）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">2.</span>
                  <span>混淆"位置"和"下标"：位置从1开始，下标从0开始</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">3.</span>
                  <span>忘记释放内存：delete 操作是必须的</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/30">
              <h3 className="text-lg font-bold text-green-400 mb-3">✅ 经典题型</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">1.</span>
                  <span><strong>就地逆置</strong>：把头结点摘下来，剩下的结点用头插法重新插回</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">2.</span>
                  <span><strong>建表方式</strong>：前插法逆序，后插法顺序（需维护尾指针）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">3.</span>
                  <span><strong>多项式加法</strong>：归并思想，指数相同系数相加</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
