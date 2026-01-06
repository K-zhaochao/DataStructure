import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import StackVisualizer, { QueueVisualizer } from '../components/StackQueueVisualizer';
import { Plus, Minus } from 'lucide-react';

export default function StackQueue() {
  // 栈状态
  const [stack, setStack] = useState<number[]>([]);
  const [stackInput, setStackInput] = useState('');
  const [stackOperation, setStackOperation] = useState<'push' | 'pop' | null>(null);
  const [stackHighlight, setStackHighlight] = useState<number | undefined>();

  // 队列状态
  const [queue, setQueue] = useState<number[]>([]);
  const [queueInput, setQueueInput] = useState('');
  const [queueOperation, setQueueOperation] = useState<'enqueue' | 'dequeue' | null>(null);
  const [queueHighlight, setQueueHighlight] = useState<number | undefined>();

  // 栈操作
  const handlePush = useCallback(() => {
    const value = parseInt(stackInput);
    if (isNaN(value)) return;
    
    setStackOperation('push');
    setStack((prev) => [...prev, value]);
    setStackHighlight(stack.length);
    setStackInput('');
    
    setTimeout(() => {
      setStackOperation(null);
      setStackHighlight(undefined);
    }, 500);
  }, [stackInput, stack.length]);

  const handlePop = useCallback(() => {
    if (stack.length === 0) return;
    
    setStackOperation('pop');
    setStackHighlight(stack.length - 1);
    
    setTimeout(() => {
      setStack((prev) => prev.slice(0, -1));
      setStackOperation(null);
      setStackHighlight(undefined);
    }, 300);
  }, [stack.length]);

  // 队列操作
  const handleEnqueue = useCallback(() => {
    const value = parseInt(queueInput);
    if (isNaN(value)) return;
    
    setQueueOperation('enqueue');
    setQueue((prev) => [...prev, value]);
    setQueueHighlight(queue.length);
    setQueueInput('');
    
    setTimeout(() => {
      setQueueOperation(null);
      setQueueHighlight(undefined);
    }, 500);
  }, [queueInput, queue.length]);

  const handleDequeue = useCallback(() => {
    if (queue.length === 0) return;
    
    setQueueOperation('dequeue');
    setQueueHighlight(0);
    
    setTimeout(() => {
      setQueue((prev) => prev.slice(1));
      setQueueOperation(null);
      setQueueHighlight(undefined);
    }, 300);
  }, [queue.length]);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">栈与队列</h1>
          <p className="text-slate-400">
            栈和队列是两种操作受限的线性表，栈是后进先出（LIFO），队列是先进先出（FIFO）
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 栈 */}
          <div className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">🥞 栈 (Stack)</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePush()}
                  placeholder="输入数值"
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handlePush}
                  disabled={!stackInput}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Push
                </button>
                <button
                  onClick={handlePop}
                  disabled={stack.length === 0}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Minus size={18} />
                  Pop
                </button>
              </div>
            </div>

            <StackVisualizer
              items={stack}
              highlightedIndex={stackHighlight}
              operation={stackOperation}
            />

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <h4 className="text-sm font-medium text-slate-400 mb-3">栈的应用场景</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  函数调用栈（递归）
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  表达式求值与括号匹配
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  浏览器前进/后退
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  撤销操作 (Undo)
                </li>
              </ul>
            </div>
          </div>

          {/* 队列 */}
          <div className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">🚶‍♂️ 队列 (Queue)</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  value={queueInput}
                  onChange={(e) => setQueueInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
                  placeholder="输入数值"
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleEnqueue}
                  disabled={!queueInput}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  入队
                </button>
                <button
                  onClick={handleDequeue}
                  disabled={queue.length === 0}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Minus size={18} />
                  出队
                </button>
              </div>
            </div>

            <QueueVisualizer
              items={queue}
              highlightedIndex={queueHighlight}
              operation={queueOperation}
            />

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <h4 className="text-sm font-medium text-slate-400 mb-3">队列的应用场景</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  任务调度与消息队列
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  广度优先搜索 (BFS)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  打印任务队列
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  缓冲区管理
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 对比表格 */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">📊 栈 vs 队列 对比</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-3 px-4">特性</th>
                  <th className="text-left py-3 px-4">栈 (Stack)</th>
                  <th className="text-left py-3 px-4">队列 (Queue)</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium">操作原则</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">LIFO</span>
                    <span className="text-slate-500 ml-2">后进先出</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">FIFO</span>
                    <span className="text-slate-500 ml-2">先进先出</span>
                  </td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium">插入操作</td>
                  <td className="py-3 px-4 font-mono text-green-400">push()</td>
                  <td className="py-3 px-4 font-mono text-green-400">enqueue()</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium">删除操作</td>
                  <td className="py-3 px-4 font-mono text-red-400">pop()</td>
                  <td className="py-3 px-4 font-mono text-red-400">dequeue()</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium">查看操作</td>
                  <td className="py-3 px-4 font-mono text-blue-400">top() / peek()</td>
                  <td className="py-3 px-4 font-mono text-blue-400">front()</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">时间复杂度</td>
                  <td className="py-3 px-4 text-green-400">O(1)</td>
                  <td className="py-3 px-4 text-green-400">O(1)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
