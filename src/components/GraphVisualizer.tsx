import React from 'react';
import { motion } from 'framer-motion';
import { GraphSnapshot, GraphNode, GraphEdge } from '../algorithms/graph';

interface GraphVisualizerProps {
  snapshot: GraphSnapshot;
  width?: number;
  height?: number;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  snapshot,
  width = 600,
  height = 400,
}) => {
  const { nodes, edges, visitedNodes, currentNode, highlightedEdges, distances, queue, stack } = snapshot;

  const getNodeColor = (node: GraphNode): string => {
    if (node.id === currentNode) return '#f59e0b'; // amber - 当前节点
    switch (node.state) {
      case 'path': return '#10b981'; // green - 路径
      case 'visited': return '#3b82f6'; // blue - 已访问
      case 'visiting': return '#8b5cf6'; // purple - 正在访问
      default: return '#64748b'; // gray - 默认
    }
  };

  const getEdgeColor = (edge: GraphEdge): string => {
    switch (edge.state) {
      case 'path': return '#10b981';
      case 'visited': return '#3b82f6';
      case 'visiting': return '#f59e0b';
      default: return '#475569';
    }
  };

  const getEdgeWidth = (edge: GraphEdge): number => {
    switch (edge.state) {
      case 'path': return 4;
      case 'visited': return 3;
      case 'visiting': return 3;
      default: return 2;
    }
  };

  const isEdgeHighlighted = (edge: GraphEdge): boolean => {
    return highlightedEdges?.some(
      ([from, to]) => 
        (edge.from === from && edge.to === to) || 
        (edge.from === to && edge.to === from)
    ) || false;
  };

  return (
    <div className="space-y-4">
      <svg 
        width={width} 
        height={height} 
        className="glass rounded-xl mx-auto"
        style={{ background: 'rgba(15, 23, 42, 0.6)' }}
      >
        <defs>
          {/* 箭头标记 */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
          </marker>
          <marker
            id="arrowhead-highlight"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
          </marker>
          <marker
            id="arrowhead-path"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
          </marker>
        </defs>

        {/* 绘制边 */}
        {edges.map((edge, index) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const dx = toNode.x - fromNode.x;
          const dy = toNode.y - fromNode.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nodeRadius = 24;
          
          // 缩短边，使其不与节点重叠
          const startX = fromNode.x + (dx / len) * nodeRadius;
          const startY = fromNode.y + (dy / len) * nodeRadius;
          const endX = toNode.x - (dx / len) * (nodeRadius + 8);
          const endY = toNode.y - (dy / len) * (nodeRadius + 8);

          const highlighted = isEdgeHighlighted(edge);
          const markerId = edge.state === 'path' 
            ? 'url(#arrowhead-path)' 
            : highlighted 
              ? 'url(#arrowhead-highlight)' 
              : 'url(#arrowhead)';

          return (
            <g key={`edge-${index}`}>
              <motion.line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={highlighted ? '#f59e0b' : getEdgeColor(edge)}
                strokeWidth={highlighted ? 3 : getEdgeWidth(edge)}
                markerEnd={markerId}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
              {/* 边权重标签 */}
              {edge.weight !== undefined && (
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 8}
                  fill="#94a3b8"
                  fontSize="12"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}

        {/* 绘制节点 */}
        {nodes.map((node) => (
          <motion.g
            key={node.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {/* 节点圆圈 */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={24}
              fill={getNodeColor(node)}
              stroke={node.id === currentNode ? '#fbbf24' : 'transparent'}
              strokeWidth={3}
              animate={{
                scale: node.id === currentNode ? [1, 1.1, 1] : 1,
              }}
              transition={{
                repeat: node.id === currentNode ? Infinity : 0,
                duration: 0.5,
              }}
              style={{
                filter: visitedNodes.includes(node.id) 
                  ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' 
                  : 'none',
              }}
            />
            {/* 节点标签 */}
            <text
              x={node.x}
              y={node.y + 1}
              fill="white"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {node.label}
            </text>
            {/* 距离标签 */}
            {distances && distances.get(node.id) !== undefined && (
              <text
                x={node.x}
                y={node.y + 38}
                fill="#94a3b8"
                fontSize="11"
                textAnchor="middle"
                className="font-mono"
              >
                d={distances.get(node.id) === Infinity ? '∞' : distances.get(node.id)}
              </text>
            )}
          </motion.g>
        ))}
      </svg>

      {/* 队列/栈显示 */}
      {(queue || stack) && (
        <div className="flex justify-center gap-4">
          {queue && (
            <div className="glass px-4 py-2 rounded-lg">
              <span className="text-gray-400 text-sm mr-2">队列:</span>
              <span className="text-blue-400 font-mono">
                [{queue.join(', ')}]
              </span>
            </div>
          )}
          {stack && (
            <div className="glass px-4 py-2 rounded-lg">
              <span className="text-gray-400 text-sm mr-2">栈:</span>
              <span className="text-purple-400 font-mono">
                [{stack.join(', ')}]
              </span>
            </div>
          )}
        </div>
      )}

      {/* 访问顺序 */}
      {visitedNodes.length > 0 && (
        <div className="glass px-4 py-2 rounded-lg mx-auto w-fit">
          <span className="text-gray-400 text-sm mr-2">访问顺序:</span>
          <span className="text-green-400 font-mono">
            {visitedNodes.join(' → ')}
          </span>
        </div>
      )}

      {/* 图例 */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-500"></div>
          <span className="text-gray-400">未访问</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <span className="text-gray-400">当前节点</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-gray-400">已访问</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-gray-400">最短路径</span>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
