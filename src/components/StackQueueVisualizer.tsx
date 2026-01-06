import { motion, AnimatePresence } from 'framer-motion';

interface StackVisualizerProps {
  items: number[];
  highlightedIndex?: number;
  operation?: 'push' | 'pop' | null;
}

export default function StackVisualizer({
  items,
  highlightedIndex,
  operation,
}: StackVisualizerProps) {
  const maxItems = 10;
  const itemHeight = 44;

  return (
    <div className="glass rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-sm font-medium text-slate-400 mb-4">栈可视化 (LIFO)</h3>

      <div className="flex justify-center">
        <div className="relative">
          {/* 栈容器 - 底部封闭，上方开口 */}
          <div
            className="relative border-l-4 border-r-4 border-b-4 border-slate-500 rounded-b-lg overflow-visible bg-slate-900/30"
            style={{
              width: 140,
              height: maxItems * itemHeight + 20,
            }}
          >
            {/* 栈底标签 */}
            <div className="absolute bottom-0 w-full text-center text-xs text-slate-500 py-1 bg-slate-800/80 rounded-b">
              栈底 (Bottom)
            </div>

            {/* 栈元素 - 从底部向上堆叠 */}
            <AnimatePresence>
              {items.map((item, index) => {
                // index 0 是栈底，应该在最下面
                // 栈顶元素 (items.length - 1) 应该在最上面
                const positionFromBottom = index * itemHeight + 24; // 24 是给栈底标签留的空间
                const isTop = index === items.length - 1;
                
                return (
                  <motion.div
                    key={`stack-${item}-${index}`}
                    className={`absolute left-1 right-1 flex items-center justify-center font-mono font-bold text-white rounded-md shadow-lg
                      ${
                        index === highlightedIndex
                          ? operation === 'push'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/30'
                            : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-red-500/30'
                          : isTop
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-blue-500/30'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-blue-600/20'
                      }
                    `}
                    style={{ 
                      height: itemHeight - 4,
                      bottom: positionFromBottom,
                    }}
                    initial={
                      isTop && operation === 'push'
                        ? { y: -80, opacity: 0, scale: 0.8 }
                        : { y: 0, opacity: 1, scale: 1 }
                    }
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -80, opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <span className="text-lg">{item}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* 栈顶指针 - 指向最上面的元素 */}
          {items.length > 0 && (
            <motion.div
              className="absolute left-full ml-3 flex items-center gap-2"
              style={{
                bottom: (items.length - 1) * itemHeight + 24 + itemHeight / 2 - 10,
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <svg width="24" height="16" className="text-yellow-400">
                <path d="M24 8 L4 8 M10 3 L4 8 L10 13" stroke="currentColor" strokeWidth="2.5" fill="none" />
              </svg>
              <span className="text-sm text-yellow-400 font-mono font-bold">TOP</span>
            </motion.div>
          )}

          {/* 空栈提示 */}
          {items.length === 0 && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              栈为空
            </motion.div>
          )}
        </div>
      </div>

      {/* 元素数量 */}
      <div className="mt-4 text-center">
        <span className="text-sm text-slate-400">
          元素数量: <span className="text-blue-400 font-mono">{items.length}</span> / {maxItems}
        </span>
      </div>
    </div>
  );
}

interface QueueVisualizerProps {
  items: number[];
  highlightedIndex?: number;
  operation?: 'enqueue' | 'dequeue' | null;
}

export function QueueVisualizer({
  items,
  highlightedIndex,
  operation,
}: QueueVisualizerProps) {
  const itemWidth = 64;

  return (
    <div className="glass rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-sm font-medium text-slate-400 mb-4">队列可视化 (FIFO)</h3>

      <div className="flex flex-col items-center">
        {/* 队列容器 */}
        <div className="relative flex items-center">
          {/* Front 指针 */}
          <div className="flex flex-col items-center mr-4">
            <span className="text-xs text-green-400 font-mono font-bold mb-1">FRONT</span>
            <svg width="20" height="30" className="text-green-400">
              <path d="M10 0 L10 20 M5 15 L10 20 L15 15" stroke="currentColor" strokeWidth="2.5" fill="none" />
            </svg>
          </div>

          {/* 队列元素 */}
          <div
            className="flex border-t-4 border-b-4 border-slate-500 rounded-lg overflow-hidden bg-slate-900/30"
            style={{ minWidth: 240, minHeight: 64 }}
          >
            <AnimatePresence>
              {items.length === 0 ? (
                <motion.div 
                  className="flex items-center justify-center w-full text-slate-500 text-sm px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  队列为空
                </motion.div>
              ) : (
                items.map((item, index) => (
                  <motion.div
                    key={`queue-${item}-${index}`}
                    className={`flex items-center justify-center font-mono font-bold text-white
                      ${
                        index === highlightedIndex
                          ? operation === 'enqueue'
                            ? 'bg-gradient-to-b from-green-500 to-emerald-500'
                            : 'bg-gradient-to-b from-red-500 to-rose-500'
                          : index === 0
                            ? 'bg-gradient-to-b from-green-600 to-green-700'
                            : index === items.length - 1
                              ? 'bg-gradient-to-b from-purple-500 to-purple-600'
                              : 'bg-gradient-to-b from-blue-500 to-blue-600'
                      }
                      ${index > 0 ? 'border-l border-slate-600' : ''}
                    `}
                    style={{ width: itemWidth, height: 56 }}
                    initial={
                      index === items.length - 1 && operation === 'enqueue'
                        ? { x: 50, opacity: 0, scale: 0.8 }
                        : { x: 0, opacity: 1, scale: 1 }
                    }
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: -50, opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <span className="text-lg">{item}</span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Rear 指针 */}
          <div className="flex flex-col items-center ml-4">
            <span className="text-xs text-purple-400 font-mono font-bold mb-1">REAR</span>
            <svg width="20" height="30" className="text-purple-400">
              <path d="M10 0 L10 20 M5 15 L10 20 L15 15" stroke="currentColor" strokeWidth="2.5" fill="none" />
            </svg>
          </div>
        </div>

        {/* 方向指示 */}
        <div className="flex items-center gap-3 mt-4 text-sm">
          <span className="text-green-400 font-medium">← 出队</span>
          <span className="text-slate-600">|</span>
          <span className="text-purple-400 font-medium">入队 →</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="text-sm text-slate-400">
          元素数量: <span className="text-blue-400 font-mono">{items.length}</span>
        </span>
      </div>
    </div>
  );
}
