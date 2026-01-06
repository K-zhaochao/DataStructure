import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, BookOpen, Code2, AlertTriangle, Lightbulb, Database, Hash, TreeDeciduous, RotateCcw, Scale } from 'lucide-react';

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
        comparison = `arr[${mid}] = ${array[mid]} < ${target}，搜索右半部分 (low = mid + 1)`;
        steps.push({ left, right, mid, comparison });
        setSearchState({ left, right, mid, found: false, searching: true, steps: [...steps] });
        await new Promise((resolve) => setTimeout(resolve, 800));
        left = mid + 1;
      } else {
        comparison = `arr[${mid}] = ${array[mid]} > ${target}，搜索左半部分 (high = mid - 1)`;
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
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* 章节标题 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/30 via-blue-900/20 to-indigo-900/30 border border-cyan-700/30 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-cyan-400 font-medium">第九章</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">查找 (Search)</h1>
            <p className="text-slate-300 text-lg max-w-3xl">
              查找是数据处理的核心操作之一，它的效率直接决定了系统的性能。
              本章从最简单的<strong className="text-cyan-400">顺序查找</strong>开始，
              升级到<strong className="text-blue-400">树形查找（BST、AVL）</strong>，
              最后是用空间换时间的<strong className="text-purple-400">哈希查找</strong>。
            </p>
          </div>
        </div>

        {/* ==================== 9.1 静态查找 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">9.1 静态查找 (Static Search)</h2>
          </div>

          <p className="text-slate-400 mb-6">静态查找表中，数据集合相对稳定，主要操作是检索。</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 顺序查找 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-green-400 mb-3">1. 顺序查找 (Sequential Search)</h3>
              <div className="space-y-3 text-slate-300">
                <p><strong>方法</strong>：从头到尾一个一个比。</p>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-sm space-y-1">
                    <p><strong>效率</strong>：</p>
                    <p>• 成功平均查找长度 (ASL)：<span className="text-cyan-400 font-mono">(n+1)/2</span></p>
                    <p>• 时间复杂度：<span className="text-amber-400 font-mono">O(n)</span></p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm"><strong>特点</strong>：算法简单，对数据无序要求，但慢。</p>
              </div>
            </div>

            {/* 折半查找 */}
            <div className="bg-slate-800/50 rounded-xl p-5 border border-cyan-500/30">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold text-cyan-400">2. 折半查找 / 二分查找</h3>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">必考</span>
              </div>
              <div className="space-y-3 text-slate-300">
                <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30 text-sm">
                  <strong className="text-red-400">前提</strong>：<span className="text-white">必须是顺序存储的有序表</span>
                </div>
                <div className="text-sm space-y-2">
                  <p><strong>方法</strong>：每次跟中间元素 <code className="px-1 bg-slate-700 rounded">mid</code> 比。</p>
                  <ul className="list-disc list-inside text-slate-400 space-y-1 ml-2">
                    <li>如果 <code>key &lt; mid</code>，去左半边找 (<code>high = mid - 1</code>)</li>
                    <li>如果 <code>key &gt; mid</code>，去右半边找 (<code>low = mid + 1</code>)</li>
                  </ul>
                </div>
                <p className="text-sm">
                  <strong>判定树</strong>：折半查找的过程可以用一棵二叉树来描述。树的深度决定了查找次数。
                </p>
                <p className="text-sm">
                  <strong>时间复杂度</strong>：<span className="text-green-400 font-mono">O(log₂n)</span>
                </p>
              </div>
            </div>
          </div>

          {/* 二分查找伪代码 */}
          <div className="mt-6 bg-slate-900/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <span className="text-lg font-semibold text-cyan-400">二分查找代码核心（必背）</span>
            </div>
            <pre className="text-sm text-slate-300 overflow-x-auto">
{`while (low <= high) {
    mid = (low + high) / 2;
    if (key == a[mid]) return mid;      // 找到了
    else if (key < a[mid]) high = mid - 1;  // 去左半边
    else low = mid + 1;                     // 去右半边
}
return -1;  // 查找失败`}
            </pre>
          </div>
        </div>

        {/* ==================== 9.2 动态查找 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <TreeDeciduous className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">9.2 动态查找 (Dynamic Search)</h2>
          </div>

          <p className="text-slate-400 mb-6">动态查找表在查找过程中可能进行插入或删除操作。</p>

          <div className="space-y-6">
            {/* 二叉排序树 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">1. 二叉排序树 (BST, Binary Sort Tree)</h3>
              <div className="space-y-4 text-slate-300">
                <div>
                  <p className="font-semibold mb-2">定义：</p>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                    <li>左子树所有节点 <span className="text-red-400">&lt;</span> 根节点</li>
                    <li>右子树所有节点 <span className="text-green-400">&gt;</span> 根节点</li>
                  </ul>
                </div>
                
                <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                  <p className="text-sm">
                    <strong className="text-green-400">重要性质</strong>：<strong className="text-white">中序遍历</strong>一棵 BST，可以得到一个<strong className="text-white">有序序列</strong>。
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">查找效率（取决于树的形状）：</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-green-500/10 rounded p-3">
                      <div className="text-green-400 font-medium mb-1">最好情况（像完全二叉树）</div>
                      <div className="font-mono text-lg text-green-400">O(log₂n)</div>
                    </div>
                    <div className="bg-red-500/10 rounded p-3">
                      <div className="text-red-400 font-medium mb-1">最坏情况（退化成单支树/链表）</div>
                      <div className="font-mono text-lg text-red-400">O(n)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 平衡二叉树 */}
            <div className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold text-purple-400">2. 平衡二叉树 (AVL Tree)</h3>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">难点</span>
              </div>
              <div className="space-y-4 text-slate-300">
                <p className="text-sm">为了防止 BST 退化成链表，引入了平衡机制。</p>

                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                  <p className="mb-2"><strong className="text-purple-400">定义</strong>：任意节点的左右子树高度差（<strong>平衡因子 BF</strong>）的绝对值不超过 1。</p>
                  <div className="text-center">
                    <span className="font-mono text-xl text-purple-400">|BF| ≤ 1</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <RotateCcw className="w-4 h-4 text-purple-400" />
                    <span className="font-semibold text-purple-400">平衡调整（旋转）口诀</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">当插入节点导致失衡时，需要旋转。四种类型：</p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-blue-500/10 rounded p-3">
                      <div className="text-blue-400 font-semibold">LL 型</div>
                      <p className="text-slate-400">左子树的左边插入导致</p>
                      <p className="text-white">→ <strong>右单旋</strong></p>
                    </div>
                    <div className="bg-green-500/10 rounded p-3">
                      <div className="text-green-400 font-semibold">RR 型</div>
                      <p className="text-slate-400">右子树的右边插入导致</p>
                      <p className="text-white">→ <strong>左单旋</strong></p>
                    </div>
                    <div className="bg-amber-500/10 rounded p-3">
                      <div className="text-amber-400 font-semibold">LR 型</div>
                      <p className="text-slate-400">左子树的右边插入导致</p>
                      <p className="text-white">→ <strong>先左旋后右旋</strong></p>
                    </div>
                    <div className="bg-red-500/10 rounded p-3">
                      <div className="text-red-400 font-semibold">RL 型</div>
                      <p className="text-slate-400">右子树的左边插入导致</p>
                      <p className="text-white">→ <strong>先右旋后左旋</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 9.3 哈希表 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Hash className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">9.3 哈希表 (Hash Table) / 散列表</h2>
          </div>

          <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/30 mb-6">
            <p className="text-slate-300">
              这是查找速度<strong className="text-indigo-400">最快</strong>的方法，
              理想情况下复杂度为 <span className="font-mono text-green-400">O(1)</span>。
            </p>
            <p className="text-lg text-center mt-3">
              核心思想：<span className="font-mono text-xl text-indigo-400">地址 = f(关键字)</span>
            </p>
          </div>

          <div className="space-y-6">
            {/* 哈希函数构造 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">1. 哈希函数构造</h3>
              <p className="text-slate-400 text-sm mb-4">目标是让地址分布均匀，减少冲突。</p>
              
              <div className="space-y-3">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="font-medium text-white mb-1">直接定址法</div>
                  <p className="text-slate-400 text-sm">H(key) = a × key + b</p>
                  <p className="text-slate-500 text-xs mt-1">适合关键字分布连续的情况。</p>
                </div>
                
                <div className="bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">除留余数法</span>
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">最常用</span>
                  </div>
                  <p className="font-mono text-indigo-400 text-lg">H(key) = key % p</p>
                  <p className="text-slate-400 text-sm mt-2">
                    <strong className="text-amber-400">p 的选择很重要</strong>：通常取<strong className="text-white">小于等于表长的最大质数</strong>。
                  </p>
                </div>
                
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="font-medium text-white mb-1">其他方法</div>
                  <p className="text-slate-400 text-sm">数字分析法、平方取中法等。</p>
                </div>
              </div>
            </div>

            {/* 处理冲突 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">2. 处理冲突 (Collision Resolution)</h3>
              <p className="text-slate-400 text-sm mb-4">
                当 <code className="px-1 bg-slate-700 rounded">H(key₁) = H(key₂)</code> 时，就发生了<strong className="text-red-400">冲突</strong>。
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="font-medium text-amber-400 mb-2">开放定址法 (Open Addressing)</div>
                  <p className="text-slate-400 text-sm mb-3">这就好比这个坑被占了，我去下一个坑看看。</p>
                  <div className="space-y-2 text-sm">
                    <div className="bg-amber-500/10 rounded p-2">
                      <div className="text-white font-medium">线性探测</div>
                      <p className="text-slate-400">d<sub>i</sub> = 1, 2, 3...（挨着往后找）</p>
                      <p className="text-red-400 text-xs mt-1">⚠️ 容易产生"堆积"现象</p>
                    </div>
                    <div className="bg-green-500/10 rounded p-2">
                      <div className="text-white font-medium">二次探测</div>
                      <p className="text-slate-400">d<sub>i</sub> = 1², -1², 2², -2²...（跳着找）</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="font-medium text-green-400 mb-2">链地址法 (Chaining)</div>
                  <p className="text-slate-400 text-sm mb-3">这就好比坑被占了，我就在这个坑上面盖楼（挂链表）。</p>
                  <div className="bg-green-500/10 rounded p-3 text-sm">
                    <p className="text-white">所有同义词存储在一个单链表中。</p>
                    <p className="text-green-400 text-xs mt-2">✓ 不会产生堆积，删除方便</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ASL 计算 */}
            <div className="bg-slate-800/50 rounded-xl p-5 border-2 border-red-500/30">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-semibold text-red-400">3. 性能分析 (ASL 计算)</h3>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">计算题重灾区</span>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 rounded-lg p-3">
                    <div className="text-green-400 font-medium mb-2">ASL 成功</div>
                    <p className="text-slate-300 text-sm">所有元素查找到所需比较次数的和 / 元素个数</p>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-3">
                    <div className="text-red-400 font-medium mb-2">ASL 不成功</div>
                    <p className="text-slate-300 text-sm">查找失败时（到空位置）所需比较次数的和 / 哈希函数可能的取值个数 (即 p)</p>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-blue-400 font-medium mb-3">📝 例题思路</div>
                  <p className="text-slate-300 text-sm mb-3">
                    给定关键字序列 <code className="px-1 bg-slate-700 rounded">{'{19, 14, 23, 1}'}</code>，
                    哈希函数 H(k) = k % 7，表长 7。
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 text-sm text-slate-300 font-mono space-y-1">
                    <p>• 19 % 7 = 5，放位置 5。（比较1次）</p>
                    <p>• 14 % 7 = 0，放位置 0。（比较1次）</p>
                    <p>• 23 % 7 = 2，放位置 2。（比较1次）</p>
                    <p>• 1 % 7 = 1，放位置 1。（比较1次）</p>
                    <p className="text-green-400 mt-2">ASL<sub>成功</sub> = (1+1+1+1)/4 = 1</p>
                  </div>
                  <p className="text-amber-400 text-xs mt-3">
                    ⚠️ 如果发生冲突（比如线性探测），记得把探测次数累加。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 动画演示区域 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">🎯 动画演示：二分查找</h2>
          </div>

          {/* 控制面板 */}
          <div className="bg-slate-800/50 rounded-xl p-5 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">目标值:</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => {
                    setTarget(parseInt(e.target.value) || 0);
                    resetSearch();
                  }}
                  className="w-20 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                onClick={binarySearch}
                disabled={searchState.searching}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
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
              <div className="text-slate-400 text-sm">
                有序数组: <code className="px-2 py-1 bg-slate-700 rounded">[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]</code>
              </div>
            </div>
          </div>

          {/* 数组可视化 */}
          <div className="bg-slate-800/50 rounded-xl p-5 mb-6">
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
                      <div className="h-6 text-xs font-mono flex items-center justify-center gap-1">
                        {isLeft && <span className="text-green-400 font-bold">low</span>}
                        {isMid && <span className="text-amber-400 font-bold mx-1">mid</span>}
                        {isRight && <span className="text-red-400 font-bold">high</span>}
                      </div>

                      {/* 元素 */}
                      <motion.div
                        className={`w-12 h-12 flex items-center justify-center rounded-lg font-mono font-bold transition-all ${
                          isFound
                            ? 'bg-green-500 text-white ring-4 ring-green-400/50'
                            : isMid
                            ? 'bg-amber-500 text-white'
                            : isInRange
                            ? 'bg-cyan-500 text-white'
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

            {/* 指针说明 */}
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span className="text-slate-400">low (左边界)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-400 rounded"></div>
                <span className="text-slate-400">mid (中间元素)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span className="text-slate-400">high (右边界)</span>
              </div>
            </div>
          </div>

          {/* 查找步骤 */}
          {searchState.steps.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h4 className="text-sm font-medium text-slate-400 mb-3">查找过程:</h4>
              <div className="space-y-2">
                {searchState.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-slate-900/50 rounded-lg text-sm flex flex-wrap items-center gap-2"
                  >
                    <span className="text-cyan-400 font-mono font-bold">Step {index + 1}:</span>
                    <span className="text-slate-300">{step.comparison}</span>
                    {step.mid >= 0 && (
                      <span className="text-slate-500 text-xs">
                        (low={step.left}, mid={step.mid}, high={step.right})
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================== 查找算法对比 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-4">📊 查找算法对比</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-3 px-4">算法</th>
                  <th className="text-left py-3 px-4">时间复杂度</th>
                  <th className="text-left py-3 px-4">前提要求</th>
                  <th className="text-left py-3 px-4">特点</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium text-white">顺序查找</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(n)</td>
                  <td className="py-3 px-4 text-slate-400">无</td>
                  <td className="py-3 px-4 text-slate-400">简单，效率低</td>
                </tr>
                <tr className="border-b border-slate-700/50 bg-cyan-500/5">
                  <td className="py-3 px-4 font-medium text-white">二分查找 ★</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(log n)</td>
                  <td className="py-3 px-4 text-cyan-400 font-medium">有序 + 顺序存储</td>
                  <td className="py-3 px-4 text-slate-400">效率高，必背代码</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium text-white">BST 查找</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-green-400">O(log n)</span>
                    <span className="text-slate-500"> ~ </span>
                    <span className="font-mono text-red-400">O(n)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">二叉排序树</td>
                  <td className="py-3 px-4 text-slate-400">可能退化</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium text-white">AVL 查找</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(log n)</td>
                  <td className="py-3 px-4 text-slate-400">平衡二叉树</td>
                  <td className="py-3 px-4 text-slate-400">始终平衡，有旋转开销</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">哈希查找</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(1)</td>
                  <td className="py-3 px-4 text-slate-400">哈希表 + 好的哈希函数</td>
                  <td className="py-3 px-4 text-slate-400">最快，需处理冲突</td>
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
                <div className="text-red-400 font-semibold mb-2">⚠️ 必背代码</div>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• 二分查找的代码必须滚瓜烂熟</li>
                  <li>• 边界条件 <code className="px-1 bg-slate-700 rounded">low &lt;= high</code> 容易写错</li>
                  <li>• <code className="px-1 bg-slate-700 rounded">mid = (low + high) / 2</code></li>
                </ul>
              </div>

              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <div className="text-purple-400 font-semibold mb-2">🎨 画图题</div>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• 给你一个序列，画出生成的<strong>二叉排序树</strong></li>
                  <li>• 给你一个失衡的 AVL 树，画出旋转后的结果</li>
                  <li>• 掌握 LL、RR、LR、RL 四种旋转类型</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <div className="text-blue-400 font-semibold mb-2">📊 哈希计算题</div>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• 哈希表的 ASL 计算（成功与不成功）一定要亲自算几遍</li>
                  <li>• 特别是"<strong className="text-amber-400">不成功</strong>"时的分母是<strong>模数 p</strong> 这一点经常被搞混</li>
                  <li>• 冲突处理时记得累加探测次数</li>
                </ul>
              </div>

              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                <div className="text-green-400 font-semibold mb-2">💡 BST vs AVL</div>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• BST 中序遍历得到有序序列</li>
                  <li>• AVL 是为了解决 BST 退化问题</li>
                  <li>• AVL 的平衡因子：|左子树高度 - 右子树高度| ≤ 1</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
