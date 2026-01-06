import { AlgorithmExecutor } from '../AlgorithmExecutor';
import { AlgorithmMeta } from '../../types';

// 图的快照类型
export interface GraphSnapshot {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visitedNodes: string[];
  currentNode?: string;
  highlightedEdges: Array<[string, string]>;
  distances?: Map<string, number>;
  path?: string[];
  queue?: string[];   // BFS 队列
  stack?: string[];   // DFS 栈
}

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  state: 'default' | 'visiting' | 'visited' | 'current' | 'path';
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  state: 'default' | 'visiting' | 'visited' | 'path';
}

/**
 * DFS 深度优先搜索执行器
 */
export class DFSExecutor extends AlgorithmExecutor<GraphSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'dfs',
    name: '深度优先搜索 (DFS)',
    category: '图算法',
    description: 'DFS 从起始节点出发，沿着一条路径尽可能深入，直到无法继续时回溯。使用栈（或递归）实现。',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function DFS(graph, start):',
      '    创建空栈 stack',
      '    创建访问标记集合 visited',
      '    stack.push(start)',
      '    while stack 不为空:',
      '        node = stack.pop()',
      '        if node 未被访问:',
      '            标记 node 为已访问',
      '            访问 node',
      '            for each neighbor of node:',
      '                if neighbor 未被访问:',
      '                    stack.push(neighbor)',
    ],
  };

  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  private adjacencyList: Map<string, string[]> = new Map();

  execute(nodes: GraphNode[], edges: GraphEdge[], startId: string): void {
    this.reset();
    this.nodes = nodes.map(n => ({ ...n, state: 'default' as const }));
    this.edges = edges.map(e => ({ ...e, state: 'default' as const }));
    this.buildAdjacencyList();

    const visited = new Set<string>();
    const visitedNodes: string[] = [];
    const stack: string[] = [startId];
    const highlightedEdges: Array<[string, string]> = [];

    this.addSnapshot(
      `初始化，起点: ${startId}`,
      {
        nodes: this.cloneNodes(),
        edges: this.cloneEdges(),
        visitedNodes: [],
        highlightedEdges: [],
        stack: [startId],
      },
      [],
      0
    );

    while (stack.length > 0) {
      const current = stack.pop()!;

      this.addSnapshot(
        `从栈中弹出节点 ${current}`,
        {
          nodes: this.cloneNodes(),
          edges: this.cloneEdges(),
          visitedNodes: [...visitedNodes],
          currentNode: current,
          highlightedEdges: [...highlightedEdges],
          stack: [...stack],
        },
        [],
        5
      );

      if (!visited.has(current)) {
        visited.add(current);
        visitedNodes.push(current);
        
        const node = this.nodes.find(n => n.id === current);
        if (node) node.state = 'visited';

        this.addSnapshot(
          `访问节点 ${current}`,
          {
            nodes: this.cloneNodes(),
            edges: this.cloneEdges(),
            visitedNodes: [...visitedNodes],
            currentNode: current,
            highlightedEdges: [...highlightedEdges],
            stack: [...stack],
          },
          [current],
          8
        );

        const neighbors = this.adjacencyList.get(current) || [];
        for (const neighbor of neighbors.reverse()) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
            
            // 高亮边
            const edge = this.edges.find(
              e => (e.from === current && e.to === neighbor) || 
                   (e.to === current && e.from === neighbor)
            );
            if (edge) edge.state = 'visiting';

            this.addSnapshot(
              `将邻居 ${neighbor} 入栈`,
              {
                nodes: this.cloneNodes(),
                edges: this.cloneEdges(),
                visitedNodes: [...visitedNodes],
                currentNode: current,
                highlightedEdges: [...highlightedEdges, [current, neighbor]],
                stack: [...stack],
              },
              [],
              11
            );
          }
        }
      }
    }

    // 标记所有访问过的边
    this.edges.forEach(e => {
      if (visitedNodes.includes(e.from) && visitedNodes.includes(e.to)) {
        e.state = 'visited';
      }
    });

    this.addSnapshot(
      `DFS 完成！访问顺序: ${visitedNodes.join(' → ')}`,
      {
        nodes: this.cloneNodes(),
        edges: this.cloneEdges(),
        visitedNodes,
        highlightedEdges: [...highlightedEdges],
        stack: [],
      },
      visitedNodes,
      0
    );
  }

  private buildAdjacencyList(): void {
    this.adjacencyList.clear();
    for (const node of this.nodes) {
      this.adjacencyList.set(node.id, []);
    }
    for (const edge of this.edges) {
      this.adjacencyList.get(edge.from)?.push(edge.to);
      this.adjacencyList.get(edge.to)?.push(edge.from); // 无向图
    }
  }

  private cloneNodes(): GraphNode[] {
    return this.nodes.map(n => ({ ...n }));
  }

  private cloneEdges(): GraphEdge[] {
    return this.edges.map(e => ({ ...e }));
  }
}

/**
 * BFS 广度优先搜索执行器
 */
export class BFSExecutor extends AlgorithmExecutor<GraphSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'bfs',
    name: '广度优先搜索 (BFS)',
    category: '图算法',
    description: 'BFS 从起始节点出发，先访问所有相邻节点，再访问下一层节点。使用队列实现。',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function BFS(graph, start):',
      '    创建空队列 queue',
      '    创建访问标记集合 visited',
      '    queue.enqueue(start)',
      '    visited.add(start)',
      '    while queue 不为空:',
      '        node = queue.dequeue()',
      '        访问 node',
      '        for each neighbor of node:',
      '            if neighbor 未被访问:',
      '                visited.add(neighbor)',
      '                queue.enqueue(neighbor)',
    ],
  };

  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  private adjacencyList: Map<string, string[]> = new Map();

  execute(nodes: GraphNode[], edges: GraphEdge[], startId: string): void {
    this.reset();
    this.nodes = nodes.map(n => ({ ...n, state: 'default' as const }));
    this.edges = edges.map(e => ({ ...e, state: 'default' as const }));
    this.buildAdjacencyList();

    const visited = new Set<string>([startId]);
    const visitedNodes: string[] = [];
    const queue: string[] = [startId];
    const highlightedEdges: Array<[string, string]> = [];

    const startNode = this.nodes.find(n => n.id === startId);
    if (startNode) startNode.state = 'visiting';

    this.addSnapshot(
      `初始化，起点: ${startId}`,
      {
        nodes: this.cloneNodes(),
        edges: this.cloneEdges(),
        visitedNodes: [],
        highlightedEdges: [],
        queue: [startId],
      },
      [],
      0
    );

    while (queue.length > 0) {
      const current = queue.shift()!;
      visitedNodes.push(current);

      const node = this.nodes.find(n => n.id === current);
      if (node) node.state = 'visited';

      this.addSnapshot(
        `从队列中取出并访问节点 ${current}`,
        {
          nodes: this.cloneNodes(),
          edges: this.cloneEdges(),
          visitedNodes: [...visitedNodes],
          currentNode: current,
          highlightedEdges: [...highlightedEdges],
          queue: [...queue],
        },
        [current],
        7
      );

      const neighbors = this.adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);

          const neighborNode = this.nodes.find(n => n.id === neighbor);
          if (neighborNode) neighborNode.state = 'visiting';

          // 高亮边
          const edge = this.edges.find(
            e => (e.from === current && e.to === neighbor) || 
                 (e.to === current && e.from === neighbor)
          );
          if (edge) edge.state = 'visiting';
          highlightedEdges.push([current, neighbor]);

          this.addSnapshot(
            `发现邻居 ${neighbor}，加入队列`,
            {
              nodes: this.cloneNodes(),
              edges: this.cloneEdges(),
              visitedNodes: [...visitedNodes],
              currentNode: current,
              highlightedEdges: [...highlightedEdges],
              queue: [...queue],
            },
            [],
            11
          );
        }
      }
    }

    // 标记所有访问过的边
    this.edges.forEach(e => {
      if (visitedNodes.includes(e.from) && visitedNodes.includes(e.to)) {
        e.state = 'visited';
      }
    });

    this.addSnapshot(
      `BFS 完成！访问顺序: ${visitedNodes.join(' → ')}`,
      {
        nodes: this.cloneNodes(),
        edges: this.cloneEdges(),
        visitedNodes,
        highlightedEdges,
        queue: [],
      },
      visitedNodes,
      0
    );
  }

  private buildAdjacencyList(): void {
    this.adjacencyList.clear();
    for (const node of this.nodes) {
      this.adjacencyList.set(node.id, []);
    }
    for (const edge of this.edges) {
      this.adjacencyList.get(edge.from)?.push(edge.to);
      this.adjacencyList.get(edge.to)?.push(edge.from);
    }
  }

  private cloneNodes(): GraphNode[] {
    return this.nodes.map(n => ({ ...n }));
  }

  private cloneEdges(): GraphEdge[] {
    return this.edges.map(e => ({ ...e }));
  }
}

/**
 * Dijkstra 最短路径执行器
 */
export class DijkstraExecutor extends AlgorithmExecutor<GraphSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'dijkstra',
    name: 'Dijkstra 最短路径',
    category: '图算法',
    description: 'Dijkstra 算法用于计算单源最短路径，适用于边权非负的图。使用贪心策略逐步扩展最短路径。',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function Dijkstra(graph, start):',
      '    dist[start] = 0',
      '    其他节点 dist = ∞',
      '    创建优先队列 PQ',
      '    PQ.insert(start, 0)',
      '    while PQ 不为空:',
      '        u = PQ.extractMin()',
      '        for each neighbor v of u:',
      '            alt = dist[u] + weight(u, v)',
      '            if alt < dist[v]:',
      '                dist[v] = alt',
      '                prev[v] = u',
      '                PQ.decreaseKey(v, alt)',
      '    return dist, prev',
    ],
  };

  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  private adjacencyList: Map<string, Array<{ node: string; weight: number }>> = new Map();

  execute(nodes: GraphNode[], edges: GraphEdge[], startId: string, endId?: string): void {
    this.reset();
    this.nodes = nodes.map(n => ({ ...n, state: 'default' as const }));
    this.edges = edges.map(e => ({ ...e, state: 'default' as const }));
    this.buildAdjacencyList();

    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();
    const visited = new Set<string>();
    const visitedNodes: string[] = [];
    const highlightedEdges: Array<[string, string]> = [];

    // 初始化距离
    for (const node of this.nodes) {
      dist.set(node.id, node.id === startId ? 0 : Infinity);
      prev.set(node.id, null);
    }

    this.addSnapshot(
      `初始化，起点: ${startId}`,
      {
        nodes: this.cloneNodes(),
        edges: this.cloneEdges(),
        visitedNodes: [],
        highlightedEdges: [],
        distances: new Map(dist),
      },
      [],
      0
    );

    while (visited.size < this.nodes.length) {
      // 找最小距离的未访问节点
      let minDist = Infinity;
      let minNode: string | null = null;
      for (const [nodeId, d] of dist) {
        if (!visited.has(nodeId) && d < minDist) {
          minDist = d;
          minNode = nodeId;
        }
      }

      if (minNode === null || minDist === Infinity) break;

      visited.add(minNode);
      visitedNodes.push(minNode);

      const node = this.nodes.find(n => n.id === minNode);
      if (node) node.state = 'visited';

      this.addSnapshot(
        `选择距离最小的节点 ${minNode}，距离 = ${minDist}`,
        {
          nodes: this.cloneNodes(),
          edges: this.cloneEdges(),
          visitedNodes: [...visitedNodes],
          currentNode: minNode,
          highlightedEdges: [...highlightedEdges],
          distances: new Map(dist),
        },
        [minNode],
        6
      );

      // 更新邻居距离
      const neighbors = this.adjacencyList.get(minNode) || [];
      for (const { node: neighbor, weight } of neighbors) {
        if (visited.has(neighbor)) continue;

        const alt = dist.get(minNode)! + weight;
        
        this.addSnapshot(
          `检查边 ${minNode} → ${neighbor}，新距离 = ${alt}`,
          {
            nodes: this.cloneNodes(),
            edges: this.cloneEdges(),
            visitedNodes: [...visitedNodes],
            currentNode: minNode,
            highlightedEdges: [...highlightedEdges, [minNode, neighbor]],
            distances: new Map(dist),
          },
          [],
          8
        );

        if (alt < dist.get(neighbor)!) {
          dist.set(neighbor, alt);
          prev.set(neighbor, minNode);

          const edge = this.edges.find(
            e => (e.from === minNode && e.to === neighbor) || 
                 (e.to === minNode && e.from === neighbor)
          );
          if (edge) edge.state = 'visiting';

          this.addSnapshot(
            `更新 ${neighbor} 的距离: ${alt}`,
            {
              nodes: this.cloneNodes(),
              edges: this.cloneEdges(),
              visitedNodes: [...visitedNodes],
              currentNode: minNode,
              highlightedEdges: [...highlightedEdges, [minNode, neighbor]],
              distances: new Map(dist),
            },
            [neighbor],
            10
          );
        }
      }
    }

    // 如果有终点，构建路径
    let path: string[] = [];
    if (endId && prev.has(endId)) {
      let current: string | null = endId;
      while (current) {
        path.unshift(current);
        current = prev.get(current) || null;
      }
      
      // 高亮路径
      for (let i = 0; i < path.length - 1; i++) {
        const edge = this.edges.find(
          e => (e.from === path[i] && e.to === path[i + 1]) || 
               (e.to === path[i] && e.from === path[i + 1])
        );
        if (edge) edge.state = 'path';
        
        const node = this.nodes.find(n => n.id === path[i]);
        if (node) node.state = 'path';
      }
      const endNode = this.nodes.find(n => n.id === endId);
      if (endNode) endNode.state = 'path';
    }

    this.addSnapshot(
      endId ? `最短路径: ${path.join(' → ')}，距离: ${dist.get(endId)}` : 'Dijkstra 完成！',
      {
        nodes: this.cloneNodes(),
        edges: this.cloneEdges(),
        visitedNodes,
        highlightedEdges,
        distances: new Map(dist),
        path,
      },
      path.length > 0 ? path : visitedNodes,
      0
    );
  }

  private buildAdjacencyList(): void {
    this.adjacencyList.clear();
    for (const node of this.nodes) {
      this.adjacencyList.set(node.id, []);
    }
    for (const edge of this.edges) {
      this.adjacencyList.get(edge.from)?.push({ node: edge.to, weight: edge.weight || 1 });
      this.adjacencyList.get(edge.to)?.push({ node: edge.from, weight: edge.weight || 1 });
    }
  }

  private cloneNodes(): GraphNode[] {
    return this.nodes.map(n => ({ ...n }));
  }

  private cloneEdges(): GraphEdge[] {
    return this.edges.map(e => ({ ...e }));
  }
}

/**
 * Prim 最小生成树执行器
 */
export class PrimExecutor extends AlgorithmExecutor<GraphSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'prim',
    name: 'Prim 最小生成树',
    category: '图算法',
    description: 'Prim 算法从一个顶点开始，每次选择与当前生成树相邻的最小权边，逐步扩展生成最小生成树。',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function Prim(graph, start):',
      '    创建 MST 边集合',
      '    key[start] = 0, 其他 = ∞',
      '    创建优先队列 PQ',
      '    while PQ 不为空:',
      '        u = PQ.extractMin()',
      '        将 u 加入 MST',
      '        for each neighbor v of u:',
      '            if v 不在 MST 且 weight(u,v) < key[v]:',
      '                key[v] = weight(u, v)',
      '                parent[v] = u',
      '    return MST',
    ],
  };

  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  private adjacencyList: Map<string, Array<{ node: string; weight: number }>> = new Map();

  execute(nodes: GraphNode[], edges: GraphEdge[], startId: string): void {
    this.reset();
    this.nodes = nodes.map(n => ({ ...n, state: 'default' as const }));
    this.edges = edges.map(e => ({ ...e, state: 'default' as const }));
    this.buildAdjacencyList();

    const inMST = new Set<string>();
    const key = new Map<string, number>();
    const parent = new Map<string, string | null>();
    const mstEdges: Array<[string, string]> = [];
    let totalWeight = 0;

    for (const node of this.nodes) {
      key.set(node.id, node.id === startId ? 0 : Infinity);
      parent.set(node.id, null);
    }

    this.addSnapshot(
      `初始化，起点: ${startId}`,
      {
        nodes: this.cloneNodes(),
        edges: this.cloneEdges(),
        visitedNodes: [],
        highlightedEdges: [],
      },
      [],
      0
    );

    while (inMST.size < this.nodes.length) {
      // 找最小 key 的非 MST 节点
      let minKey = Infinity;
      let minNode: string | null = null;
      for (const [nodeId, k] of key) {
        if (!inMST.has(nodeId) && k < minKey) {
          minKey = k;
          minNode = nodeId;
        }
      }

      if (minNode === null) break;

      inMST.add(minNode);
      const node = this.nodes.find(n => n.id === minNode);
      if (node) node.state = 'visited';

      // 添加边到 MST
      const parentNode = parent.get(minNode);
      if (parentNode) {
        mstEdges.push([parentNode, minNode]);
        totalWeight += minKey;
        
        const edge = this.edges.find(
          e => (e.from === parentNode && e.to === minNode) || 
               (e.to === parentNode && e.from === minNode)
        );
        if (edge) edge.state = 'path';
      }

      this.addSnapshot(
        parentNode 
          ? `将边 (${parentNode}, ${minNode}) 加入 MST，权重: ${minKey}` 
          : `从节点 ${minNode} 开始`,
        {
          nodes: this.cloneNodes(),
          edges: this.cloneEdges(),
          visitedNodes: Array.from(inMST),
          currentNode: minNode,
          highlightedEdges: [...mstEdges],
        },
        [minNode],
        6
      );

      // 更新邻居的 key
      const neighbors = this.adjacencyList.get(minNode) || [];
      for (const { node: neighbor, weight } of neighbors) {
        if (!inMST.has(neighbor) && weight < key.get(neighbor)!) {
          key.set(neighbor, weight);
          parent.set(neighbor, minNode);

          this.addSnapshot(
            `更新 ${neighbor} 的 key: ${weight}`,
            {
              nodes: this.cloneNodes(),
              edges: this.cloneEdges(),
              visitedNodes: Array.from(inMST),
              currentNode: minNode,
              highlightedEdges: [...mstEdges, [minNode, neighbor]],
            },
            [],
            9
          );
        }
      }
    }

    this.addSnapshot(
      `Prim 完成！MST 总权重: ${totalWeight}`,
      {
        nodes: this.cloneNodes(),
        edges: this.cloneEdges(),
        visitedNodes: Array.from(inMST),
        highlightedEdges: mstEdges,
      },
      Array.from(inMST),
      0
    );
  }

  private buildAdjacencyList(): void {
    this.adjacencyList.clear();
    for (const node of this.nodes) {
      this.adjacencyList.set(node.id, []);
    }
    for (const edge of this.edges) {
      this.adjacencyList.get(edge.from)?.push({ node: edge.to, weight: edge.weight || 1 });
      this.adjacencyList.get(edge.to)?.push({ node: edge.from, weight: edge.weight || 1 });
    }
  }

  private cloneNodes(): GraphNode[] {
    return this.nodes.map(n => ({ ...n }));
  }

  private cloneEdges(): GraphEdge[] {
    return this.edges.map(e => ({ ...e }));
  }
}

/**
 * 拓扑排序执行器
 */
export class TopologicalSortExecutor extends AlgorithmExecutor<GraphSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'topological-sort',
    name: '拓扑排序',
    category: '图算法',
    description: '拓扑排序用于有向无环图(DAG)，将所有顶点排成线性序列，使得对于每条有向边(u,v)，u都在v之前。',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function TopologicalSort(graph):',
      '    计算所有节点的入度',
      '    将入度为 0 的节点入队',
      '    result = []',
      '    while queue 不为空:',
      '        node = queue.dequeue()',
      '        result.append(node)',
      '        for each neighbor of node:',
      '            入度[neighbor]--',
      '            if 入度[neighbor] == 0:',
      '                queue.enqueue(neighbor)',
      '    return result',
    ],
  };

  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];

  execute(nodes: GraphNode[], edges: GraphEdge[]): void {
    this.reset();
    this.nodes = nodes.map(n => ({ ...n, state: 'default' as const }));
    this.edges = edges.map(e => ({ ...e, state: 'default' as const }));

    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    // 初始化
    for (const node of this.nodes) {
      inDegree.set(node.id, 0);
      adjList.set(node.id, []);
    }
    for (const edge of this.edges) {
      adjList.get(edge.from)?.push(edge.to);
      inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    }

    this.addSnapshot(
      '计算所有节点的入度',
      {
        nodes: this.cloneNodes(),
        edges: this.cloneEdges(),
        visitedNodes: [],
        highlightedEdges: [],
      },
      [],
      1
    );

    const queue: string[] = [];
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }

    this.addSnapshot(
      `入度为 0 的节点: ${queue.join(', ')}`,
      {
        nodes: this.cloneNodes(),
        edges: this.cloneEdges(),
        visitedNodes: [],
        highlightedEdges: [],
        queue: [...queue],
      },
      queue,
      2
    );

    const result: string[] = [];
    const visitedEdges: Array<[string, string]> = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const node = this.nodes.find(n => n.id === current);
      if (node) node.state = 'visited';

      this.addSnapshot(
        `取出节点 ${current}，加入结果序列`,
        {
          nodes: this.cloneNodes(),
          edges: this.cloneEdges(),
          visitedNodes: [...result],
          currentNode: current,
          highlightedEdges: [...visitedEdges],
          queue: [...queue],
        },
        [current],
        6
      );

      const neighbors = adjList.get(current) || [];
      for (const neighbor of neighbors) {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        
        visitedEdges.push([current, neighbor]);
        const edge = this.edges.find(e => e.from === current && e.to === neighbor);
        if (edge) edge.state = 'visited';

        this.addSnapshot(
          `${neighbor} 入度减 1，现为 ${newDegree}`,
          {
            nodes: this.cloneNodes(),
            edges: this.cloneEdges(),
            visitedNodes: [...result],
            currentNode: current,
            highlightedEdges: [...visitedEdges],
            queue: [...queue],
          },
          [],
          8
        );

        if (newDegree === 0) {
          queue.push(neighbor);
          this.addSnapshot(
            `${neighbor} 入度为 0，加入队列`,
            {
              nodes: this.cloneNodes(),
              edges: this.cloneEdges(),
              visitedNodes: [...result],
              currentNode: current,
              highlightedEdges: [...visitedEdges],
              queue: [...queue],
            },
            [neighbor],
            10
          );
        }
      }
    }

    const hasCircle = result.length !== this.nodes.length;
    this.addSnapshot(
      hasCircle 
        ? '检测到环，无法进行拓扑排序！' 
        : `拓扑排序完成: ${result.join(' → ')}`,
      {
        nodes: this.cloneNodes(),
        edges: this.cloneEdges(),
        visitedNodes: result,
        highlightedEdges: visitedEdges,
        queue: [],
      },
      result,
      0
    );
  }

  private cloneNodes(): GraphNode[] {
    return this.nodes.map(n => ({ ...n }));
  }

  private cloneEdges(): GraphEdge[] {
    return this.edges.map(e => ({ ...e }));
  }
}
