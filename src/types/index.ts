// 基础节点类型
export interface ListNode {
  id: string;
  value: number;
  next: string | null;
}

export interface TreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  x?: number;
  y?: number;
}

export interface GraphNode {
  id: string;
  value: number | string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
}

// 算法状态快照
export interface Snapshot<T = unknown> {
  id: string;
  step: number;
  description: string;
  data: T;
  highlightedElements: string[];
  codeLineIndex: number;
  variables?: Record<string, unknown>;
}

// 动画状态
export type AnimationState = 'idle' | 'playing' | 'paused' | 'finished';

// 播放器配置
export interface PlayerConfig {
  speed: number; // 0.5x - 4x
  autoPlay: boolean;
}

// 算法元数据
export interface AlgorithmMeta {
  id: string;
  name: string;
  category: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: string[];
}

// 数组元素状态
export type ArrayElementState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'selected';

export interface ArrayElement {
  id: string;
  value: number;
  state: ArrayElementState;
}

// 链表快照数据
export interface LinkedListSnapshot {
  nodes: ListNode[];
  headId: string | null;
  currentPointer?: string | null;
  highlightedPointers?: string[];
}

// 树快照数据
export interface TreeSnapshot {
  nodes: Map<string, TreeNode>;
  rootId: string | null;
  visitedNodes: string[];
  currentNode?: string;
  highlightedEdges?: Array<[string, string]>;
}

// 排序快照数据
export interface SortSnapshot {
  array: ArrayElement[];
  comparingIndices?: [number, number];
  swappingIndices?: [number, number];
  sortedIndices: number[];
  pivotIndex?: number;
  leftBound?: number;
  rightBound?: number;
}

// 图快照数据
export interface GraphSnapshot {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visitedNodes: string[];
  currentNode?: string;
  highlightedEdges?: string[];
  distances?: Map<string, number>;
}
