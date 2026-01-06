import { motion } from 'framer-motion';
import { ListNode } from '../types';

interface LinkedListVisualizerProps {
  nodes: ListNode[];
  headId: string | null;
  currentPointer?: string | null;
  highlightedNodes?: string[];
}

export default function LinkedListVisualizer({
  nodes,
  headId,
  currentPointer,
  highlightedNodes = [],
}: LinkedListVisualizerProps) {
  // 按链表顺序排列节点
  const orderedNodes: ListNode[] = [];
  let currentId = headId;
  const visited = new Set<string>();

  while (currentId && !visited.has(currentId)) {
    const node = nodes.find((n) => n.id === currentId);
    if (node) {
      orderedNodes.push(node);
      visited.add(currentId);
      currentId = node.next;
    } else {
      break;
    }
  }

  const nodeWidth = 80;
  const nodeHeight = 50;
  const gap = 50;

  // 生成唯一的箭头 marker ID
  const arrowMarkerId = `linkedlist-arrow-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 overflow-x-auto">
      <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        链表可视化
      </h3>

      {/* SVG 定义箭头标记 - 全局定义一次 */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <marker
            id={arrowMarkerId}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
          </marker>
          <marker
            id={`${arrowMarkerId}-highlight`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#4ade80" />
          </marker>
          <marker
            id={`${arrowMarkerId}-current`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#facc15" />
          </marker>
        </defs>
      </svg>

      <div className="relative min-h-[140px]" style={{ minWidth: orderedNodes.length * (nodeWidth + gap) + 120 }}>
        {/* HEAD 指针 */}
        {headId && (
          <motion.div
            className="absolute top-0 left-6 flex flex-col items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xs text-purple-400 font-mono font-semibold mb-1 px-2 py-0.5 bg-purple-500/20 rounded">
              HEAD
            </span>
            <svg width="20" height="24" className="text-purple-400">
              <path 
                d="M10 0 L10 18 M5 13 L10 18 L15 13" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}

        {/* 节点容器 */}
        <div className="flex items-center pt-12 pl-6">
          {orderedNodes.map((node, index) => {
            const isHighlighted = highlightedNodes.includes(node.id);
            const isCurrent = node.id === currentPointer;
            const nextNode = node.next ? orderedNodes.find(n => n.id === node.next) : null;
            const isNextHighlighted = nextNode && highlightedNodes.includes(nextNode.id);
            const isNextCurrent = nextNode && nextNode.id === currentPointer;

            // 确定箭头颜色
            let arrowMarker = `url(#${arrowMarkerId})`;
            let arrowColor = '#60a5fa';
            if (isCurrent || isNextCurrent) {
              arrowMarker = `url(#${arrowMarkerId}-current)`;
              arrowColor = '#facc15';
            } else if (isHighlighted || isNextHighlighted) {
              arrowMarker = `url(#${arrowMarkerId}-highlight)`;
              arrowColor = '#4ade80';
            }

            return (
              <motion.div
                key={node.id}
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
              >
                {/* 节点盒子 */}
                <motion.div
                  className={`relative flex border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                    isCurrent
                      ? 'border-yellow-400 shadow-lg shadow-yellow-400/40 ring-2 ring-yellow-400/30'
                      : isHighlighted
                      ? 'border-green-400 shadow-lg shadow-green-400/40 ring-2 ring-green-400/30'
                      : 'border-blue-500/70 hover:border-blue-400'
                  }`}
                  animate={{
                    scale: isCurrent ? 1.08 : isHighlighted ? 1.04 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{ width: nodeWidth, height: nodeHeight }}
                >
                  {/* 数据域 */}
                  <div
                    className={`flex-1 flex items-center justify-center transition-colors duration-300 ${
                      isCurrent 
                        ? 'bg-gradient-to-br from-yellow-500/30 to-yellow-600/20' 
                        : isHighlighted 
                        ? 'bg-gradient-to-br from-green-500/30 to-green-600/20' 
                        : 'bg-slate-700/80'
                    }`}
                  >
                    <span className={`font-mono font-bold text-lg ${
                      isCurrent ? 'text-yellow-200' : isHighlighted ? 'text-green-200' : 'text-white'
                    }`}>
                      {node.value}
                    </span>
                  </div>

                  {/* 指针域 */}
                  <div className={`w-7 flex items-center justify-center border-l transition-colors duration-300 ${
                    isCurrent 
                      ? 'bg-yellow-600/30 border-yellow-500/50' 
                      : isHighlighted 
                      ? 'bg-green-600/30 border-green-500/50' 
                      : 'bg-slate-600/80 border-slate-500/50'
                  }`}>
                    {node.next ? (
                      <motion.div 
                        className={`w-2.5 h-2.5 rounded-full ${
                          isCurrent ? 'bg-yellow-400' : isHighlighted ? 'bg-green-400' : 'bg-blue-400'
                        }`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    ) : (
                      <span className="text-red-400 text-xs font-bold">∅</span>
                    )}
                  </div>

                  {/* 当前指针标记 */}
                  {isCurrent && (
                    <motion.div
                      className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-xs text-yellow-400 font-mono font-semibold px-2 py-0.5 bg-yellow-500/20 rounded mb-1">
                        current
                      </span>
                      <svg width="16" height="16" className="text-yellow-400">
                        <path 
                          d="M8 0 L8 12 M4 8 L8 12 L12 8" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>

                {/* 连接箭头 */}
                {node.next && (
                  <motion.svg
                    width={gap}
                    height="20"
                    className="flex-shrink-0"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: index * 0.08 + 0.04, duration: 0.2 }}
                    style={{ originX: 0 }}
                  >
                    <line
                      x1="2"
                      y1="10"
                      x2={gap - 8}
                      y2="10"
                      stroke={arrowColor}
                      strokeWidth="2"
                      markerEnd={arrowMarker}
                      strokeLinecap="round"
                    />
                  </motion.svg>
                )}
              </motion.div>
            );
          })}

          {/* NULL 标记 */}
          {orderedNodes.length > 0 && !orderedNodes[orderedNodes.length - 1]?.next && (
            <motion.div
              className="ml-2 px-3 py-1 bg-slate-700/50 rounded-lg border border-slate-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: orderedNodes.length * 0.08 }}
            >
              <span className="text-slate-400 font-mono text-sm">NULL</span>
            </motion.div>
          )}
        </div>

        {/* 空链表提示 */}
        {orderedNodes.length === 0 && (
          <motion.div 
            className="flex items-center justify-center h-24 text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📭</div>
              <span>链表为空</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs border-t border-slate-700 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-6 border-2 border-blue-500/70 rounded flex overflow-hidden">
            <div className="flex-1 bg-slate-700/80 flex items-center justify-center">
              <span className="text-[10px] text-white">值</span>
            </div>
            <div className="w-2 bg-slate-600/80 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-400"></div>
            </div>
          </div>
          <span className="text-slate-400">节点 [数据|指针]</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-yellow-400 rounded bg-yellow-500/20 shadow shadow-yellow-400/30" />
          <span className="text-slate-400">当前访问</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-green-400 rounded bg-green-500/20 shadow shadow-green-400/30" />
          <span className="text-slate-400">高亮节点</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="24" height="12">
            <line x1="2" y1="6" x2="18" y2="6" stroke="#60a5fa" strokeWidth="2" />
            <polygon points="16 3, 22 6, 16 9" fill="#60a5fa" />
          </svg>
          <span className="text-slate-400">next 指针</span>
        </div>
      </div>
    </div>
  );
}
