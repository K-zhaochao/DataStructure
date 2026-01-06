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
  const gap = 40;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 overflow-x-auto">
      <h3 className="text-sm font-medium text-slate-400 mb-4">链表可视化</h3>

      <div className="relative min-h-[120px]" style={{ minWidth: orderedNodes.length * (nodeWidth + gap) + 100 }}>
        {/* HEAD 指针 */}
        {headId && (
          <motion.div
            className="absolute top-0 left-4 flex flex-col items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs text-purple-400 font-mono mb-1">HEAD</span>
            <svg width="20" height="30" className="text-purple-400">
              <path d="M10 0 L10 20 M5 15 L10 20 L15 15" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </motion.div>
        )}

        {/* 节点 */}
        <div className="flex items-center pt-10 pl-4">
          {orderedNodes.map((node, index) => {
            const isHighlighted = highlightedNodes.includes(node.id);
            const isCurrent = node.id === currentPointer;

            return (
              <motion.div
                key={node.id}
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* 节点盒子 */}
                <motion.div
                  className={`relative flex border-2 rounded-lg overflow-hidden ${
                    isCurrent
                      ? 'border-yellow-400 shadow-lg shadow-yellow-400/30'
                      : isHighlighted
                      ? 'border-green-400 shadow-lg shadow-green-400/30'
                      : 'border-blue-500'
                  }`}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  style={{ width: nodeWidth, height: nodeHeight }}
                >
                  {/* 数据域 */}
                  <div
                    className={`flex-1 flex items-center justify-center ${
                      isCurrent ? 'bg-yellow-500/20' : isHighlighted ? 'bg-green-500/20' : 'bg-slate-700'
                    }`}
                  >
                    <span className="font-mono font-bold text-white">{node.value}</span>
                  </div>

                  {/* 指针域 */}
                  <div className="w-6 flex items-center justify-center bg-slate-600 border-l border-slate-500">
                    {node.next ? (
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                    ) : (
                      <span className="text-red-400 text-xs">∅</span>
                    )}
                  </div>

                  {/* 当前指针标记 */}
                  {isCurrent && (
                    <motion.div
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                    >
                      <span className="text-xs text-yellow-400 font-mono">current</span>
                      <svg width="20" height="20" className="mx-auto text-yellow-400">
                        <path d="M10 0 L10 15 M5 10 L10 15 L15 10" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>

                {/* 连接箭头 */}
                {node.next && (
                  <motion.svg
                    width={gap}
                    height="20"
                    className="text-blue-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.05 }}
                  >
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                      </marker>
                    </defs>
                    <line
                      x1="0"
                      y1="10"
                      x2={gap - 5}
                      y2="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  </motion.svg>
                )}
              </motion.div>
            );
          })}

          {/* NULL 标记 */}
          {orderedNodes.length > 0 && !orderedNodes[orderedNodes.length - 1]?.next && (
            <motion.div
              className="ml-4 text-slate-500 font-mono text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              NULL
            </motion.div>
          )}
        </div>

        {/* 空链表提示 */}
        {orderedNodes.length === 0 && (
          <div className="flex items-center justify-center h-20 text-slate-500">
            链表为空
          </div>
        )}
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs border-t border-slate-700 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-5 border-2 border-blue-500 rounded flex">
            <div className="flex-1 bg-slate-700" />
            <div className="w-2 bg-slate-600" />
          </div>
          <span className="text-slate-400">节点 [数据|指针]</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-5 border-2 border-yellow-400 rounded bg-yellow-500/20" />
          <span className="text-slate-400">当前访问</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-5 border-2 border-green-400 rounded bg-green-500/20" />
          <span className="text-slate-400">高亮节点</span>
        </div>
      </div>
    </div>
  );
}
