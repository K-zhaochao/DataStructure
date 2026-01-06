import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrayVisualizer, PlayerControls, CodePanel } from '../components';
import {
  BubbleSortExecutor,
  QuickSortExecutor,
  SelectionSortExecutor,
  InsertionSortExecutor,
  MergeSortExecutor,
  HeapSortExecutor,
  ShellSortExecutor,
} from '../algorithms';
import { SortSnapshot, Snapshot } from '../types';
import { Shuffle } from 'lucide-react';

type SortAlgorithm = 'bubble' | 'quick' | 'selection' | 'insertion' | 'merge' | 'heap' | 'shell';

type SortExecutor = BubbleSortExecutor | QuickSortExecutor | SelectionSortExecutor | InsertionSortExecutor | MergeSortExecutor | HeapSortExecutor | ShellSortExecutor;

const algorithmInfo: Record<SortAlgorithm, { name: string; color: string }> = {
  bubble: { name: '冒泡排序', color: 'from-blue-500 to-cyan-500' },
  selection: { name: '选择排序', color: 'from-green-500 to-emerald-500' },
  insertion: { name: '插入排序', color: 'from-orange-500 to-amber-500' },
  shell: { name: '希尔排序', color: 'from-teal-500 to-cyan-500' },
  quick: { name: '快速排序', color: 'from-purple-500 to-pink-500' },
  merge: { name: '归并排序', color: 'from-indigo-500 to-blue-500' },
  heap: { name: '堆排序', color: 'from-red-500 to-rose-500' },
};

function generateRandomArray(size: number, max: number = 50): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1);
}

export default function SortPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortAlgorithm>('bubble');
  const [executor, setExecutor] = useState<SortExecutor>(() => new BubbleSortExecutor());
  const [currentStep, setCurrentStep] = useState(0);
  const [inputArray, setInputArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [inputValue, setInputValue] = useState('64, 34, 25, 12, 22, 11, 90');
  const [isExecuted, setIsExecuted] = useState(false);

  const handleAlgorithmChange = useCallback((algorithm: SortAlgorithm) => {
    setSelectedAlgorithm(algorithm);
    setIsExecuted(false);
    setCurrentStep(0);
    
    let newExecutor: SortExecutor;
    switch (algorithm) {
      case 'bubble':
        newExecutor = new BubbleSortExecutor();
        break;
      case 'quick':
        newExecutor = new QuickSortExecutor();
        break;
      case 'selection':
        newExecutor = new SelectionSortExecutor();
        break;
      case 'insertion':
        newExecutor = new InsertionSortExecutor();
        break;
      case 'merge':
        newExecutor = new MergeSortExecutor();
        break;
      case 'heap':
        newExecutor = new HeapSortExecutor();
        break;
      case 'shell':
        newExecutor = new ShellSortExecutor();
        break;
    }
    setExecutor(newExecutor);
  }, []);

  const handleExecute = useCallback(() => {
    const values = inputValue
      .split(',')
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));

    if (values.length === 0) return;

    setInputArray(values);
    executor.execute(values);
    setCurrentStep(0);
    setIsExecuted(true);
  }, [executor, inputValue]);

  const handleReset = useCallback(() => {
    executor.reset();
    setCurrentStep(0);
    setIsExecuted(false);
  }, [executor]);

  const handleRandomize = useCallback(() => {
    const newArray = generateRandomArray(10, 80);
    setInputArray(newArray);
    setInputValue(newArray.join(', '));
    handleReset();
  }, [handleReset]);

  const snapshots = executor.getSnapshots();
  const currentSnapshot = snapshots[currentStep] as Snapshot<SortSnapshot> | undefined;
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
          <h1 className="text-3xl font-bold text-white mb-2">排序算法</h1>
          <p className="text-slate-400">
            可视化展示各种排序算法的执行过程，理解不同算法的时间复杂度差异
          </p>
        </div>

        {/* 算法选择 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {(Object.keys(algorithmInfo) as SortAlgorithm[]).map((algo) => (
            <button
              key={algo}
              onClick={() => handleAlgorithmChange(algo)}
              className={`p-4 rounded-xl border transition-all ${
                selectedAlgorithm === algo
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div
                className={`h-1 w-12 mb-3 rounded bg-gradient-to-r ${algorithmInfo[algo].color}`}
              />
              <span className="text-white font-medium">{algorithmInfo[algo].name}</span>
            </button>
          ))}
        </div>

        {/* 输入控制 */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4">数据输入</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="输入待排序数组，用逗号分隔"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleRandomize}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Shuffle size={18} />
                随机生成
              </button>
              <button
                onClick={handleExecute}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                开始排序
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
            <ArrayVisualizer
              data={
                snapshotData?.array ||
                inputArray.map((value, index) => ({
                  id: `element-${index}`,
                  value,
                  state: 'default' as const,
                }))
              }
              comparingIndices={snapshotData?.comparingIndices}
              swappingIndices={snapshotData?.swappingIndices}
              sortedIndices={snapshotData?.sortedIndices}
              pivotIndex={snapshotData?.pivotIndex}
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

        {/* 复杂度对比 */}
        <div className="mt-8 glass rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">📊 排序算法复杂度对比</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-3 px-4">算法</th>
                  <th className="text-left py-3 px-4">最好情况</th>
                  <th className="text-left py-3 px-4">平均情况</th>
                  <th className="text-left py-3 px-4">最坏情况</th>
                  <th className="text-left py-3 px-4">空间复杂度</th>
                  <th className="text-left py-3 px-4">稳定性</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className={`border-b border-slate-700/50 ${selectedAlgorithm === 'bubble' ? 'bg-blue-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">冒泡排序</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-red-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(1)</td>
                  <td className="py-3 px-4 text-green-400">✓ 稳定</td>
                </tr>
                <tr className={`border-b border-slate-700/50 ${selectedAlgorithm === 'selection' ? 'bg-blue-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">选择排序</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-red-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(1)</td>
                  <td className="py-3 px-4 text-red-400">✗ 不稳定</td>
                </tr>
                <tr className={`border-b border-slate-700/50 ${selectedAlgorithm === 'insertion' ? 'bg-blue-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">插入排序</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-red-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(1)</td>
                  <td className="py-3 px-4 text-green-400">✓ 稳定</td>
                </tr>
                <tr className={`border-b border-slate-700/50 ${selectedAlgorithm === 'shell' ? 'bg-blue-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">希尔排序</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(n^1.3)</td>
                  <td className="py-3 px-4 font-mono text-red-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(1)</td>
                  <td className="py-3 px-4 text-red-400">✗ 不稳定</td>
                </tr>
                <tr className={`border-b border-slate-700/50 ${selectedAlgorithm === 'quick' ? 'bg-blue-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">快速排序</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-red-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(log n)</td>
                  <td className="py-3 px-4 text-red-400">✗ 不稳定</td>
                </tr>
                <tr className={`border-b border-slate-700/50 ${selectedAlgorithm === 'merge' ? 'bg-blue-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">归并排序</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(n)</td>
                  <td className="py-3 px-4 text-green-400">✓ 稳定</td>
                </tr>
                <tr className={`${selectedAlgorithm === 'heap' ? 'bg-blue-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">堆排序</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(1)</td>
                  <td className="py-3 px-4 text-red-400">✗ 不稳定</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
