import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import StackVisualizer, { QueueVisualizer } from '../components/StackQueueVisualizer';
import { Plus, Minus, BookOpen, Lightbulb, Code, Clock, AlertTriangle, Zap } from 'lucide-react';

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

  // 当前选择的主题
  const [activeSection, setActiveSection] = useState<'stack' | 'queue'>('stack');

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
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* ===== 第一部分：章节标题与核心导论 ===== */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-purple-400 font-medium">第三章</p>
              <h1 className="text-3xl font-bold text-white">栈和队列</h1>
            </div>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed max-w-4xl">
            在数据结构的江湖里，栈（Stack）和队列（Queue）被称为<span className="text-purple-400 font-semibold">受限的线性表</span>。
            什么叫"受限"？就是不准你随便插队，也不准你随便从中间抽人。所有的进出，都有严格的规矩。
            这一章我们不仅要手写这两个容器，更要理解它们背后解决的核心问题：
            <span className="text-amber-400">顺序的可逆性与缓冲</span>。
          </p>
        </header>

        {/* ===== 选项卡切换 ===== */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveSection('stack')}
            className={`px-8 py-4 rounded-xl font-medium transition-all flex items-center gap-3 ${
              activeSection === 'stack'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <span className="text-2xl">🥞</span>
            <div className="text-left">
              <div className="font-bold">栈 (Stack)</div>
              <div className="text-sm opacity-80">LIFO - 后进先出</div>
            </div>
          </button>
          <button
            onClick={() => setActiveSection('queue')}
            className={`px-8 py-4 rounded-xl font-medium transition-all flex items-center gap-3 ${
              activeSection === 'queue'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <span className="text-2xl">🚶‍♂️</span>
            <div className="text-left">
              <div className="font-bold">队列 (Queue)</div>
              <div className="text-sm opacity-80">FIFO - 先进先出</div>
            </div>
          </button>
        </div>

        {/* ===== 栈的内容 ===== */}
        {activeSection === 'stack' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 栈的概念讲解 */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="text-amber-400" size={24} />
                <h2 className="text-xl font-bold text-white">核心定义：后进先出的哲学</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-purple-400 mb-4">🥞 什么是栈？</h3>
                  <p className="text-slate-300 mb-4">
                    栈是一个 <span className="text-purple-400 font-bold">LIFO (Last In First Out)</span> 结构。
                  </p>
                  <div className="space-y-3 text-sm text-slate-400">
                    <p>
                      想象你在洗盘子，洗好的盘子一个接一个往上摞（Push），取用的时候只能拿最上面的（Pop）。
                    </p>
                    <p>
                      或者想象给手枪弹夹装子弹，<span className="text-amber-400">最先压进去的子弹，最后才能打出来</span>。
                    </p>
                  </div>

                  <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 mb-2">栈的两个关键指针：</p>
                    <ul className="text-sm space-y-1">
                      <li><span className="text-purple-400 font-mono">栈底 (Bottom)</span>：通常是固定的</li>
                      <li><span className="text-purple-400 font-mono">栈顶 (Top)</span>：随着元素的进出上下浮动</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-purple-400 mb-4">⚙️ 实现方式</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                      <p className="text-sm text-purple-400 font-medium mb-2">顺序栈 (数组实现)</p>
                      <p className="text-xs text-slate-400 mb-2">
                        设计痛点：<code className="text-purple-400">top</code> 指针到底指向哪里？
                      </p>
                      <ul className="text-xs text-slate-400 space-y-1">
                        <li>• 流派 A：top 指向栈顶元素本身，初始化 <code className="text-green-400">top = -1</code></li>
                        <li>• 流派 B：top 指向栈顶元素的下一个空位，初始化 <code className="text-amber-400">top = 0</code></li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                      <p className="text-sm text-green-400 font-medium mb-2">链式栈 (链表实现)</p>
                      <p className="text-xs text-slate-400">
                        本质是一个<span className="text-green-400">只能在头部插入和删除的单链表</span>。
                        优势：永远不会满（除非内存耗尽）
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 代码展示 */}
              <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
                <h4 className="text-sm font-medium text-slate-400 mb-4">关键操作代码（top = -1 流派）</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <p className="text-sm text-green-400 font-medium mb-2">进栈 Push</p>
                    <pre className="text-xs text-slate-300 font-mono">{`bool Push(const T& x) {
    if (IsFull()) overflowProcess();
    top++;              // 先让指针往上移
    elements[top] = x;  // 再放数据
    return true;
}`}</pre>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <p className="text-sm text-red-400 font-medium mb-2">出栈 Pop</p>
                    <pre className="text-xs text-slate-300 font-mono">{`bool Pop(T& x) {
    if (IsEmpty()) return false;
    x = elements[top];  // 先取数据
    top--;              // 指针下移
    return true;
}`}</pre>
                  </div>
                </div>
              </div>
            </section>

            {/* 栈的应用 */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="text-yellow-400" size={24} />
                <h2 className="text-xl font-bold text-white">栈的硬核应用</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                    <span className="text-blue-400 font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">递归的消除</h3>
                  <p className="text-slate-400 text-sm">
                    递归之所以能工作，是因为系统帮你维护了一个隐形的"栈"，保存了每一层调用的参数和返回地址。
                    <span className="text-amber-400">如果你想把递归改成非递归，通常需要自己手动维护一个栈。</span>
                  </p>
                </div>

                <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                    <span className="text-purple-400 font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">括号匹配</h3>
                  <p className="text-slate-400 text-sm mb-2">面试高频题：</p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• 遇到左括号 <code className="text-green-400">(, [, {'{'}</code> → 入栈</li>
                    <li>• 遇到右括号 <code className="text-red-400">), ], {'}'}</code> → 检查栈顶</li>
                    <li>• 最后栈必须为空</li>
                  </ul>
                </div>

                <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                    <span className="text-green-400 font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">表达式求值</h3>
                  <p className="text-slate-400 text-sm">
                    中缀表达式 <code className="text-slate-300">4 + 2 * 3</code> 转后缀 <code className="text-green-400">4 2 3 * +</code>。
                    后缀表达式不需要括号，读到运算符就从栈里弹出两个数计算。
                  </p>
                </div>
              </div>
            </section>

            {/* 栈的动画演示 */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Code className="text-purple-400" size={24} />
                <h2 className="text-xl font-bold text-white">动画演示：栈操作</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                  <div className="flex gap-2 mb-4">
                    <input
                      type="number"
                      value={stackInput}
                      onChange={(e) => setStackInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePush()}
                      placeholder="输入数值"
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
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
                  
                  <StackVisualizer
                    items={stack}
                    highlightedIndex={stackHighlight}
                    operation={stackOperation}
                  />
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h4 className="text-sm font-medium text-slate-400 mb-4">当前状态</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">栈内元素数</span>
                      <span className="text-white font-mono">{stack.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">栈顶指针 top</span>
                      <span className="text-purple-400 font-mono">{stack.length - 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">栈顶元素</span>
                      <span className="text-green-400 font-mono">{stack.length > 0 ? stack[stack.length - 1] : '空'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-slate-500">
                      💡 提示：观察 Push 时 top 先增后存，Pop 时先取后减
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* ===== 队列的内容 ===== */}
        {activeSection === 'queue' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 队列的概念讲解 */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="text-amber-400" size={24} />
                <h2 className="text-xl font-bold text-white">核心定义：先进先出的秩序</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-blue-400 mb-4">🚶‍♂️ 什么是队列？</h3>
                  <p className="text-slate-300 mb-4">
                    队列是一个 <span className="text-blue-400 font-bold">FIFO (First In First Out)</span> 结构。
                  </p>
                  <p className="text-sm text-slate-400 mb-4">
                    就像排队做核酸，<span className="text-amber-400">先来的人先捅</span>。
                  </p>

                  <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 mb-2">队列的两个关键指针：</p>
                    <ul className="text-sm space-y-1">
                      <li><span className="text-blue-400 font-mono">队尾 (Rear)</span>：只允许在这里插入（EnQueue）</li>
                      <li><span className="text-blue-400 font-mono">队头 (Front)</span>：只允许在这里删除（DeQueue）</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-red-400 mb-4">⚠️ 顺序队列的"假溢出"危机</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    如果我们用普通数组做队列，随着入队出队，front 和 rear 都会一直向后跑。
                    当 rear 跑到数组尽头时，哪怕 front 前面已经空出了大量位置，我们也无法利用。
                    这叫<span className="text-red-400 font-bold">假溢出</span>。
                  </p>
                  
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-sm text-green-400 font-medium mb-2">✅ 解决方案：循环队列</p>
                    <p className="text-xs text-slate-400">
                      将数组看作一个首尾相接的圆环。
                      <span className="text-green-400">数学魔法：取模运算 %</span>
                    </p>
                    <code className="text-xs text-blue-400 block mt-2">index = (index + 1) % maxSize</code>
                  </div>
                </div>
              </div>

              {/* 循环队列重点 */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/30 mb-6">
                <h3 className="text-lg font-bold text-amber-400 mb-4">🔥 本章难点：循环队列的队空与队满</h3>
                <p className="text-slate-300 mb-4">
                  如果是环形的，当 <code className="text-amber-400">front == rear</code> 时，可能是空的，也可能是满的（跑了一圈追上来了）。
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <p className="text-sm text-white font-medium mb-2">解决方案：牺牲一个存储单元</p>
                    <ul className="text-sm text-slate-400 space-y-2">
                      <li>
                        <span className="text-blue-400">队空条件：</span>
                        <code className="text-green-400 ml-2">front == rear</code>
                      </li>
                      <li>
                        <span className="text-red-400">队满条件：</span>
                        <code className="text-amber-400 ml-2">(rear + 1) % maxSize == front</code>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <p className="text-sm text-white font-medium mb-2">计算队列长度（必考公式）</p>
                    <code className="text-green-400 text-sm block">
                      length = (rear - front + maxSize) % maxSize
                    </code>
                    <p className="text-xs text-slate-500 mt-2">
                      ⚠️ 千万别直接 rear - front，因为 rear 可能比 front 小！
                    </p>
                  </div>
                </div>
              </div>

              {/* 代码展示 */}
              <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h4 className="text-sm font-medium text-slate-400 mb-4">循环队列关键操作代码</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <p className="text-sm text-green-400 font-medium mb-2">入队 EnQueue</p>
                    <pre className="text-xs text-slate-300 font-mono">{`bool EnQueue(const T& x) {
    // 先判断满没满
    if ((rear + 1) % maxSize == front)
        return false;
    elements[rear] = x;
    rear = (rear + 1) % maxSize; // 循环移动
    return true;
}`}</pre>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <p className="text-sm text-red-400 font-medium mb-2">出队 DeQueue</p>
                    <pre className="text-xs text-slate-300 font-mono">{`bool DeQueue(T& x) {
    if (front == rear) return false; // 队空
    x = elements[front];
    front = (front + 1) % maxSize; // 循环移动
    return true;
}`}</pre>
                  </div>
                </div>
              </div>
            </section>

            {/* 队列的应用 */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="text-yellow-400" size={24} />
                <h2 className="text-xl font-bold text-white">队列的应用场景</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-blue-400 mb-4">📊 杨辉三角打印</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    利用队列的<span className="text-blue-400">缓冲特性</span>。
                    第 i 行的数据通过计算产生第 i+1 行的数据。
                  </p>
                  <p className="text-xs text-slate-500">
                    这展示了队列作为数据缓冲区 (Buffer) 的作用——在生产者和消费者之间建立桥梁。
                  </p>
                </div>
                
                <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h4 className="text-sm font-medium text-slate-400 mb-3">更多应用</h4>
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
                      操作系统进程调度
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 队列的动画演示 */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Code className="text-blue-400" size={24} />
                <h2 className="text-xl font-bold text-white">动画演示：队列操作</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
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
                  
                  <QueueVisualizer
                    items={queue}
                    highlightedIndex={queueHighlight}
                    operation={queueOperation}
                  />
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h4 className="text-sm font-medium text-slate-400 mb-4">当前状态</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">队列长度</span>
                      <span className="text-white font-mono">{queue.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">队头元素</span>
                      <span className="text-green-400 font-mono">{queue.length > 0 ? queue[0] : '空'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">队尾元素</span>
                      <span className="text-blue-400 font-mono">{queue.length > 0 ? queue[queue.length - 1] : '空'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-slate-500">
                      💡 提示：观察入队从队尾进入，出队从队头离开
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* ===== 对比表格（始终显示） ===== */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold text-white">栈 vs 队列 对比（考试重点）</h2>
          </div>

          <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
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
        </section>

        {/* ===== 考试避坑指南 ===== */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-red-400" size={24} />
            <h2 className="text-xl font-bold text-white">考试避坑指南</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-400 mb-3">🥞 栈的注意事项</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">1.</span>
                  <span>关注 <code className="text-purple-400">top</code> 的初始值，是 -1 还是 0？这决定了是 <code>elements[++top]=x</code> 还是 <code>elements[top++]=x</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">2.</span>
                  <span>应用场景：逆序输出、递归、括号匹配、后缀表达式</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/30">
              <h3 className="text-lg font-bold text-blue-400 mb-3">🚶‍♂️ 队列的注意事项</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">1.</span>
                  <span><strong>循环队列是重点</strong>：<code className="text-amber-400">(rear+1)%maxSize==front</code> 是判满，<code className="text-green-400">rear==front</code> 是判空</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">2.</span>
                  <span><strong>计算长度</strong>：正确公式是 <code className="text-green-400">(rear-front+maxSize)%maxSize</code></span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
