import { AlgorithmExecutor } from '../AlgorithmExecutor';
import { AlgorithmMeta, ArrayElement } from '../../types';

/**
 * 查找快照类型
 */
interface SearchSnapshot {
  array: ArrayElement[];
  comparingIndices: number[];
  highlightedIndices: number[];
  sortedIndices: number[];
  pivotIndex?: number;
  message?: string;
}

/**
 * 二分查找执行器
 */
export class BinarySearchExecutor extends AlgorithmExecutor<SearchSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'binary-search',
    name: '二分查找',
    category: '查找',
    description: '二分查找(折半查找)适用于有序顺序表，每次将待查区间缩小一半，查找效率高。要求：1)顺序存储；2)元素有序。是分治思想的典型应用。',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function BinarySearch(A, n, key):',
      '    // A[0..n-1] 为有序数组',
      '    low = 0',
      '    high = n - 1',
      '    while low ≤ high do',
      '        mid = (low + high) / 2    // 取中间位置',
      '        if A[mid] = key then',
      '            return mid            // 查找成功',
      '        else if A[mid] > key then',
      '            high = mid - 1        // 在左半区间查找',
      '        else',
      '            low = mid + 1         // 在右半区间查找',
      '    return -1                     // 查找失败',
    ],
  };

  execute(arr: number[], target: number): void {
    this.reset();
    
    // 确保数组有序
    const sortedArr = [...arr].sort((a, b) => a - b);
    const elements: ArrayElement[] = sortedArr.map((value, index) => ({
      id: `el-${index}`,
      value,
      state: 'default' as const,
    }));

    this.addSnapshot(
      `在有序数组中查找 ${target}`,
      {
        array: elements.map(e => ({ ...e })),
        comparingIndices: [],
        highlightedIndices: [],
        sortedIndices: [],
      },
      [],
      0
    );

    let left = 0;
    let right = elements.length - 1;

    this.addSnapshot(
      `初始化：left = 0, right = ${right}`,
      {
        array: elements.map(e => ({ ...e })),
        comparingIndices: [0, right],
        highlightedIndices: [],
        sortedIndices: [],
      },
      [],
      2
    );

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      // 标记中间位置
      elements.forEach((e, i) => {
        if (i === mid) {
          e.state = 'comparing';
        } else if (i >= left && i <= right) {
          e.state = 'default';
        } else {
          e.state = 'sorted'; // 已排除的区域
        }
      });

      this.addSnapshot(
        `计算中间位置 mid = ${mid}, 值 = ${elements[mid].value}`,
        {
          array: elements.map(e => ({ ...e })),
          comparingIndices: [mid],
          highlightedIndices: [],
          sortedIndices: [],
          pivotIndex: mid,
        },
        [],
        4
      );

      if (elements[mid].value === target) {
        elements[mid].state = 'swapping'; // 找到了，用特殊状态标记
        this.addSnapshot(
          `找到目标 ${target}！位置：${mid}`,
          {
            array: elements.map(e => ({ ...e })),
            comparingIndices: [],
            highlightedIndices: [mid],
            sortedIndices: [mid],
            pivotIndex: mid,
          },
          [elements[mid].id],
          6
        );
        return;
      }

      if (elements[mid].value < target) {
        this.addSnapshot(
          `${elements[mid].value} < ${target}，在右半部分查找`,
          {
            array: elements.map(e => ({ ...e })),
            comparingIndices: [mid],
            highlightedIndices: [],
            sortedIndices: Array.from({ length: mid + 1 }, (_, i) => i),
          },
          [],
          8
        );
        left = mid + 1;
      } else {
        this.addSnapshot(
          `${elements[mid].value} > ${target}，在左半部分查找`,
          {
            array: elements.map(e => ({ ...e })),
            comparingIndices: [mid],
            highlightedIndices: [],
            sortedIndices: Array.from({ length: elements.length - mid }, (_, i) => mid + i),
          },
          [],
          10
        );
        right = mid - 1;
      }
    }

    // 未找到
    elements.forEach(e => e.state = 'sorted');
    this.addSnapshot(
      `未找到 ${target}`,
      {
        array: elements.map(e => ({ ...e })),
        comparingIndices: [],
        highlightedIndices: [],
        sortedIndices: elements.map((_, i) => i),
      },
      [],
      11
    );
  }
}

/**
 * 哈希表项
 */
interface HashEntry {
  key: number;
  value: number;
  state: 'empty' | 'occupied' | 'deleted' | 'comparing' | 'found' | 'collision';
}

/**
 * 哈希查找快照
 */
interface HashSnapshot {
  table: HashEntry[];
  currentIndex?: number;
  probeSequence: number[];
  message: string;
  hashValue?: number;
  collisionCount: number;
}

/**
 * 哈希查找执行器
 */
export class HashSearchExecutor extends AlgorithmExecutor<HashSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'hash-search',
    name: '哈希查找',
    category: '查找',
    description: '哈希查找通过哈希函数 H(key) 直接计算存储地址，理想情况下时间复杂度为 O(1)。处理冲突的方法有：开放定址法(线性探测、二次探测)、链地址法等。装填因子 α = 记录数/表长，影响查找效率。',
    timeComplexity: 'O(1) 平均 / O(n) 最坏',
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function HashSearch(HT, key):',
      '    // 使用除留余数法计算哈希地址',
      '    addr = H(key) = key mod p    // p 为质数',
      '    if HT[addr] = EMPTY then',
      '        return -1               // 查找失败',
      '    else if HT[addr].key = key then',
      '        return addr             // 查找成功',
      '    else',
      '        // 线性探测法处理冲突',
      '        i = 1',
      '        while i < m do          // m 为表长',
      '            addr = (H(key) + i) mod m',
      '            if HT[addr] = EMPTY then',
      '                return -1       // 查找失败',
      '            if HT[addr].key = key then',
      '                return addr     // 查找成功',
      '            i = i + 1',
      '        return -1               // 表满，查找失败',
    ],
  };

  private tableSize = 11; // 使用质数作为表大小

  /**
   * 构建哈希表并执行查找
   */
  execute(values: number[], target: number): void {
    this.reset();

    // 初始化空哈希表
    const table: HashEntry[] = Array(this.tableSize).fill(null).map(() => ({
      key: -1,
      value: -1,
      state: 'empty' as const,
    }));

    this.addSnapshot(
      `初始化大小为 ${this.tableSize} 的哈希表`,
      {
        table: table.map(e => ({ ...e })),
        probeSequence: [],
        message: '空哈希表',
        collisionCount: 0,
      },
      [],
      0
    );

    // 插入所有元素
    for (const value of values) {
      this.insertWithAnimation(table, value);
    }

    // 开始查找
    this.searchWithAnimation(table, target);
  }

  private hash(key: number): number {
    return key % this.tableSize;
  }

  private insertWithAnimation(table: HashEntry[], key: number): void {
    const hashValue = this.hash(key);
    let index = hashValue;
    let probeCount = 0;
    const probeSequence: number[] = [];

    this.addSnapshot(
      `插入 ${key}：hash(${key}) = ${key} % ${this.tableSize} = ${hashValue}`,
      {
        table: table.map(e => ({ ...e })),
        currentIndex: index,
        probeSequence: [index],
        message: `哈希值 = ${hashValue}`,
        hashValue,
        collisionCount: probeCount,
      },
      [],
      1
    );

    while (table[index].state === 'occupied') {
      probeSequence.push(index);
      table[index].state = 'collision';
      probeCount++;

      this.addSnapshot(
        `位置 ${index} 已被占用，发生冲突`,
        {
          table: table.map(e => ({ ...e })),
          currentIndex: index,
          probeSequence: [...probeSequence],
          message: `冲突！探测下一位置`,
          hashValue,
          collisionCount: probeCount,
        },
        [],
        8
      );

      table[index].state = 'occupied';
      index = (index + 1) % this.tableSize;

      if (probeCount >= this.tableSize) {
        this.addSnapshot(
          `哈希表已满，无法插入 ${key}`,
          {
            table: table.map(e => ({ ...e })),
            probeSequence: [...probeSequence],
            message: '表满！',
            collisionCount: probeCount,
          },
          [],
          0
        );
        return;
      }
    }

    probeSequence.push(index);
    table[index] = {
      key,
      value: key,
      state: 'occupied',
    };

    this.addSnapshot(
      `在位置 ${index} 插入 ${key}`,
      {
        table: table.map(e => ({ ...e })),
        currentIndex: index,
        probeSequence: [...probeSequence],
        message: `成功插入到位置 ${index}`,
        hashValue,
        collisionCount: probeCount,
      },
      [],
      0
    );
  }

  private searchWithAnimation(table: HashEntry[], target: number): void {
    const hashValue = this.hash(target);
    let index = hashValue;
    let probeCount = 0;
    const probeSequence: number[] = [];

    this.addSnapshot(
      `查找 ${target}：hash(${target}) = ${hashValue}`,
      {
        table: table.map(e => ({ ...e })),
        currentIndex: index,
        probeSequence: [index],
        message: `开始查找，初始位置 = ${hashValue}`,
        hashValue,
        collisionCount: 0,
      },
      [],
      1
    );

    while (table[index].state !== 'empty') {
      probeSequence.push(index);
      const originalState = table[index].state;
      table[index].state = 'comparing';

      this.addSnapshot(
        `检查位置 ${index}，值 = ${table[index].key}`,
        {
          table: table.map(e => ({ ...e })),
          currentIndex: index,
          probeSequence: [...probeSequence],
          message: `比较 ${table[index].key} 与 ${target}`,
          hashValue,
          collisionCount: probeCount,
        },
        [],
        5
      );

      if (table[index].key === target) {
        table[index].state = 'found';
        this.addSnapshot(
          `找到目标 ${target}！位置：${index}`,
          {
            table: table.map(e => ({ ...e })),
            currentIndex: index,
            probeSequence: [...probeSequence],
            message: `✓ 找到！探测次数：${probeCount}`,
            hashValue,
            collisionCount: probeCount,
          },
          [],
          6
        );
        return;
      }

      table[index].state = originalState;
      index = (index + 1) % this.tableSize;
      probeCount++;

      if (probeCount >= this.tableSize) {
        break;
      }

      this.addSnapshot(
        `不匹配，线性探测到位置 ${index}`,
        {
          table: table.map(e => ({ ...e })),
          currentIndex: index,
          probeSequence: [...probeSequence],
          message: `探测次数：${probeCount}`,
          hashValue,
          collisionCount: probeCount,
        },
        [],
        8
      );
    }

    this.addSnapshot(
      `未找到 ${target}`,
      {
        table: table.map(e => ({ ...e })),
        probeSequence: [...probeSequence],
        message: `✗ 未找到，探测次数：${probeCount}`,
        hashValue,
        collisionCount: probeCount,
      },
      [],
      12
    );
  }
}

/**
 * 顺序查找执行器
 */
export class SequentialSearchExecutor extends AlgorithmExecutor<SearchSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'sequential-search',
    name: '顺序查找',
    category: '查找',
    description: '顺序查找(线性查找)从表的一端开始，依次将每个元素与给定值比较。适用于顺序表和链表，对表是否有序无要求。引入"哨兵"可减少比较次数。',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function SeqSearch(A, n, key):',
      '    // 带哨兵的顺序查找',
      '    A[0] = key                // A[0] 作为哨兵',
      '    i = n                     // 从后向前查找',
      '    while A[i] ≠ key do',
      '        i = i - 1',
      '    return i                  // i=0 表示查找失败',
      '',
      '// 不带哨兵的版本',
      'function SeqSearch2(A, n, key):',
      '    for i = 1 to n do',
      '        if A[i] = key then',
      '            return i          // 查找成功',
      '    return 0                  // 查找失败',
    ],
  };

  execute(arr: number[], target: number): void {
    this.reset();
    
    const elements: ArrayElement[] = arr.map((value, index) => ({
      id: `el-${index}`,
      value,
      state: 'default' as const,
    }));

    this.addSnapshot(
      `在数组中查找 ${target}`,
      {
        array: elements.map(e => ({ ...e })),
        comparingIndices: [],
        highlightedIndices: [],
        sortedIndices: [],
      },
      [],
      0
    );

    for (let i = 0; i < elements.length; i++) {
      elements[i].state = 'comparing';
      
      this.addSnapshot(
        `检查位置 ${i}，值 = ${elements[i].value}`,
        {
          array: elements.map(e => ({ ...e })),
          comparingIndices: [i],
          highlightedIndices: [],
          sortedIndices: Array.from({ length: i }, (_, j) => j),
        },
        [],
        2
      );

      if (elements[i].value === target) {
        elements[i].state = 'swapping';
        this.addSnapshot(
          `找到目标 ${target}！位置：${i}`,
          {
            array: elements.map(e => ({ ...e })),
            comparingIndices: [],
            highlightedIndices: [i],
            sortedIndices: [i],
          },
          [elements[i].id],
          3
        );
        return;
      }

      elements[i].state = 'sorted';
    }

    this.addSnapshot(
      `未找到 ${target}`,
      {
        array: elements.map(e => ({ ...e })),
        comparingIndices: [],
        highlightedIndices: [],
        sortedIndices: elements.map((_, i) => i),
      },
      [],
      4
    );
  }
}
