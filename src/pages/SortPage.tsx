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
import { Shuffle, BookOpen, Code2, Lightbulb, AlertTriangle, Zap, ArrowRightLeft, GitMerge, Layers } from 'lucide-react';

type SortAlgorithm = 'bubble' | 'quick' | 'selection' | 'insertion' | 'merge' | 'heap' | 'shell';
type SortCategory = 'insertion' | 'exchange' | 'selection' | 'merge';

type SortExecutor = BubbleSortExecutor | QuickSortExecutor | SelectionSortExecutor | InsertionSortExecutor | MergeSortExecutor | HeapSortExecutor | ShellSortExecutor;

const algorithmInfo: Record<SortAlgorithm, { name: string; color: string; category: SortCategory }> = {
  insertion: { name: '直接插入排序', color: 'from-orange-500 to-amber-500', category: 'insertion' },
  shell: { name: '希尔排序', color: 'from-teal-500 to-cyan-500', category: 'insertion' },
  bubble: { name: '冒泡排序', color: 'from-blue-500 to-cyan-500', category: 'exchange' },
  quick: { name: '快速排序', color: 'from-purple-500 to-pink-500', category: 'exchange' },
  selection: { name: '简单选择排序', color: 'from-green-500 to-emerald-500', category: 'selection' },
  heap: { name: '堆排序', color: 'from-red-500 to-rose-500', category: 'selection' },
  merge: { name: '归并排序', color: 'from-indigo-500 to-blue-500', category: 'merge' },
};

const categoryInfo: Record<SortCategory, { name: string; icon: React.ReactNode; description: string }> = {
  insertion: { 
    name: '插入排序类', 
    icon: <Layers className="w-5 h-5" />,
    description: '将一个记录插入到已排好序的有序表中'
  },
  exchange: { 
    name: '交换排序类', 
    icon: <ArrowRightLeft className="w-5 h-5" />,
    description: '两两比较，逆序则交换'
  },
  selection: { 
    name: '选择排序类', 
    icon: <Zap className="w-5 h-5" />,
    description: '每一趟选出最小的，与第 i 个交换'
  },
  merge: { 
    name: '归并排序类', 
    icon: <GitMerge className="w-5 h-5" />,
    description: '分而治之，将两个有序表合并成一个'
  },
};

function generateRandomArray(size: number, max: number = 50): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1);
}

export default function SortPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortAlgorithm>('insertion');
  const [executor, setExecutor] = useState<SortExecutor>(() => new InsertionSortExecutor());
  const [currentStep, setCurrentStep] = useState(0);
  const [inputArray, setInputArray] = useState<number[]>([49, 38, 65, 97, 76, 13, 27, 52]);
  const [inputValue, setInputValue] = useState('49, 38, 65, 97, 76, 13, 27, 52');
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
    const newArray = generateRandomArray(8, 80);
    setInputArray(newArray);
    setInputValue(newArray.join(', '));
    handleReset();
  }, [handleReset]);

  const snapshots = executor.getSnapshots();
  const currentSnapshot = snapshots[currentStep] as Snapshot<SortSnapshot> | undefined;
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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-red-900/30 border border-amber-700/30 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-amber-400 font-medium">第十章</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">内部排序</h1>
            <p className="text-slate-300 text-lg max-w-3xl">
              排序是将一组数据按照某种顺序重新排列的过程。本章深入讲解<strong className="text-amber-400">插入排序类</strong>、
              <strong className="text-orange-400">交换排序类</strong>、<strong className="text-red-400">选择排序类</strong>和
              <strong className="text-purple-400">归并排序</strong>四大类排序算法。
            </p>
          </div>
        </div>

        {/* 排序分类概述 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.entries(categoryInfo) as [SortCategory, typeof categoryInfo[SortCategory]][]).map(([key, info]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-5 border border-slate-700/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  key === 'insertion' ? 'bg-amber-500/20 text-amber-400' :
                  key === 'exchange' ? 'bg-blue-500/20 text-blue-400' :
                  key === 'selection' ? 'bg-green-500/20 text-green-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {info.icon}
                </div>
                <h3 className="text-white font-semibold">{info.name}</h3>
              </div>
              <p className="text-slate-400 text-sm">{info.description}</p>
            </motion.div>
          ))}
        </div>

        {/* ==================== 10.1 插入排序类 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">10.1 插入排序类 (Insertion Sort)</h2>
          </div>

          <div className="space-y-6">
            {/* 直接插入排序 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">1. 直接插入排序 (Direct Insertion Sort)</h3>
              <div className="space-y-4">
                <div className="text-slate-300">
                  <p className="mb-3">
                    <strong>思路</strong>：将数组分为<span className="text-green-400">"有序区"</span>和
                    <span className="text-yellow-400">"无序区"</span>。初始时，第一个元素是有序区。
                    每次从无序区取一个元素，在有序区中<strong className="text-blue-400">从后往前扫描</strong>，找到合适位置插入。
                  </p>
                  <p className="text-slate-400 text-sm">
                    <strong>哨兵 (Sentinel)</strong>：<code className="px-2 py-0.5 bg-slate-700 rounded">A[0]</code> 常作为哨兵，
                    防止数组越界，同时作为暂存单元。
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-400">伪代码 (必背)</span>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
{`void InsertSort(ElementType A[], int n) {
    for (i = 2; i <= n; i++) {
        if (A[i] < A[i-1]) {       // 若需要插入
            A[0] = A[i];           // 1. 设置哨兵
            A[i] = A[i-1];         // 2. 后移一位
            
            // 3. 从后往前查找插入位置
            for (j = i-2; A[0] < A[j]; --j) {
                A[j+1] = A[j];     // 记录后移
            }
            A[j+1] = A[0];         // 4. 插入到正确位置
        }
    }
}`}
                  </pre>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-400 font-medium mb-2">📝 案例分析：49, 38, 65, 97, 76...</div>
                  <div className="text-slate-300 text-sm space-y-1">
                    <p>• <code>i=2 (38)</code>: 38 &lt; 49，49后移，38插头 → <span className="text-green-400">[38, 49]</span>, 65...</p>
                    <p>• <code>i=3 (65)</code>: 65 &gt; 49，不移动 → <span className="text-green-400">[38, 49, 65]</span>, 97...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 希尔排序 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-teal-400 mb-3">2. 希尔排序 (Shell Sort)</h3>
              <div className="space-y-4">
                <div className="text-slate-300">
                  <p className="mb-3">
                    <strong>思路</strong>：<span className="text-teal-400 font-semibold">缩小增量排序</span>。
                    将序列按增量 <code className="px-2 py-0.5 bg-slate-700 rounded">d</code> 分组，对每组进行直接插入排序，
                    然后减小 d 重复，直到 d=1。
                  </p>
                  <p className="text-slate-400 text-sm">
                    <strong>目的</strong>：让序列"基本有序"，从而让最后一次 d=1 的插入排序非常快。
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-teal-400" />
                    <span className="text-sm font-medium text-teal-400">伪代码</span>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
{`void ShellSort(ElementType A[], int n) {
    // 增量 d 逐步减半，直到 1
    for (d = n/2; d >= 1; d = d/2) {
        // 对每一组进行直接插入排序
        for (i = d + 1; i <= n; ++i) {
            if (A[i] < A[i-d]) {
                A[0] = A[i];       // 暂存
                // 在子序列中查找位置
                for (j = i-d; j > 0 && A[0] < A[j]; j -= d) {
                    A[j+d] = A[j]; // 后移，跨度为 d
                }
                A[j+d] = A[0];     // 插入
            }
        }
    }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 10.2 交换排序类 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">10.2 交换排序类 (Exchange Sort)</h2>
          </div>

          <div className="space-y-6">
            {/* 冒泡排序 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">1. 冒泡排序 (Bubble Sort)</h3>
              <div className="space-y-4">
                <div className="text-slate-300">
                  <p><strong>思路</strong>：每一趟将最大的元素<span className="text-blue-400">"浮"</span>到最后。</p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">伪代码 (含优化)</span>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
{`void BubbleSort(ElementType A[], int n) {
    bool flag;  // 优化：如果一趟没发生交换，说明已有序
    
    for (i = 1; i < n; i++) {      // 进行 n-1 趟
        flag = false;
        // 从前向后扫描，边界逐次减小
        for (j = 1; j <= n - i; j++) { 
            if (A[j] > A[j+1]) {   // 若逆序，交换
                swap(A[j], A[j+1]);
                flag = true;
            }
        }
        if (flag == false) break; // 提前结束
    }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* 快速排序 - 重点 */}
            <div className="bg-slate-800/50 rounded-xl p-5 border-2 border-purple-500/30">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-semibold text-purple-400">2. 快速排序 (Quick Sort)</h3>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">必考重点</span>
              </div>
              <div className="space-y-4">
                <div className="text-slate-300">
                  <p className="mb-3">
                    <strong>思路</strong>：<span className="text-purple-400 font-semibold">分治法</span>。
                    选基准 (pivot)，将比基准小的放左边，大的放右边（<strong>Partition</strong>过程），然后递归。
                  </p>
                  <p className="text-slate-400 text-sm">
                    <strong>Partition实现</strong>：经典的"双指针交换法"。
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-400">Partition 函数 (核心代码，必背！)</span>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
{`// 核心划分函数：返回基准值最终所在的位置
int Partition(ElementType A[], int low, int high) {
    ElementType pivot = A[low];  // 1. 选取第一个元素为基准
    
    while (low < high) {
        // 2. High指针左移：找比 pivot 小的
        while (low < high && A[high] >= pivot) high--;
        A[low] = A[high];        // 移到左端
        
        // 3. Low指针右移：找比 pivot 大的
        while (low < high && A[low] <= pivot) low++;
        A[high] = A[low];        // 移到右端
    }
    
    A[low] = pivot;  // 4. 基准归位
    return low;      // 返回基准位置
}

void QuickSort(ElementType A[], int low, int high) {
    if (low < high) {
        int pivotPos = Partition(A, low, high); // 划分
        QuickSort(A, low, pivotPos - 1);        // 递归左半部分
        QuickSort(A, pivotPos + 1, high);       // 递归右半部分
    }
}`}
                  </pre>
                </div>

                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-400 font-medium mb-2">📝 案例分析：49, 38, 65, 97, 76, 13, 27, 52</div>
                  <div className="text-slate-300 text-sm space-y-2">
                    <p>1. 基准选 <code className="px-1 bg-purple-500/30 rounded">49</code></p>
                    <p>2. <code>high</code> 找比49小的 → <code>27</code>，移到左边</p>
                    <p>3. <code>low</code> 找比49大的 → <code>65</code>，移到右边</p>
                    <p>4. 一趟结束后：<span className="text-green-400">27, 38, 13</span>, <span className="text-purple-400 font-bold">[49]</span>, <span className="text-yellow-400">76, 97, 65, 52</span></p>
                    <p className="text-emerald-400">✓ 49 已就位，左边都比它小，右边都比它大</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 10.3 选择排序类 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">10.3 选择排序类 (Selection Sort)</h2>
          </div>

          <div className="space-y-6">
            {/* 简单选择排序 */}
            <div className="bg-slate-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-green-400 mb-3">1. 简单选择排序 (Simple Selection Sort)</h3>
              <div className="space-y-4">
                <div className="text-slate-300">
                  <p><strong>思路</strong>：每一趟在后面 n-i 个中选出最小的，与第 i 个交换。</p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">伪代码</span>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
{`void SelectSort(ElementType A[], int n) {
    for (i = 1; i < n; i++) {
        min_idx = i;  // 假设当前第i个是最小的
        
        // 在后面找更小的
        for (j = i + 1; j <= n; j++) {
            if (A[j] < A[min_idx]) {
                min_idx = j;
            }
        }
        
        // 如果找到了更小的，交换
        if (min_idx != i) {
            swap(A[i], A[min_idx]);
        }
    }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* 堆排序 - 难点 */}
            <div className="bg-slate-800/50 rounded-xl p-5 border-2 border-red-500/30">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-semibold text-red-400">2. 堆排序 (Heap Sort)</h3>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">难点</span>
              </div>
              <div className="space-y-4">
                <div className="text-slate-300">
                  <p className="mb-3">
                    <strong>思路</strong>：将数组看作<span className="text-red-400 font-semibold">完全二叉树</span>。
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li><strong>建堆</strong>：从最后一个非叶子节点开始，向下调整 (<code>HeapAdjust</code>)</li>
                    <li><strong>排序</strong>：输出堆顶（交换到数组末尾），然后对剩余部分重新向下调整</li>
                  </ol>
                  <p className="mt-3 text-slate-400 text-sm">
                    <strong>注意</strong>：升序排序通常建立<span className="text-red-400">大顶堆</span>（最大值在根，换到数组末尾后，末尾就是最大值）
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-medium text-red-400">HeapAdjust 函数 (核心代码，必背！)</span>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
{`// 核心：向下调整 (筛选)
// 假设 start 结点的左右子树已经是堆，将 start 下沉到合适位置
void HeapAdjust(ElementType A[], int start, int end) {
    ElementType temp = A[start];
    // j 初始指向左孩子 (2*start)
    for (int j = 2 * start; j <= end; j *= 2) {
        // 让 j 指向左右孩子中较大的那个
        if (j < end && A[j] < A[j+1]) j++; 
        
        if (temp >= A[j]) break;  // 根比孩子都大，不需要调整了
        
        A[start] = A[j];  // 孩子上移
        start = j;        // 继续向下层比较
    }
    A[start] = temp;  // 放入最终位置
}

void HeapSort(ElementType A[], int n) {
    // 1. 初建堆 (大顶堆)，从最后一个非叶子节点 (n/2) 开始
    for (int i = n / 2; i > 0; i--) {
        HeapAdjust(A, i, n);
    }
    
    // 2. 排序输出
    for (int i = n; i > 1; i--) {
        swap(A[1], A[i]);       // 把堆顶(最大值)交换到末尾
        HeapAdjust(A, 1, i-1);  // 把剩余的 i-1 个元素重新调整为堆
    }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 10.4 归并排序 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <GitMerge className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">10.4 归并排序 (Merge Sort)</h2>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-5">
            <div className="space-y-4">
              <div className="text-slate-300">
                <p className="mb-3">
                  <strong>核心思想</strong>：<span className="text-indigo-400 font-semibold">分而治之</span>，将两个有序表合并成一个。
                </p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-400">伪代码</span>
                </div>
                <pre className="text-sm text-slate-300 overflow-x-auto">
{`// 合并两个有序序列 A[low..mid] 和 A[mid+1..high] 到 Temp
void Merge(ElementType A[], ElementType Temp[], int low, int mid, int high) {
    int i = low, j = mid + 1, k = low;
    
    // 比较两个序列的头，谁小取谁
    while (i <= mid && j <= high) {
        if (A[i] <= A[j]) Temp[k++] = A[i++];
        else              Temp[k++] = A[j++];
    }
    
    // 将剩余部分复制进去
    while (i <= mid)  Temp[k++] = A[i++];
    while (j <= high) Temp[k++] = A[j++];
    
    // 拷回原数组
    for (i = low; i <= high; i++) A[i] = Temp[i];
}

void MergeSort(ElementType A[], ElementType Temp[], int low, int high) {
    if (low < high) {
        int mid = (low + high) / 2;
        MergeSort(A, Temp, low, mid);       // 左边有序
        MergeSort(A, Temp, mid + 1, high);  // 右边有序
        Merge(A, Temp, low, mid, high);     // 合并
    }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 算法演示区域 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">🎯 动画演示</h2>
            <span className="text-slate-400 text-sm">选择算法，观察排序过程</span>
          </div>

          {/* 算法选择 - 按分类组织 */}
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 插入排序类 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-amber-400">插入排序类</div>
                <div className="space-y-2">
                  {(['insertion', 'shell'] as SortAlgorithm[]).map((algo) => (
                    <button
                      key={algo}
                      onClick={() => handleAlgorithmChange(algo)}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        selectedAlgorithm === algo
                          ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className={`h-1 w-8 mb-2 rounded bg-gradient-to-r ${algorithmInfo[algo].color}`} />
                      <span className="text-white text-sm">{algorithmInfo[algo].name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 交换排序类 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-blue-400">交换排序类</div>
                <div className="space-y-2">
                  {(['bubble', 'quick'] as SortAlgorithm[]).map((algo) => (
                    <button
                      key={algo}
                      onClick={() => handleAlgorithmChange(algo)}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        selectedAlgorithm === algo
                          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className={`h-1 w-8 mb-2 rounded bg-gradient-to-r ${algorithmInfo[algo].color}`} />
                      <span className="text-white text-sm">{algorithmInfo[algo].name}</span>
                      {algo === 'quick' && <span className="ml-2 text-xs text-red-400">★ 重点</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* 选择排序类 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-green-400">选择排序类</div>
                <div className="space-y-2">
                  {(['selection', 'heap'] as SortAlgorithm[]).map((algo) => (
                    <button
                      key={algo}
                      onClick={() => handleAlgorithmChange(algo)}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        selectedAlgorithm === algo
                          ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className={`h-1 w-8 mb-2 rounded bg-gradient-to-r ${algorithmInfo[algo].color}`} />
                      <span className="text-white text-sm">{algorithmInfo[algo].name}</span>
                      {algo === 'heap' && <span className="ml-2 text-xs text-amber-400">★ 难点</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* 归并排序类 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-indigo-400">归并排序类</div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleAlgorithmChange('merge')}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      selectedAlgorithm === 'merge'
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <div className={`h-1 w-8 mb-2 rounded bg-gradient-to-r ${algorithmInfo['merge'].color}`} />
                    <span className="text-white text-sm">{algorithmInfo['merge'].name}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 输入控制 */}
          <div className="bg-slate-800/50 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-medium text-slate-400 mb-4">数据输入（经典案例：49, 38, 65, 97, 76, 13, 27, 52）</h3>
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
        </div>

        {/* ==================== 复杂度对比表格 ==================== */}
        <div className="glass rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-4">📊 排序算法复杂度对比</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-3 px-4">算法</th>
                  <th className="text-left py-3 px-4">核心操作</th>
                  <th className="text-left py-3 px-4">最好</th>
                  <th className="text-left py-3 px-4">平均</th>
                  <th className="text-left py-3 px-4">最坏</th>
                  <th className="text-left py-3 px-4">空间</th>
                  <th className="text-left py-3 px-4">稳定性</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className={`border-b border-slate-700/50 ${selectedAlgorithm === 'insertion' ? 'bg-amber-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">直接插入</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">后移 A[j+1]=A[j]</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-red-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(1)</td>
                  <td className="py-3 px-4 text-green-400">✓ 稳定</td>
                </tr>
                <tr className={`border-b border-slate-700/50 ${selectedAlgorithm === 'shell' ? 'bg-teal-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">希尔排序</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">缩小增量</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(n^1.3)</td>
                  <td className="py-3 px-4 font-mono text-red-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(1)</td>
                  <td className="py-3 px-4 text-red-400">✗ 不稳定</td>
                </tr>
                <tr className={`border-b border-slate-700/50 ${selectedAlgorithm === 'bubble' ? 'bg-blue-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">冒泡排序</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">相邻交换</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-red-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(1)</td>
                  <td className="py-3 px-4 text-green-400">✓ 稳定</td>
                </tr>
                <tr className={`border-b border-slate-700/50 ${selectedAlgorithm === 'quick' ? 'bg-purple-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">快速排序 ★</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">Partition划分</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-red-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(log n)</td>
                  <td className="py-3 px-4 text-red-400">✗ 不稳定</td>
                </tr>
                <tr className={`border-b border-slate-700/50 ${selectedAlgorithm === 'selection' ? 'bg-green-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">简单选择</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">选最小交换</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-red-400">O(n²)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(1)</td>
                  <td className="py-3 px-4 text-red-400">✗ 不稳定</td>
                </tr>
                <tr className={`border-b border-slate-700/50 ${selectedAlgorithm === 'heap' ? 'bg-red-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">堆排序 ★</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">HeapAdjust筛选</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(1)</td>
                  <td className="py-3 px-4 text-red-400">✗ 不稳定</td>
                </tr>
                <tr className={`${selectedAlgorithm === 'merge' ? 'bg-indigo-500/10' : ''}`}>
                  <td className="py-3 px-4 font-medium text-white">归并排序</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">Merge合并</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-green-400">O(n log n)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">O(n)</td>
                  <td className="py-3 px-4 text-green-400">✓ 稳定</td>
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
                  <li>• <strong>QuickSort</strong> 的 <code className="px-1 bg-slate-700 rounded">Partition</code> 函数</li>
                  <li>• <strong>HeapSort</strong> 的 <code className="px-1 bg-slate-700 rounded">HeapAdjust</code> 函数</li>
                  <li>• 这两个是代码填空/算法设计题最高频考点</li>
                </ul>
              </div>

              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <div className="text-blue-400 font-semibold mb-2">📝 稳定性记忆口诀</div>
                <div className="text-slate-300 text-sm">
                  <p className="mb-2">不稳定的排序（记"<strong className="text-yellow-400">快选希堆</strong>"）：</p>
                  <p className="text-slate-400">快速排序、选择排序、希尔排序、堆排序</p>
                  <p className="mt-2">其他都是稳定的（插入、冒泡、归并）</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <div className="text-purple-400 font-semibold mb-2">🔍 快排最坏情况</div>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• 当序列已经有序或逆序时，快排退化为 O(n²)</li>
                  <li>• 每次划分都不均匀（1:n-1）</li>
                  <li>• 解决方法：随机选择基准、三数取中</li>
                </ul>
              </div>

              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                <div className="text-green-400 font-semibold mb-2">💡 空间复杂度注意</div>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• 快排：O(log n) ~ O(n)（递归栈空间）</li>
                  <li>• 归并：O(n)（需要额外数组）</li>
                  <li>• 其他原地排序：O(1)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
            <div className="text-amber-400 font-semibold mb-3">📊 选择排序算法的场景</div>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
              <div>
                <div className="text-white font-medium mb-1">数据量小 & 基本有序</div>
                <p className="text-slate-400">→ 直接插入排序</p>
              </div>
              <div>
                <div className="text-white font-medium mb-1">数据量大 & 追求效率</div>
                <p className="text-slate-400">→ 快速排序（平均最快）</p>
              </div>
              <div>
                <div className="text-white font-medium mb-1">要求稳定性</div>
                <p className="text-slate-400">→ 归并排序</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
