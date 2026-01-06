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
    description: '深度优先搜索是一种图的遍历算法，类似于树的先序遍历。从起始节点出发，沿着一条路径尽可能深入，直到无法继续时回溯到上一个节点。使用栈（递归调用栈或显式栈）实现，适用于判断连通性、检测环路等场景。',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function DFS(G, v):',
      '    // 从顶点 v 出发深度优先遍历图 G',
      '    visited[v] = true     // 标记 v 已访问',
      '    Visit(v)              // 访问顶点 v',
      '    for each w in G.Adj[v] do  // 遍历 v 的所有邻接点',
      '        if not visited[w] then',
      '            DFS(G, w)     // 递归访问未访问的邻接点',
      '',
      '// 非递归实现（使用栈）',
      'function DFS_NonRecursive(G, v):',
      '    创建空栈 S',
      '    S.push(v)',
      '    while S is not empty do',
      '        u = S.pop()',
      '        if not visited[u] then',
      '            visited[u] = true',
      '            Visit(u)',
      '            for each w in G.Adj[u] do',
      '                if not visited[w] then',
      '                    S.push(w)',
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
    description: '广度优先搜索是一种图的遍历算法，类似于树的层序遍历。从起始节点出发，先访问所有邻接点（第一层），再访问邻接点的邻接点（第二层），以此类推。使用队列实现，可用于求无权图的最短路径。',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function BFS(G, v):',
      '    // 从顶点 v 出发广度优先遍历图 G',
      '    创建空队列 Q',
      '    visited[v] = true     // 标记 v 已访问',
      '    Q.enqueue(v)          // 起点入队',
      '    while Q is not empty do',
      '        u = Q.dequeue()   // 队首出队',
      '        Visit(u)          // 访问顶点 u',
      '        for each w in G.Adj[u] do  // 遍历 u 的邻接点',
      '            if not visited[w] then',
      '                visited[w] = true',
      '                Q.enqueue(w)  // 未访问的邻接点入队',
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
    description: 'Dijkstra 算法用于求解单源最短路径问题，即从一个顶点到其他所有顶点的最短距离。采用贪心策略，每次选择距离最小的未访问顶点进行扩展。要求所有边的权值非负。',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function Dijkstra(G, v0):',
      '    // 从顶点 v0 出发，求到其他顶点的最短路径',
      '    for each v in G.V do',
      '        dist[v] = ∞          // 初始化距离',
      '        prev[v] = NULL       // 记录前驱',
      '    dist[v0] = 0',
      '    S = ∅                    // 已确定最短路径的顶点集',
      '    while S ≠ G.V do',
      '        // 选择不在 S 中且 dist 最小的顶点 u',
      '        u = extractMin(G.V - S)',
      '        S = S ∪ {u}',
      '        // 松弛操作：更新 u 的邻接点',
      '        for each w in G.Adj[u] do',
      '            if dist[u] + weight(u,w) < dist[w] then',
      '                dist[w] = dist[u] + weight(u,w)',
      '                prev[w] = u',
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
    description: 'Prim 算法用于求连通加权无向图的最小生成树(MST)。从任意顶点出发，每次将与当前树相邻且权值最小的边加入树中，直到所有顶点都在树中。采用贪心策略，保证每步选择局部最优。',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function Prim(G, v0):',
      '    // 从顶点 v0 开始构造最小生成树',
      '    for each v in G.V do',
      '        key[v] = ∞           // 与 MST 连接的最小权值',
      '        parent[v] = NULL     // 记录 MST 中的父节点',
      '    key[v0] = 0',
      '    Q = G.V                  // 优先队列（按 key 排序）',
      '    while Q ≠ ∅ do',
      '        u = extractMin(Q)    // 取 key 最小的顶点',
      '        // 将 (parent[u], u) 加入 MST',
      '        for each w in G.Adj[u] do',
      '            if w in Q and weight(u,w) < key[w] then',
      '                parent[w] = u',
      '                key[w] = weight(u, w)',
      '    return MST = {(v, parent[v]) | v ≠ v0}',
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
    description: '拓扑排序用于有向无环图(DAG)，将所有顶点排成线性序列，使得对于每条有向边(u,v)，u 都在 v 之前。常用于任务调度、课程安排等场景。采用 Kahn 算法（基于入度）或 DFS 实现。',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    pseudocode: [
      'function TopologicalSort(G):',
      '    // Kahn 算法：基于入度的拓扑排序',
      '    for each v in G.V do',
      '        计算入度 inDegree[v]',
      '    Q = ∅                    // 初始化队列',
      '    for each v in G.V do',
      '        if inDegree[v] = 0 then',
      '            Q.enqueue(v)     // 入度为 0 的顶点入队',
      '    result = []',
      '    while Q ≠ ∅ do',
      '        u = Q.dequeue()',
      '        result.append(u)     // 输出顶点',
      '        for each w in G.Adj[u] do',
      '            inDegree[w] = inDegree[w] - 1',
      '            if inDegree[w] = 0 then',
      '                Q.enqueue(w)',
      '    if |result| ≠ |G.V| then',
      '        return "图中有环，无拓扑序"',
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
