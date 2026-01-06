import { AlgorithmExecutor } from '../AlgorithmExecutor';
import { AlgorithmMeta, LinkedListSnapshot, ListNode } from '../../types';

/**
 * 链表操作执行器
 */
export class LinkedListExecutor extends AlgorithmExecutor<LinkedListSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'linked-list',
    name: '单链表操作',
    category: '线性表',
    description: '单链表是一种链式存取的数据结构，用一组地址任意的存储单元存放线性表中的数据元素。',
    timeComplexity: '查找 O(n)，插入/删除 O(1)',
    spaceComplexity: 'O(n)',
    pseudocode: [
      '// 头插法',
      'function insertAtHead(value):',
      '    newNode = createNode(value)',
      '    newNode.next = head',
      '    head = newNode',
      '',
      '// 尾插法',
      'function insertAtTail(value):',
      '    newNode = createNode(value)',
      '    if head is null:',
      '        head = newNode',
      '    else:',
      '        current = head',
      '        while current.next is not null:',
      '            current = current.next',
      '        current.next = newNode',
    ],
  };

  private nodes: ListNode[] = [];
  private headId: string | null = null;

  execute(values: number[]): void {
    this.reset();
    this.nodes = [];
    this.headId = null;

    // 使用尾插法构建链表
    values.forEach((value, _index) => {
      this.insertAtTail(value);
    });
  }

  /**
   * 头插法
   */
  insertAtHead(value: number): void {
    const newNode: ListNode = {
      id: this.generateId(),
      value,
      next: this.headId,
    };

    this.addSnapshot(
      `创建新节点 ${value}`,
      {
        nodes: [...this.nodes, newNode],
        headId: this.headId,
        highlightedPointers: [newNode.id],
      },
      [newNode.id],
      2
    );

    this.nodes.push(newNode);

    this.addSnapshot(
      `将新节点的 next 指向原 head`,
      {
        nodes: [...this.nodes],
        headId: this.headId,
        highlightedPointers: [newNode.id],
      },
      [newNode.id],
      3
    );

    this.headId = newNode.id;

    this.addSnapshot(
      `更新 head 指向新节点`,
      {
        nodes: [...this.nodes],
        headId: this.headId,
      },
      [newNode.id],
      4
    );
  }

  /**
   * 尾插法
   */
  insertAtTail(value: number): void {
    const newNode: ListNode = {
      id: this.generateId(),
      value,
      next: null,
    };

    this.addSnapshot(
      `创建新节点 ${value}`,
      {
        nodes: [...this.nodes, newNode],
        headId: this.headId,
      },
      [newNode.id],
      7
    );

    if (this.headId === null) {
      this.nodes.push(newNode);
      this.headId = newNode.id;
      this.addSnapshot(
        `链表为空，新节点成为 head`,
        {
          nodes: [...this.nodes],
          headId: this.headId,
        },
        [newNode.id],
        10
      );
    } else {
      this.nodes.push(newNode);
      
      // 找到尾节点
      let current = this.nodes.find(n => n.id === this.headId)!;
      const visited: string[] = [current.id];
      
      this.addSnapshot(
        `从 head 开始遍历，当前节点: ${current.value}`,
        {
          nodes: [...this.nodes],
          headId: this.headId,
          currentPointer: current.id,
        },
        [current.id],
        12
      );

      while (current.next !== null) {
        const nextNode = this.nodes.find(n => n.id === current.next)!;
        visited.push(nextNode.id);
        current = nextNode;
        
        this.addSnapshot(
          `移动到下一个节点: ${current.value}`,
          {
            nodes: [...this.nodes],
            headId: this.headId,
            currentPointer: current.id,
          },
          visited,
          14
        );
      }

      // 更新尾节点的 next
      const tailIndex = this.nodes.findIndex(n => n.id === current.id);
      this.nodes[tailIndex].next = newNode.id;
      
      this.addSnapshot(
        `将尾节点 ${current.value} 的 next 指向新节点 ${value}`,
        {
          nodes: [...this.nodes],
          headId: this.headId,
          highlightedPointers: [current.id, newNode.id],
        },
        [current.id, newNode.id],
        15
      );
    }
  }

  /**
   * 删除节点
   */
  deleteNode(value: number): void {
    if (this.headId === null) {
      this.addSnapshot('链表为空，无法删除', {
        nodes: [],
        headId: null,
      }, [], 0);
      return;
    }

    // 找到要删除的节点和前驱节点
    let prev: ListNode | null = null;
    let current = this.nodes.find(n => n.id === this.headId)!;

    while (current && current.value !== value) {
      this.addSnapshot(
        `当前节点 ${current.value} ≠ ${value}，继续查找`,
        {
          nodes: [...this.nodes],
          headId: this.headId,
          currentPointer: current.id,
        },
        [current.id],
        0
      );
      prev = current;
      const nextNode = this.nodes.find(n => n.id === current.next);
      if (!nextNode) break;
      current = nextNode;
    }

    if (current && current.value === value) {
      this.addSnapshot(
        `找到要删除的节点: ${value}`,
        {
          nodes: [...this.nodes],
          headId: this.headId,
          currentPointer: current.id,
        },
        [current.id],
        0
      );

      if (prev === null) {
        // 删除头节点
        this.headId = current.next;
      } else {
        // 删除中间或尾节点
        const prevIndex = this.nodes.findIndex(n => n.id === prev!.id);
        this.nodes[prevIndex].next = current.next;
      }

      // 移除节点
      this.nodes = this.nodes.filter(n => n.id !== current.id);

      this.addSnapshot(
        `节点 ${value} 已删除`,
        {
          nodes: [...this.nodes],
          headId: this.headId,
        },
        [],
        0
      );
    }
  }

  getNodes(): ListNode[] {
    return this.nodes;
  }

  getHeadId(): string | null {
    return this.headId;
  }
}

/**
 * 双向链表节点
 */
interface DoublyListNode extends ListNode {
  prev: string | null;
}

/**
 * 双向链表快照
 */
interface DoublyLinkedListSnapshot {
  nodes: DoublyListNode[];
  headId: string | null;
  tailId: string | null;
  currentPointer?: string;
  highlightedPointers?: string[];
}

/**
 * 双向链表执行器
 */
export class DoublyLinkedListExecutor extends AlgorithmExecutor<DoublyLinkedListSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'doubly-linked-list',
    name: '双向链表',
    category: '线性表',
    description: '双向链表的每个节点有两个指针，分别指向前驱和后继，支持双向遍历。',
    timeComplexity: 'O(1) 插入/删除，O(n) 查找',
    spaceComplexity: 'O(n)',
    pseudocode: [
      '// 双向链表节点',
      'struct Node:',
      '    value',
      '    prev  // 前驱指针',
      '    next  // 后继指针',
      '',
      '// 在指定节点后插入',
      'function insertAfter(node, value):',
      '    newNode = createNode(value)',
      '    newNode.prev = node',
      '    newNode.next = node.next',
      '    if node.next != null:',
      '        node.next.prev = newNode',
      '    node.next = newNode',
      '',
      '// 删除节点',
      'function deleteNode(node):',
      '    if node.prev != null:',
      '        node.prev.next = node.next',
      '    if node.next != null:',
      '        node.next.prev = node.prev',
    ],
  };

  private nodes: DoublyListNode[] = [];
  private headId: string | null = null;
  private tailId: string | null = null;

  /**
   * 构建双向链表
   */
  execute(values: number[]): void {
    this.reset();
    this.nodes = [];
    this.headId = null;
    this.tailId = null;

    this.addSnapshot(
      '初始化空双向链表',
      { nodes: [], headId: null, tailId: null },
      [],
      0
    );

    for (const value of values) {
      this.insertAtTail(value);
    }
  }

  private insertAtTail(value: number): void {
    const newNode: DoublyListNode = {
      id: this.generateId(),
      value,
      prev: this.tailId,
      next: null,
    };

    this.addSnapshot(
      `创建新节点 ${value}`,
      {
        nodes: [...this.nodes, newNode],
        headId: this.headId,
        tailId: this.tailId,
        highlightedPointers: [newNode.id],
      },
      [newNode.id],
      8
    );

    if (this.headId === null) {
      this.nodes.push(newNode);
      this.headId = newNode.id;
      this.tailId = newNode.id;
      this.addSnapshot(
        `链表为空，新节点成为头尾节点`,
        {
          nodes: [...this.nodes],
          headId: this.headId,
          tailId: this.tailId,
        },
        [newNode.id],
        0
      );
    } else {
      // 更新原尾节点的 next
      const tailIndex = this.nodes.findIndex(n => n.id === this.tailId);
      this.nodes[tailIndex].next = newNode.id;
      
      this.nodes.push(newNode);
      
      this.addSnapshot(
        `设置新节点的 prev 指向原尾节点`,
        {
          nodes: [...this.nodes],
          headId: this.headId,
          tailId: this.tailId,
          highlightedPointers: [this.tailId!, newNode.id],
        },
        [this.tailId!, newNode.id],
        9
      );

      this.tailId = newNode.id;

      this.addSnapshot(
        `更新尾指针`,
        {
          nodes: [...this.nodes],
          headId: this.headId,
          tailId: this.tailId,
        },
        [newNode.id],
        0
      );
    }
  }

  /**
   * 删除指定位置的节点
   */
  deleteAtIndex(values: number[], deleteIndex: number): void {
    this.reset();
    this.nodes = [];
    this.headId = null;
    this.tailId = null;

    // 先构建链表
    for (let i = 0; i < values.length; i++) {
      const newNode: DoublyListNode = {
        id: `node-${i}`,
        value: values[i],
        prev: this.tailId,
        next: null,
      };
      if (this.tailId) {
        const tailIndex = this.nodes.findIndex(n => n.id === this.tailId);
        this.nodes[tailIndex].next = newNode.id;
      } else {
        this.headId = newNode.id;
      }
      this.nodes.push(newNode);
      this.tailId = newNode.id;
    }

    this.addSnapshot(
      `准备删除位置 ${deleteIndex} 的节点`,
      {
        nodes: [...this.nodes],
        headId: this.headId,
        tailId: this.tailId,
      },
      [],
      16
    );

    if (deleteIndex < 0 || deleteIndex >= this.nodes.length) {
      return;
    }

    const deleteNode = this.nodes[deleteIndex];

    this.addSnapshot(
      `定位到要删除的节点: ${deleteNode.value}`,
      {
        nodes: [...this.nodes],
        headId: this.headId,
        tailId: this.tailId,
        currentPointer: deleteNode.id,
      },
      [deleteNode.id],
      17
    );

    // 更新前驱节点的 next
    if (deleteNode.prev) {
      const prevIndex = this.nodes.findIndex(n => n.id === deleteNode.prev);
      this.nodes[prevIndex].next = deleteNode.next;
    } else {
      this.headId = deleteNode.next;
    }

    // 更新后继节点的 prev
    if (deleteNode.next) {
      const nextIndex = this.nodes.findIndex(n => n.id === deleteNode.next);
      this.nodes[nextIndex].prev = deleteNode.prev;
    } else {
      this.tailId = deleteNode.prev;
    }

    this.addSnapshot(
      `更新相邻节点的指针`,
      {
        nodes: [...this.nodes],
        headId: this.headId,
        tailId: this.tailId,
        highlightedPointers: [deleteNode.prev, deleteNode.next].filter(Boolean) as string[],
      },
      [],
      18
    );

    // 移除节点
    this.nodes = this.nodes.filter(n => n.id !== deleteNode.id);

    this.addSnapshot(
      `删除完成`,
      {
        nodes: [...this.nodes],
        headId: this.headId,
        tailId: this.tailId,
      },
      [],
      0
    );
  }
}

/**
 * 循环链表快照
 */
interface CircularLinkedListSnapshot {
  nodes: ListNode[];
  headId: string | null;
  currentPointer?: string;
  highlightedPointers?: string[];
  eliminatedNodes?: number[];
}

/**
 * 循环链表执行器
 */
export class CircularLinkedListExecutor extends AlgorithmExecutor<CircularLinkedListSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'circular-linked-list',
    name: '循环链表',
    category: '线性表',
    description: '循环链表的尾节点指向头节点形成一个环，可用于实现循环队列、约瑟夫问题等场景。',
    timeComplexity: 'O(n) 遍历',
    spaceComplexity: 'O(n)',
    pseudocode: [
      '// 循环链表: 尾节点的 next 指向头节点',
      '',
      '// 遍历循环链表',
      'function traverse(head):',
      '    if head == null: return',
      '    current = head',
      '    do:',
      '        visit(current)',
      '        current = current.next',
      '    while current != head',
      '',
      '// 约瑟夫问题 (n人围圈，每k个出列)',
      'function josephus(n, k):',
      '    构建 n 个节点的循环链表',
      '    current = head',
      '    while 剩余节点 > 1:',
      '        移动 k-1 步',
      '        删除当前节点',
      '        current = 下一个节点',
      '    return 最后剩余的节点',
    ],
  };

  private nodes: ListNode[] = [];
  private headId: string | null = null;

  /**
   * 构建循环链表并遍历
   */
  execute(values: number[]): void {
    this.reset();
    this.nodes = [];
    this.headId = null;

    // 构建链表
    for (let i = 0; i < values.length; i++) {
      const newNode: ListNode = {
        id: `node-${i}`,
        value: values[i],
        next: null,
      };
      if (this.nodes.length > 0) {
        this.nodes[this.nodes.length - 1].next = newNode.id;
      } else {
        this.headId = newNode.id;
      }
      this.nodes.push(newNode);
    }

    // 形成环
    if (this.nodes.length > 0) {
      this.nodes[this.nodes.length - 1].next = this.headId;
    }

    this.addSnapshot(
      `循环链表构建完成 (${values.join(' → ')} → head)`,
      {
        nodes: [...this.nodes],
        headId: this.headId,
      },
      [],
      0
    );

    // 遍历演示
    if (this.nodes.length > 0) {
      let current = 0;
      const visited: string[] = [];

      this.addSnapshot(
        '开始遍历循环链表',
        {
          nodes: [...this.nodes],
          headId: this.headId,
        },
        [],
        3
      );

      do {
        visited.push(this.nodes[current].id);
        this.addSnapshot(
          `访问节点 ${this.nodes[current].value}`,
          {
            nodes: [...this.nodes],
            headId: this.headId,
            currentPointer: this.nodes[current].id,
            highlightedPointers: [...visited],
          },
          visited,
          7
        );
        current = (current + 1) % this.nodes.length;
      } while (current !== 0);

      this.addSnapshot(
        `遍历完成，回到头节点`,
        {
          nodes: [...this.nodes],
          headId: this.headId,
          highlightedPointers: visited,
        },
        visited,
        9
      );
    }
  }

  /**
   * 约瑟夫问题演示
   */
  josephus(n: number, k: number): void {
    this.reset();
    this.nodes = [];
    this.headId = null;

    // 构建 n 个节点的循环链表
    for (let i = 1; i <= n; i++) {
      const newNode: ListNode = {
        id: `node-${i}`,
        value: i,
        next: null,
      };
      if (this.nodes.length > 0) {
        this.nodes[this.nodes.length - 1].next = newNode.id;
      } else {
        this.headId = newNode.id;
      }
      this.nodes.push(newNode);
    }
    this.nodes[this.nodes.length - 1].next = this.headId;

    this.addSnapshot(
      `约瑟夫问题: ${n}人围成一圈，每报数到${k}的人出列`,
      {
        nodes: [...this.nodes],
        headId: this.headId,
        eliminatedNodes: [],
      },
      [],
      12
    );

    let currentIndex = 0;
    const eliminationOrder: number[] = [];

    while (this.nodes.length > 1) {
      // 移动 k-1 步
      for (let step = 1; step < k; step++) {
        this.addSnapshot(
          `报数 ${step}，当前: ${this.nodes[currentIndex].value}`,
          {
            nodes: [...this.nodes],
            headId: this.headId,
            currentPointer: this.nodes[currentIndex].id,
            eliminatedNodes: [...eliminationOrder],
          },
          [],
          16
        );
        currentIndex = (currentIndex + 1) % this.nodes.length;
      }

      // 删除当前节点
      const eliminated = this.nodes[currentIndex];
      eliminationOrder.push(eliminated.value);

      this.addSnapshot(
        `报数 ${k}! 节点 ${eliminated.value} 出列`,
        {
          nodes: [...this.nodes],
          headId: this.headId,
          currentPointer: eliminated.id,
          eliminatedNodes: [...eliminationOrder],
        },
        [eliminated.id],
        17
      );

      // 更新链接
      const prevIndex = (currentIndex - 1 + this.nodes.length) % this.nodes.length;
      const nextIndex = (currentIndex + 1) % this.nodes.length;
      
      if (this.nodes.length > 1) {
        this.nodes[prevIndex].next = this.nodes[nextIndex].id;
      }

      this.nodes.splice(currentIndex, 1);
      if (currentIndex >= this.nodes.length) {
        currentIndex = 0;
      }

      // 重建环
      if (this.nodes.length > 0) {
        this.nodes[this.nodes.length - 1].next = this.nodes[0].id;
        this.headId = this.nodes[0].id;
      }
    }

    if (this.nodes.length === 1) {
      this.addSnapshot(
        `约瑟夫问题解决! 幸存者: ${this.nodes[0].value}, 出列顺序: ${eliminationOrder.join(' → ')}`,
        {
          nodes: [...this.nodes],
          headId: this.headId,
          highlightedPointers: [this.nodes[0].id],
          eliminatedNodes: eliminationOrder,
        },
        [this.nodes[0].id],
        19
      );
    }
  }
}
