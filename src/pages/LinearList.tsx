import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LinkedListVisualizer, PlayerControls, CodePanel } from '../components';
import { LinkedListExecutor } from '../algorithms';
import { LinkedListSnapshot, Snapshot } from '../types';

export default function LinearList() {
  const [executor] = useState(() => new LinkedListExecutor());
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('1, 2, 3, 4, 5');
  const [isExecuted, setIsExecuted] = useState(false);

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
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">线性表</h1>
          <p className="text-slate-400">
            线性表是最基本、最简单的数据结构，包括顺序表（数组）和链式表（链表）两种存储方式
          </p>
        </div>

        {/* 输入控制 */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4">构建链表</h3>
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
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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

        {/* 知识点 */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">📚 顺序表 vs 链表</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-2">特性</th>
                  <th className="text-left py-2">顺序表</th>
                  <th className="text-left py-2">链表</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">存储方式</td>
                  <td className="py-2 text-blue-400">连续</td>
                  <td className="py-2 text-green-400">离散</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">随机访问</td>
                  <td className="py-2 text-green-400">O(1)</td>
                  <td className="py-2 text-red-400">O(n)</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">插入删除</td>
                  <td className="py-2 text-red-400">O(n)</td>
                  <td className="py-2 text-green-400">O(1)*</td>
                </tr>
                <tr>
                  <td className="py-2">空间利用</td>
                  <td className="py-2 text-amber-400">可能浪费</td>
                  <td className="py-2 text-green-400">按需分配</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-slate-500 mt-2">* 找到位置后的操作时间</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">🔗 链表类型</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <div>
                  <span className="text-white font-medium">单链表</span>
                  <span className="text-slate-400 text-sm ml-2">
                    每个节点只有一个指针域
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <div>
                  <span className="text-white font-medium">双向链表</span>
                  <span className="text-slate-400 text-sm ml-2">
                    有前驱和后继两个指针
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div>
                  <span className="text-white font-medium">循环链表</span>
                  <span className="text-slate-400 text-sm ml-2">
                    尾节点指向头节点
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
