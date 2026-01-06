import { AlgorithmExecutor } from '../AlgorithmExecutor';
import { AlgorithmMeta, TreeSnapshot, TreeNode } from '../../types';

/**
 * 二叉树遍历执行器
 */
export class BinaryTreeExecutor extends AlgorithmExecutor<TreeSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'binary-tree-traversal',
    name: '二叉树遍历',
    category: '树',
    description: '二叉树遍历是访问树中所有节点的系统方法。前序(DLR)先访问根再左右；中序(LDR)先左再根后右；后序(LRD)先左右再根；层序按层从上到下、从左到右访问。',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)，h为树的高度',
    pseudocode: [
      '// 前序遍历 (DLR): 根 → 左子树 → 右子树',
      'function PreOrder(T):',
      '    if T = NULL then return',
      '    visit(T.data)            // 访问根节点',
      '    PreOrder(T.lchild)       // 递归遍历左子树',
      '    PreOrder(T.rchild)       // 递归遍历右子树',
      '',
      '// 中序遍历 (LDR): 左子树 → 根 → 右子树',
      'function InOrder(T):',
      '    if T = NULL then return',
      '    InOrder(T.lchild)        // 递归遍历左子树',
      '    visit(T.data)            // 访问根节点',
      '    InOrder(T.rchild)        // 递归遍历右子树',
      '',
      '// 后序遍历 (LRD): 左子树 → 右子树 → 根',
      'function PostOrder(T):',
      '    if T = NULL then return',
      '    PostOrder(T.lchild)      // 递归遍历左子树',
      '    PostOrder(T.rchild)      // 递归遍历右子树',
      '    visit(T.data)            // 访问根节点',
    ],
  };

  private nodes: Map<string, TreeNode> = new Map();
  private rootId: string | null = null;
  private visitedNodes: string[] = [];

  /**
   * 构建示例二叉树
   */
  buildSampleTree(values: (number | null)[]): void {
    this.reset();
    this.nodes = new Map();
    this.rootId = null;
    this.visitedNodes = [];

    if (values.length === 0 || values[0] === null) return;

    const nodeIds: (string | null)[] = [];
    
    // 创建所有节点
    values.forEach((value, _index) => {
      if (value !== null) {
        const id = this.generateId();
        const node: TreeNode = {
          id,
          value,
          left: null,
          right: null,
        };
        this.nodes.set(id, node);
        nodeIds.push(id);
      } else {
        nodeIds.push(null);
      }
    });

    // 建立父子关系
    nodeIds.forEach((id, index) => {
      if (id === null) return;
      
      const leftIndex = 2 * index + 1;
      const rightIndex = 2 * index + 2;
      
      const node = this.nodes.get(id)!;
      if (leftIndex < nodeIds.length && nodeIds[leftIndex]) {
        node.left = nodeIds[leftIndex];
      }
      if (rightIndex < nodeIds.length && nodeIds[rightIndex]) {
        node.right = nodeIds[rightIndex];
      }
    });

    this.rootId = nodeIds[0];

    // 计算节点位置
    this.calculatePositions();

    this.addSnapshot(
      '初始二叉树',
      {
        nodes: new Map(this.nodes),
        rootId: this.rootId,
        visitedNodes: [],
      },
      [],
      0
    );
  }

  /**
   * 计算节点在画布上的位置
   */
  private calculatePositions(): void {
    if (!this.rootId) return;

    const assignPosition = (nodeId: string | null, x: number, y: number, spread: number): void => {
      if (!nodeId) return;
      
      const node = this.nodes.get(nodeId)!;
      node.x = x;
      node.y = y;

      assignPosition(node.left, x - spread, y + 80, spread / 2);
      assignPosition(node.right, x + spread, y + 80, spread / 2);
    };

    assignPosition(this.rootId, 400, 50, 150);
  }

  /**
   * 前序遍历
   */
  preorderTraversal(): void {
    this.visitedNodes = [];
    this.addSnapshot(
      '开始前序遍历（根-左-右）',
      {
        nodes: new Map(this.nodes),
        rootId: this.rootId,
        visitedNodes: [],
      },
      [],
      1
    );

    this.preorderHelper(this.rootId);

    this.addSnapshot(
      `前序遍历完成，访问顺序: ${this.visitedNodes.map(id => this.nodes.get(id)?.value).join(' → ')}`,
      {
        nodes: new Map(this.nodes),
        rootId: this.rootId,
        visitedNodes: [...this.visitedNodes],
      },
      this.visitedNodes,
      0
    );
  }

  private preorderHelper(nodeId: string | null): void {
    if (!nodeId) return;

    const node = this.nodes.get(nodeId)!;

    // 访问当前节点
    this.visitedNodes.push(nodeId);
    this.addSnapshot(
      `访问节点 ${node.value}`,
      {
        nodes: new Map(this.nodes),
        rootId: this.rootId,
        visitedNodes: [...this.visitedNodes],
        currentNode: nodeId,
      },
      [nodeId],
      3
    );

    // 遍历左子树
    if (node.left) {
      this.addSnapshot(
        `进入左子树`,
        {
          nodes: new Map(this.nodes),
          rootId: this.rootId,
          visitedNodes: [...this.visitedNodes],
          currentNode: nodeId,
          highlightedEdges: [[nodeId, node.left]],
        },
        [nodeId, node.left],
        4
      );
      this.preorderHelper(node.left);
    }

    // 遍历右子树
    if (node.right) {
      this.addSnapshot(
        `进入右子树`,
        {
          nodes: new Map(this.nodes),
          rootId: this.rootId,
          visitedNodes: [...this.visitedNodes],
          currentNode: nodeId,
          highlightedEdges: [[nodeId, node.right]],
        },
        [nodeId, node.right],
        5
      );
      this.preorderHelper(node.right);
    }
  }

  /**
   * 中序遍历
   */
  inorderTraversal(): void {
    this.visitedNodes = [];
    this.addSnapshot(
      '开始中序遍历（左-根-右）',
      {
        nodes: new Map(this.nodes),
        rootId: this.rootId,
        visitedNodes: [],
      },
      [],
      7
    );

    this.inorderHelper(this.rootId);

    this.addSnapshot(
      `中序遍历完成，访问顺序: ${this.visitedNodes.map(id => this.nodes.get(id)?.value).join(' → ')}`,
      {
        nodes: new Map(this.nodes),
        rootId: this.rootId,
        visitedNodes: [...this.visitedNodes],
      },
      this.visitedNodes,
      0
    );
  }

  private inorderHelper(nodeId: string | null): void {
    if (!nodeId) return;

    const node = this.nodes.get(nodeId)!;

    // 遍历左子树
    if (node.left) {
      this.inorderHelper(node.left);
    }

    // 访问当前节点
    this.visitedNodes.push(nodeId);
    this.addSnapshot(
      `访问节点 ${node.value}`,
      {
        nodes: new Map(this.nodes),
        rootId: this.rootId,
        visitedNodes: [...this.visitedNodes],
        currentNode: nodeId,
      },
      [nodeId],
      11
    );

    // 遍历右子树
    if (node.right) {
      this.inorderHelper(node.right);
    }
  }

  /**
   * 后序遍历
   */
  postorderTraversal(): void {
    this.visitedNodes = [];
    this.addSnapshot(
      '开始后序遍历（左-右-根）',
      {
        nodes: new Map(this.nodes),
        rootId: this.rootId,
        visitedNodes: [],
      },
      [],
      14
    );

    this.postorderHelper(this.rootId);

    this.addSnapshot(
      `后序遍历完成，访问顺序: ${this.visitedNodes.map(id => this.nodes.get(id)?.value).join(' → ')}`,
      {
        nodes: new Map(this.nodes),
        rootId: this.rootId,
        visitedNodes: [...this.visitedNodes],
      },
      this.visitedNodes,
      0
    );
  }

  private postorderHelper(nodeId: string | null): void {
    if (!nodeId) return;

    const node = this.nodes.get(nodeId)!;

    // 遍历左子树
    if (node.left) {
      this.postorderHelper(node.left);
    }

    // 遍历右子树
    if (node.right) {
      this.postorderHelper(node.right);
    }

    // 访问当前节点
    this.visitedNodes.push(nodeId);
    this.addSnapshot(
      `访问节点 ${node.value}`,
      {
        nodes: new Map(this.nodes),
        rootId: this.rootId,
        visitedNodes: [...this.visitedNodes],
        currentNode: nodeId,
      },
      [nodeId],
      18
    );
  }

  /**
   * 层序遍历
   */
  levelOrderTraversal(): void {
    this.visitedNodes = [];
    if (!this.rootId) return;

    this.addSnapshot(
      '开始层序遍历（使用队列）',
      {
        nodes: new Map(this.nodes),
        rootId: this.rootId,
        visitedNodes: [],
      },
      [],
      0
    );

    const queue: string[] = [this.rootId];

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const node = this.nodes.get(nodeId)!;

      this.visitedNodes.push(nodeId);
      this.addSnapshot(
        `访问节点 ${node.value}`,
        {
          nodes: new Map(this.nodes),
          rootId: this.rootId,
          visitedNodes: [...this.visitedNodes],
          currentNode: nodeId,
        },
        [nodeId],
        0
      );

      if (node.left) {
        queue.push(node.left);
        this.addSnapshot(
          `将左子节点 ${this.nodes.get(node.left)?.value} 加入队列`,
          {
            nodes: new Map(this.nodes),
            rootId: this.rootId,
            visitedNodes: [...this.visitedNodes],
            currentNode: nodeId,
          },
          [node.left],
          0
        );
      }

      if (node.right) {
        queue.push(node.right);
        this.addSnapshot(
          `将右子节点 ${this.nodes.get(node.right)?.value} 加入队列`,
          {
            nodes: new Map(this.nodes),
            rootId: this.rootId,
            visitedNodes: [...this.visitedNodes],
            currentNode: nodeId,
          },
          [node.right],
          0
        );
      }
    }

    this.addSnapshot(
      `层序遍历完成，访问顺序: ${this.visitedNodes.map(id => this.nodes.get(id)?.value).join(' → ')}`,
      {
        nodes: new Map(this.nodes),
        rootId: this.rootId,
        visitedNodes: [...this.visitedNodes],
      },
      this.visitedNodes,
      0
    );
  }

  execute(values: (number | null)[], traversalType: 'preorder' | 'inorder' | 'postorder' | 'levelorder' = 'preorder'): void {
    this.buildSampleTree(values);
    
    switch (traversalType) {
      case 'preorder':
        this.preorderTraversal();
        break;
      case 'inorder':
        this.inorderTraversal();
        break;
      case 'postorder':
        this.postorderTraversal();
        break;
      case 'levelorder':
        this.levelOrderTraversal();
        break;
    }
  }
}

/**
 * BST 二叉搜索树节点
 */
interface BSTNode {
  id: string;
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
  x?: number;
  y?: number;
  state: 'default' | 'visiting' | 'visited' | 'found' | 'inserting';
}

/**
 * BST 快照
 */
interface BSTSnapshot {
  nodes: Map<string, BSTNode>;
  rootId: string | null;
  visitedNodes: string[];
  currentNode?: string;
  message?: string;
}

/**
 * 二叉搜索树执行器
 */
export class BSTExecutor extends AlgorithmExecutor<BSTSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'bst',
    name: '二叉搜索树 (BST)',
    category: '树',
    description: '二叉搜索树(Binary Search Tree)是一种有序二叉树，满足：左子树所有节点值 < 根节点值 < 右子树所有节点值。中序遍历可得到有序序列。平均时间复杂度 O(log n)，但最坏退化为链表时为 O(n)。',
    timeComplexity: 'O(log n) 平均 / O(n) 最坏',
    spaceComplexity: 'O(n)',
    pseudocode: [
      '// BST 查找算法',
      'function BST_Search(T, key):',
      '    if T = NULL then',
      '        return NULL           // 查找失败',
      '    if key = T.data then',
      '        return T              // 查找成功',
      '    else if key < T.data then',
      '        return BST_Search(T.lchild, key)',
      '    else',
      '        return BST_Search(T.rchild, key)',
      '',
      '// BST 插入算法',
      'function BST_Insert(T, key):',
      '    if T = NULL then',
      '        T = new Node(key)    // 创建新节点',
      '        return T',
      '    if key < T.data then',
      '        T.lchild = BST_Insert(T.lchild, key)',
      '    else if key > T.data then',
      '        T.rchild = BST_Insert(T.rchild, key)',
      '    // key = T.data 则不插入重复值',
      '    return T',
    ],
  };

  private root: BSTNode | null = null;
  private nodesMap: Map<string, BSTNode> = new Map();

  /**
   * 执行插入操作
   */
  executeInsert(values: number[]): void {
    this.reset();
    this.root = null;
    this.nodesMap = new Map();

    this.addSnapshot(
      '初始化空BST',
      this.createSnapshot('开始构建BST'),
      [],
      10
    );

    for (const value of values) {
      this.insertWithAnimation(value);
    }

    this.addSnapshot(
      `BST 构建完成！共 ${values.length} 个节点`,
      this.createSnapshot('构建完成'),
      Array.from(this.nodesMap.keys()),
      0
    );
  }

  /**
   * 执行查找操作
   */
  executeSearch(values: number[], target: number): void {
    this.reset();
    this.root = null;
    this.nodesMap = new Map();

    // 静默构建树
    for (const value of values) {
      this.insertSilent(value);
    }

    this.calculatePositions();
    this.addSnapshot(
      `在BST中搜索 ${target}`,
      this.createSnapshot(`开始搜索 ${target}`),
      [],
      0
    );

    this.searchWithAnimation(target);
  }

  private insertWithAnimation(value: number): void {
    const newNode: BSTNode = {
      id: this.generateId(),
      value,
      left: null,
      right: null,
      state: 'inserting',
    };

    if (!this.root) {
      this.root = newNode;
      this.nodesMap.set(newNode.id, newNode);
      this.calculatePositions();
      newNode.state = 'visited';
      this.addSnapshot(
        `插入根节点 ${value}`,
        this.createSnapshot(`根节点: ${value}`),
        [newNode.id],
        12
      );
      newNode.state = 'default';
      return;
    }

    let current = this.root;
    const path: BSTNode[] = [];

    while (true) {
      path.push(current);
      current.state = 'visiting';
      this.calculatePositions();
      
      this.addSnapshot(
        `比较 ${value} 与 ${current.value}`,
        this.createSnapshot(`${value} ${value < current.value ? '<' : '>='} ${current.value}`),
        [],
        value < current.value ? 14 : 16
      );

      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          this.nodesMap.set(newNode.id, newNode);
          path.forEach(n => n.state = 'default');
          newNode.state = 'visited';
          this.calculatePositions();
          this.addSnapshot(
            `插入 ${value} 到左子树`,
            this.createSnapshot(`${value} 插入到 ${current.value} 的左边`),
            [newNode.id],
            15
          );
          newNode.state = 'default';
          return;
        }
        current.state = 'default';
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          this.nodesMap.set(newNode.id, newNode);
          path.forEach(n => n.state = 'default');
          newNode.state = 'visited';
          this.calculatePositions();
          this.addSnapshot(
            `插入 ${value} 到右子树`,
            this.createSnapshot(`${value} 插入到 ${current.value} 的右边`),
            [newNode.id],
            17
          );
          newNode.state = 'default';
          return;
        }
        current.state = 'default';
        current = current.right;
      }
    }
  }

  private insertSilent(value: number): void {
    const newNode: BSTNode = {
      id: this.generateId(),
      value,
      left: null,
      right: null,
      state: 'default',
    };

    this.nodesMap.set(newNode.id, newNode);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  private searchWithAnimation(target: number): void {
    let current = this.root;
    const visited: string[] = [];

    while (current) {
      current.state = 'visiting';
      visited.push(current.id);

      this.addSnapshot(
        `访问节点 ${current.value}`,
        this.createSnapshot(`比较 ${target} 与 ${current.value}`, current.id),
        [],
        3
      );

      if (target === current.value) {
        current.state = 'found';
        this.addSnapshot(
          `找到目标 ${target}！`,
          this.createSnapshot(`✓ 找到！`, current.id),
          [current.id],
          4
        );
        return;
      }

      current.state = 'visited';

      if (target < current.value) {
        this.addSnapshot(
          `${target} < ${current.value}，向左搜索`,
          this.createSnapshot(`向左`, current.id),
          [],
          6
        );
        current = current.left;
      } else {
        this.addSnapshot(
          `${target} > ${current.value}，向右搜索`,
          this.createSnapshot(`向右`, current.id),
          [],
          8
        );
        current = current.right;
      }
    }

    this.addSnapshot(
      `未找到 ${target}`,
      this.createSnapshot(`✗ 未找到 ${target}`),
      visited,
      2
    );
  }

  private calculatePositions(): void {
    if (!this.root) return;
    this.assignPosition(this.root, 300, 40, 120);
  }

  private assignPosition(node: BSTNode, x: number, y: number, spread: number): void {
    node.x = x;
    node.y = y;

    if (node.left) {
      this.assignPosition(node.left, x - spread, y + 70, spread / 1.8);
    }
    if (node.right) {
      this.assignPosition(node.right, x + spread, y + 70, spread / 1.8);
    }
  }

  private createSnapshot(message: string, currentId?: string): BSTSnapshot {
    return {
      nodes: new Map(this.nodesMap),
      rootId: this.root?.id || null,
      visitedNodes: [],
      currentNode: currentId,
      message,
    };
  }

  /**
   * 实现抽象 execute 方法
   */
  execute(values: number[], target?: number): void {
    if (target !== undefined) {
      this.executeSearch(values, target);
    } else {
      this.executeInsert(values);
    }
  }
}

/**
 * AVL 树节点
 */
interface AVLNode {
  id: string;
  value: number;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number;
  x?: number;
  y?: number;
  state: 'default' | 'visiting' | 'visited' | 'rotating';
}

/**
 * AVL 快照
 */
interface AVLSnapshot {
  nodes: Map<string, AVLNode>;
  rootId: string | null;
  visitedNodes: string[];
  currentNode?: string;
  message?: string;
  rotationType?: string;
}

/**
 * AVL 树执行器
 */
export class AVLExecutor extends AlgorithmExecutor<AVLSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'avl',
    name: 'AVL 平衡树',
    category: '树',
    description: 'AVL 树是最早发明的自平衡二叉搜索树，任意节点的平衡因子(BF = 左子树高度 - 右子树高度)的绝对值不超过 1。插入或删除导致不平衡时，通过 LL、RR、LR、RL 四种旋转操作恢复平衡。',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function AVL_Insert(T, key):',
      '    T = BST_Insert(T, key)    // 先按 BST 方式插入',
      '    T.height = 1 + max(H(T.L), H(T.R))',
      '    BF = H(T.L) - H(T.R)      // 计算平衡因子',
      '    ',
      '    // LL 型：在左孩子的左子树插入',
      '    if BF > 1 and key < T.L.data then',
      '        return RightRotate(T)',
      '    // RR 型：在右孩子的右子树插入',
      '    if BF < -1 and key > T.R.data then',
      '        return LeftRotate(T)',
      '    // LR 型：在左孩子的右子树插入',
      '    if BF > 1 and key > T.L.data then',
      '        T.L = LeftRotate(T.L)',
      '        return RightRotate(T)',
      '    // RL 型：在右孩子的左子树插入',
      '    if BF < -1 and key < T.R.data then',
      '        T.R = RightRotate(T.R)',
      '        return LeftRotate(T)',
      '    return T                  // 已平衡，无需旋转',
    ],
  };

  private root: AVLNode | null = null;
  private nodesMap: Map<string, AVLNode> = new Map();

  /**
   * 执行插入并可视化
   */
  executeInsert(values: number[]): void {
    this.reset();
    this.root = null;
    this.nodesMap = new Map();

    this.addSnapshot(
      '初始化空 AVL 树',
      this.createSnapshot('开始构建AVL树'),
      [],
      0
    );

    for (const value of values) {
      this.root = this.insertAVL(this.root, value);
    }

    this.calculatePositions();
    this.addSnapshot(
      `AVL 树构建完成！`,
      this.createSnapshot('构建完成'),
      Array.from(this.nodesMap.keys()),
      0
    );
  }

  private insertAVL(node: AVLNode | null, value: number): AVLNode {
    // 标准 BST 插入
    if (!node) {
      const newNode: AVLNode = {
        id: this.generateId(),
        value,
        left: null,
        right: null,
        height: 1,
        state: 'visiting',
      };
      this.nodesMap.set(newNode.id, newNode);
      this.calculatePositions();
      
      this.addSnapshot(
        `插入新节点 ${value}`,
        this.createSnapshot(`插入 ${value}`),
        [newNode.id],
        2
      );
      newNode.state = 'default';
      return newNode;
    }

    node.state = 'visiting';
    this.calculatePositions();
    this.addSnapshot(
      `比较 ${value} 与 ${node.value}`,
      this.createSnapshot(`${value} ${value < node.value ? '<' : '>'} ${node.value}`, node.id),
      [],
      2
    );

    if (value < node.value) {
      node.left = this.insertAVL(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertAVL(node.right, value);
    } else {
      node.state = 'default';
      return node; // 不允许重复值
    }

    // 更新高度
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    
    // 计算平衡因子
    const balance = this.getBalance(node);

    this.calculatePositions();
    this.addSnapshot(
      `节点 ${node.value} 的平衡因子 = ${balance}`,
      this.createSnapshot(`平衡因子: ${balance}`, node.id),
      [],
      6
    );

    // LL 情况
    if (balance > 1 && node.left && value < node.left.value) {
      node.state = 'rotating';
      this.calculatePositions();
      this.addSnapshot(
        `LL 不平衡！对 ${node.value} 执行右旋`,
        this.createSnapshot('LL: 右旋', node.id, 'LL'),
        [],
        10
      );
      const result = this.rightRotate(node);
      this.calculatePositions();
      this.addSnapshot(
        `右旋完成`,
        this.createSnapshot('右旋完成'),
        [],
        10
      );
      return result;
    }

    // RR 情况
    if (balance < -1 && node.right && value > node.right.value) {
      node.state = 'rotating';
      this.calculatePositions();
      this.addSnapshot(
        `RR 不平衡！对 ${node.value} 执行左旋`,
        this.createSnapshot('RR: 左旋', node.id, 'RR'),
        [],
        16
      );
      const result = this.leftRotate(node);
      this.calculatePositions();
      this.addSnapshot(
        `左旋完成`,
        this.createSnapshot('左旋完成'),
        [],
        16
      );
      return result;
    }

    // LR 情况
    if (balance > 1 && node.left && value > node.left.value) {
      node.state = 'rotating';
      this.calculatePositions();
      this.addSnapshot(
        `LR 不平衡！先对左子树左旋`,
        this.createSnapshot('LR: 先左旋', node.id, 'LR'),
        [],
        12
      );
      node.left = this.leftRotate(node.left);
      this.calculatePositions();
      this.addSnapshot(
        `再对当前节点右旋`,
        this.createSnapshot('LR: 后右旋', node.id),
        [],
        13
      );
      const result = this.rightRotate(node);
      this.calculatePositions();
      this.addSnapshot(
        `LR 双旋转完成`,
        this.createSnapshot('LR完成'),
        [],
        13
      );
      return result;
    }

    // RL 情况
    if (balance < -1 && node.right && value < node.right.value) {
      node.state = 'rotating';
      this.calculatePositions();
      this.addSnapshot(
        `RL 不平衡！先对右子树右旋`,
        this.createSnapshot('RL: 先右旋', node.id, 'RL'),
        [],
        18
      );
      node.right = this.rightRotate(node.right);
      this.calculatePositions();
      this.addSnapshot(
        `再对当前节点左旋`,
        this.createSnapshot('RL: 后左旋', node.id),
        [],
        19
      );
      const result = this.leftRotate(node);
      this.calculatePositions();
      this.addSnapshot(
        `RL 双旋转完成`,
        this.createSnapshot('RL完成'),
        [],
        19
      );
      return result;
    }

    node.state = 'default';
    return node;
  }

  private getHeight(node: AVLNode | null): number {
    return node ? node.height : 0;
  }

  private getBalance(node: AVLNode | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  private rightRotate(y: AVLNode): AVLNode {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

    y.state = 'default';
    x.state = 'default';

    return x;
  }

  private leftRotate(x: AVLNode): AVLNode {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

    x.state = 'default';
    y.state = 'default';

    return y;
  }

  private calculatePositions(): void {
    if (!this.root) return;
    this.assignPosition(this.root, 300, 40, 120);
  }

  private assignPosition(node: AVLNode, x: number, y: number, spread: number): void {
    node.x = x;
    node.y = y;

    if (node.left) {
      this.assignPosition(node.left, x - spread, y + 80, spread / 1.8);
    }
    if (node.right) {
      this.assignPosition(node.right, x + spread, y + 80, spread / 1.8);
    }
  }

  private createSnapshot(message: string, currentId?: string, rotation?: string): AVLSnapshot {
    return {
      nodes: new Map(this.nodesMap),
      rootId: this.root?.id || null,
      visitedNodes: [],
      currentNode: currentId,
      message,
      rotationType: rotation,
    };
  }

  /**
   * 实现抽象 execute 方法
   */
  execute(values: number[]): void {
    this.executeInsert(values);
  }
}
