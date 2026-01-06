import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const [array] = useState([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]);
  const [target, setTarget] = useState(15);
  const [searchState, setSearchState] = useState<{
    left: number;
    right: number;
    mid: number;
    found: boolean;
    searching: boolean;
    steps: Array<{ left: number; right: number; mid: number; comparison: string }>;
  }>({
    left: 0,
    right: array.length - 1,
    mid: -1,
    found: false,
    searching: false,
    steps: [],
  });

  const resetSearch = useCallback(() => {
    setSearchState({
      left: 0,
      right: array.length - 1,
      mid: -1,
      found: false,
      searching: false,
      steps: [],
    });
  }, [array.length]);

  const binarySearch = useCallback(async () => {
    resetSearch();
    setSearchState((prev) => ({ ...prev, searching: true }));

    let left = 0;
    let right = array.length - 1;
    const steps: typeof searchState.steps = [];

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      let comparison = '';

      if (array[mid] === target) {
        comparison = `arr[${mid}] = ${array[mid]} == ${target}，找到目标！`;
        steps.push({ left, right, mid, comparison });
        setSearchState({ left, right, mid, found: true, searching: false, steps: [...steps] });
        return;
      } else if (array[mid] < target) {
        comparison = `arr[${mid}] = ${array[mid]} < ${target}，搜索右半部分`;
        steps.push({ left, right, mid, comparison });
        setSearchState({ left, right, mid, found: false, searching: true, steps: [...steps] });
        await new Promise((resolve) => setTimeout(resolve, 800));
        left = mid + 1;
      } else {
        comparison = `arr[${mid}] = ${array[mid]} > ${target}，搜索左半部分`;
        steps.push({ left, right, mid, comparison });
        setSearchState({ left, right, mid, found: false, searching: true, steps: [...steps] });
        await new Promise((resolve) => setTimeout(resolve, 800));
        right = mid - 1;
      }
    }

    setSearchState((prev) => ({
      ...prev,
      searching: false,
      steps: [...steps, { left, right, mid: -1, comparison: `未找到目标 ${target}` }],
    }));
  }, [array, target, resetSearch]);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">查找算法</h1>
          <p className="text-slate-400">
            查找是在数据集合中寻找特定元素的过程，不同的数据结构支持不同的查找方式
          </p>
        </div>

        {/* 二分查找演示 */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">🔍 二分查找（折半查找）</h3>
          
          {/* 控制面板 */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-400">目标值:</label>
              <input
                type="number"
                value={target}
                onChange={(e) => {
                  setTarget(parseInt(e.target.value) || 0);
                  resetSearch();
                }}
                className="w-20 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={binarySearch}
              disabled={searchState.searching}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <SearchIcon size={18} />
              开始查找
            </button>
            <button
              onClick={resetSearch}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              重置
            </button>
          </div>

          {/* 数组可视化 */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-1 justify-center min-w-max">
              {array.map((value, index) => {
                const isLeft = index === searchState.left;
                const isRight = index === searchState.right;
                const isMid = index === searchState.mid;
                const isInRange = index >= searchState.left && index <= searchState.right;
                const isFound = isMid && searchState.found;

                return (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center"
                    initial={{ scale: 1 }}
                    animate={{
                      scale: isMid ? 1.1 : 1,
                    }}
                  >
                    {/* 指针标签 */}
                    <div className="h-6 text-xs font-mono">
                      {isLeft && <span className="text-green-400">L</span>}
                      {isMid && <span className="text-amber-400 mx-1">M</span>}
                      {isRight && <span className="text-red-400">R</span>}
                    </div>

                    {/* 元素 */}
                    <motion.div
                      className={`w-12 h-12 flex items-center justify-center rounded-lg font-mono font-bold transition-all ${
                        isFound
                          ? 'bg-green-500 text-white ring-4 ring-green-400/50'
                          : isMid
                          ? 'bg-amber-500 text-white'
                          : isInRange
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                      animate={{
                        opacity: isInRange || searchState.mid === -1 ? 1 : 0.4,
                      }}
                    >
                      {value}
                    </motion.div>

                    {/* 索引 */}
                    <span className="text-xs text-slate-500 mt-1">{index}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 查找步骤 */}
          {searchState.steps.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-slate-400">查找过程:</h4>
              {searchState.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-slate-900/50 rounded-lg text-sm"
                >
                  <span className="text-blue-400 font-mono">Step {index + 1}:</span>
                  <span className="text-slate-300 ml-2">{step.comparison}</span>
                  {step.mid >= 0 && (
                    <span className="text-slate-500 ml-2">
                      (left={step.left}, mid={step.mid}, right={step.right})
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* 查找算法对比 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">📊 查找算法对比</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-2">算法</th>
                  <th className="text-left py-2">时间复杂度</th>
                  <th className="text-left py-2">要求</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">顺序查找</td>
                  <td className="py-2 font-mono text-amber-400">O(n)</td>
                  <td className="py-2 text-slate-400">无</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">二分查找</td>
                  <td className="py-2 font-mono text-green-400">O(log n)</td>
                  <td className="py-2 text-slate-400">有序数组</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">哈希查找</td>
                  <td className="py-2 font-mono text-green-400">O(1)</td>
                  <td className="py-2 text-slate-400">哈希表</td>
                </tr>
                <tr>
                  <td className="py-2">BST 查找</td>
                  <td className="py-2 font-mono text-amber-400">O(log n)*</td>
                  <td className="py-2 text-slate-400">二叉搜索树</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-slate-500 mt-2">* 平衡情况下，最坏 O(n)</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">💡 二分查找要点</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>数组必须<strong className="text-white">有序</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>每次排除一半的搜索空间</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>注意边界条件：left &lt;= right</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>防止溢出：mid = left + (right - left) / 2</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">!</span>
                <span>查找失败时 left &gt; right</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 代码示例 */}
        <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">📝 二分查找代码</h3>
          <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-sm font-mono text-slate-300">
{`function binarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;  // 找到目标
        } else if (arr[mid] < target) {
            left = mid + 1;  // 搜索右半部分
        } else {
            right = mid - 1;  // 搜索左半部分
        }
    }
    
    return -1;  // 未找到
}`}
          </pre>
        </div>
      </motion.div>
    </div>
  );
}
