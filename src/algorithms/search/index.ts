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
    description: '二分查找是一种在有序数组中查找特定元素的高效算法，每次比较都将搜索范围缩小一半。',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function BinarySearch(array, target):',
      '    left = 0',
      '    right = array.length - 1',
      '    while left <= right:',
      '        mid = (left + right) / 2',
      '        if array[mid] == target:',
      '            return mid  // 找到目标',
      '        if array[mid] < target:',
      '            left = mid + 1  // 在右半部分查找',
      '        else:',
      '            right = mid - 1  // 在左半部分查找',
      '    return -1  // 未找到',
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
    description: '哈希查找通过哈希函数直接计算元素的存储位置，平均情况下可以达到 O(1) 的查找效率。使用线性探测解决冲突。',
    timeComplexity: 'O(1) 平均 / O(n) 最坏',
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function HashSearch(table, key):',
      '    hashValue = hash(key)  // 计算哈希值',
      '    index = hashValue % tableSize',
      '    probeCount = 0',
      '    while table[index] != empty:',
      '        if table[index].key == key:',
      '            return index  // 找到目标',
      '        // 线性探测',
      '        index = (index + 1) % tableSize',
      '        probeCount++',
      '        if probeCount >= tableSize:',
      '            break  // 已遍历整个表',
      '    return -1  // 未找到',
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
    description: '顺序查找从数组的第一个元素开始，依次比较每个元素直到找到目标或遍历完整个数组。',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function SequentialSearch(array, target):',
      '    for i = 0 to array.length - 1:',
      '        if array[i] == target:',
      '            return i  // 找到目标',
      '    return -1  // 未找到',
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
