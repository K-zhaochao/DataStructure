import { useRef } from 'react';
import { motion } from 'framer-motion';
import { TreeNode } from '../types';

interface TreeVisualizerProps {
  nodes: Map<string, TreeNode>;
  rootId: string | null;
  visitedNodes?: string[];
  currentNode?: string;
  highlightedEdges?: Array<[string, string]>;
}

export default function TreeVisualizer({
  nodes,
  rootId,
  visitedNodes = [],
  currentNode,
  highlightedEdges = [],
}: TreeVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // 计算节点位置
  const calculatePositions = () => {
    const positions = new Map<string, { x: number; y: number }>();
    
    const assignPosition = (
      nodeId: string | null,
      x: number,
      y: number,
      spread: number
    ): void => {
      if (!nodeId) return;
      
      const node = nodes.get(nodeId);
      if (!node) return;

      positions.set(nodeId, { x, y });

      assignPosition(node.left, x - spread, y + 80, spread / 2);
      assignPosition(node.right, x + spread, y + 80, spread / 2);
    };

    if (rootId) {
      assignPosition(rootId, 400, 50, 150);
    }

    return positions;
  };

  const positions = calculatePositions();
  const nodeRadius = 25;

  // 渲染边
  const renderEdges = () => {
    const edges: JSX.Element[] = [];

    nodes.forEach((node, nodeId) => {
      const parentPos = positions.get(nodeId);
      if (!parentPos) return;

      [node.left, node.right].forEach((childId) => {
        if (!childId) return;
        
        const childPos = positions.get(childId);
        if (!childPos) return;

        const isHighlighted = highlightedEdges.some(
          ([from, to]) => from === nodeId && to === childId
        );

        edges.push(
          <motion.line
            key={`${nodeId}-${childId}`}
            x1={parentPos.x}
            y1={parentPos.y + nodeRadius}
            x2={childPos.x}
            y2={childPos.y - nodeRadius}
            stroke={isHighlighted ? '#22c55e' : '#475569'}
            strokeWidth={isHighlighted ? 3 : 2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        );
      });
    });

    return edges;
  };

  // 渲染节点
  const renderNodes = () => {
    const nodeElements: JSX.Element[] = [];

    nodes.forEach((node, nodeId) => {
      const pos = positions.get(nodeId);
      if (!pos) return;

      const isVisited = visitedNodes.includes(nodeId);
      const isCurrent = nodeId === currentNode;

      nodeElements.push(
        <motion.g
          key={nodeId}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* 当前节点光晕 */}
          {isCurrent && (
            <motion.circle
              cx={pos.x}
              cy={pos.y}
              r={nodeRadius + 8}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={3}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.4, 0.8] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}

          {/* 节点圆圈 */}
          <motion.circle
            cx={pos.x}
            cy={pos.y}
            r={nodeRadius}
            fill={
              isCurrent
                ? '#f59e0b'
                : isVisited
                ? '#22c55e'
                : '#3b82f6'
            }
            stroke={isCurrent ? '#fbbf24' : isVisited ? '#4ade80' : '#60a5fa'}
            strokeWidth={3}
            animate={{
              scale: isCurrent ? 1.1 : 1,
            }}
          />

          {/* 节点值 */}
          <text
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize={14}
            fontWeight="bold"
            fontFamily="monospace"
          >
            {node.value}
          </text>

          {/* 访问顺序标记 */}
          {isVisited && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <circle
                cx={pos.x + nodeRadius - 5}
                cy={pos.y - nodeRadius + 5}
                r={10}
                fill="#7c3aed"
              />
              <text
                x={pos.x + nodeRadius - 5}
                y={pos.y - nodeRadius + 5}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize={10}
                fontWeight="bold"
              >
                {visitedNodes.indexOf(nodeId) + 1}
              </text>
            </motion.g>
          )}
        </motion.g>
      );
    });

    return nodeElements;
  };

  if (!rootId || nodes.size === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-sm font-medium text-slate-400 mb-4">二叉树可视化</h3>
        <div className="flex items-center justify-center h-40 text-slate-500">
          树为空
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h3 className="text-sm font-medium text-slate-400 mb-4">二叉树可视化</h3>

      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          width={800}
          height={350}
          className="mx-auto"
        >
          {renderEdges()}
          {renderNodes()}
        </svg>
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs border-t border-slate-700 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-500" />
          <span className="text-slate-400">未访问</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-amber-500" />
          <span className="text-slate-400">当前访问</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-green-500" />
          <span className="text-slate-400">已访问</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">1</div>
          <span className="text-slate-400">访问顺序</span>
        </div>
      </div>

      {/* 访问序列 */}
      {visitedNodes.length > 0 && (
        <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
          <span className="text-sm text-slate-400">访问序列: </span>
          <span className="text-sm font-mono text-green-400">
            {visitedNodes.map(id => nodes.get(id)?.value).join(' → ')}
          </span>
        </div>
      )}
    </div>
  );
}
