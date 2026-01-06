import { AlgorithmExecutor } from '../AlgorithmExecutor';
import { AlgorithmMeta, SortSnapshot, ArrayElement, ArrayElementState } from '../../types';

/**
 * 冒泡排序执行器
 */
export class BubbleSortExecutor extends AlgorithmExecutor<SortSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'bubble-sort',
    name: '冒泡排序',
    category: '排序算法',
    description: '冒泡排序是一种简单的交换排序算法。它重复遍历待排序序列，依次比较相邻元素，若逆序则交换，使较大元素像气泡一样"浮"到数组末端。算法稳定，适用于小规模数据。',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function BubbleSort(A[], n):',
      '    for i = 1 to n-1 do           // 进行 n-1 趟',
      '        flag = false              // 本趟是否发生交换',
      '        for j = 1 to n-i do       // 每趟比较 n-i 次',
      '            if A[j] > A[j+1] then // 相邻比较',
      '                swap(A[j], A[j+1])',
      '                flag = true',
      '        if flag == false then     // 提前结束优化',
      '            break',
      '    return A',
    ],
  };

  execute(inputArray: number[]): void {
    this.reset();
    const arr = inputArray.map((value, index) => ({
      id: `element-${index}`,
      value,
      state: 'default' as ArrayElementState,
    }));
    const sortedIndices: number[] = [];

    // 初始状态
    this.addSnapshot(
      '初始数组',
      { array: [...arr], sortedIndices: [] },
      [],
      0
    );

    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // 比较
        arr[j].state = 'comparing';
        arr[j + 1].state = 'comparing';
        this.addSnapshot(
          `比较 arr[${j}]=${arr[j].value} 和 arr[${j + 1}]=${arr[j + 1].value}`,
          {
            array: arr.map(el => ({ ...el })),
            comparingIndices: [j, j + 1] as [number, number],
            sortedIndices: [...sortedIndices],
          },
          [arr[j].id, arr[j + 1].id],
          4
        );

        if (arr[j].value > arr[j + 1].value) {
          // 交换
          arr[j].state = 'swapping';
          arr[j + 1].state = 'swapping';
          this.addSnapshot(
            `交换 ${arr[j].value} 和 ${arr[j + 1].value}`,
            {
              array: arr.map(el => ({ ...el })),
              swappingIndices: [j, j + 1] as [number, number],
              sortedIndices: [...sortedIndices],
            },
            [arr[j].id, arr[j + 1].id],
            5
          );

          // 执行交换
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }

        // 恢复状态
        arr[j].state = 'default';
        arr[j + 1].state = 'default';
      }

      // 标记已排序
      arr[n - i - 1].state = 'sorted';
      sortedIndices.push(n - i - 1);
      this.addSnapshot(
        `第 ${i + 1} 轮结束，arr[${n - i - 1}]=${arr[n - i - 1].value} 已排序`,
        {
          array: arr.map(el => ({ ...el })),
          sortedIndices: [...sortedIndices],
        },
        [arr[n - i - 1].id],
        3
      );
    }

    // 标记第一个元素为已排序
    arr[0].state = 'sorted';
    sortedIndices.push(0);
    this.addSnapshot(
      '排序完成！',
      {
        array: arr.map(el => ({ ...el })),
        sortedIndices: [...sortedIndices],
      },
      arr.map(el => el.id),
      6
    );
  }
}

/**
 * 快速排序执行器
 */
export class QuickSortExecutor extends AlgorithmExecutor<SortSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'quick-sort',
    name: '快速排序',
    category: '排序算法',
    description: '快速排序是分治法的典型应用。选择一个基准元素(pivot)，通过一趟划分(Partition)将序列分为两部分：左边都小于基准，右边都大于基准，然后递归处理子序列。平均性能最优，是实际应用中最常用的排序算法。',
    timeComplexity: 'O(n log n) 平均',
    spaceComplexity: 'O(log n)',
    pseudocode: [
      'function QuickSort(A[], low, high):',
      '    if low < high then',
      '        pivotPos = Partition(A, low, high)',
      '        QuickSort(A, low, pivotPos - 1)  // 递归左半部分',
      '        QuickSort(A, pivotPos + 1, high) // 递归右半部分',
      '',
      'function Partition(A[], low, high):',
      '    pivot = A[low]          // 选取第一个元素为基准',
      '    while low < high do',
      '        // high 指针左移：找比 pivot 小的',
      '        while low < high and A[high] >= pivot do',
      '            high--',
      '        A[low] = A[high]    // 移到左端',
      '        // low 指针右移：找比 pivot 大的',
      '        while low < high and A[low] <= pivot do',
      '            low++',
      '        A[high] = A[low]    // 移到右端',
      '    A[low] = pivot          // 基准归位',
      '    return low              // 返回基准位置',
    ],
  };

  private arr: ArrayElement[] = [];
  private sortedIndices: number[] = [];

  execute(inputArray: number[]): void {
    this.reset();
    this.arr = inputArray.map((value, index) => ({
      id: `element-${index}`,
      value,
      state: 'default' as ArrayElementState,
    }));
    this.sortedIndices = [];

    this.addSnapshot(
      '初始数组',
      { array: this.arr.map(el => ({ ...el })), sortedIndices: [] },
      [],
      0
    );

    this.quickSort(0, this.arr.length - 1);

    // 标记全部完成
    this.arr.forEach(el => (el.state = 'sorted'));
    this.addSnapshot(
      '排序完成！',
      {
        array: this.arr.map(el => ({ ...el })),
        sortedIndices: this.arr.map((_, i) => i),
      },
      this.arr.map(el => el.id),
      0
    );
  }

  private quickSort(low: number, high: number): void {
    if (low < high) {
      this.addSnapshot(
        `分治区间 [${low}, ${high}]`,
        {
          array: this.arr.map(el => ({ ...el })),
          sortedIndices: [...this.sortedIndices],
          leftBound: low,
          rightBound: high,
        },
        [],
        1
      );

      const pivotIndex = this.partition(low, high);
      this.sortedIndices.push(pivotIndex);
      this.arr[pivotIndex].state = 'sorted';

      this.addSnapshot(
        `基准 ${this.arr[pivotIndex].value} 就位于索引 ${pivotIndex}`,
        {
          array: this.arr.map(el => ({ ...el })),
          sortedIndices: [...this.sortedIndices],
          pivotIndex,
        },
        [this.arr[pivotIndex].id],
        2
      );

      this.quickSort(low, pivotIndex - 1);
      this.quickSort(pivotIndex + 1, high);
    } else if (low === high && !this.sortedIndices.includes(low)) {
      this.sortedIndices.push(low);
      this.arr[low].state = 'sorted';
    }
  }

  private partition(low: number, high: number): number {
    const pivot = this.arr[high];
    pivot.state = 'pivot';

    this.addSnapshot(
      `选择 arr[${high}]=${pivot.value} 作为基准`,
      {
        array: this.arr.map(el => ({ ...el })),
        sortedIndices: [...this.sortedIndices],
        pivotIndex: high,
      },
      [pivot.id],
      7
    );

    let i = low - 1;

    for (let j = low; j < high; j++) {
      this.arr[j].state = 'comparing';
      this.addSnapshot(
        `比较 arr[${j}]=${this.arr[j].value} 与基准 ${pivot.value}`,
        {
          array: this.arr.map(el => ({ ...el })),
          sortedIndices: [...this.sortedIndices],
          comparingIndices: [j, high] as [number, number],
          pivotIndex: high,
        },
        [this.arr[j].id, pivot.id],
        10
      );

      if (this.arr[j].value <= pivot.value) {
        i++;
        if (i !== j) {
          this.arr[i].state = 'swapping';
          this.arr[j].state = 'swapping';
          this.addSnapshot(
            `交换 arr[${i}]=${this.arr[i].value} 和 arr[${j}]=${this.arr[j].value}`,
            {
              array: this.arr.map(el => ({ ...el })),
              sortedIndices: [...this.sortedIndices],
              swappingIndices: [i, j] as [number, number],
              pivotIndex: high,
            },
            [this.arr[i].id, this.arr[j].id],
            12
          );
          [this.arr[i], this.arr[j]] = [this.arr[j], this.arr[i]];
        }
      }

      // 恢复状态
      for (let k = low; k <= high; k++) {
        if (k === high) {
          this.arr[k].state = 'pivot';
        } else if (!this.sortedIndices.includes(k)) {
          this.arr[k].state = 'default';
        }
      }
    }

    // 将基准放到正确位置
    if (i + 1 !== high) {
      this.arr[i + 1].state = 'swapping';
      this.arr[high].state = 'swapping';
      this.addSnapshot(
        `将基准 ${pivot.value} 放到索引 ${i + 1}`,
        {
          array: this.arr.map(el => ({ ...el })),
          sortedIndices: [...this.sortedIndices],
          swappingIndices: [i + 1, high] as [number, number],
        },
        [this.arr[i + 1].id, pivot.id],
        13
      );
      [this.arr[i + 1], this.arr[high]] = [this.arr[high], this.arr[i + 1]];
    }

    // 恢复状态
    for (let k = low; k <= high; k++) {
      if (!this.sortedIndices.includes(k)) {
        this.arr[k].state = 'default';
      }
    }

    return i + 1;
  }
}

/**
 * 选择排序执行器
 */
export class SelectionSortExecutor extends AlgorithmExecutor<SortSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'selection-sort',
    name: '选择排序',
    category: '排序算法',
    description: '选择排序是一种简单直观的排序算法。每一趟从待排序的数据元素中选出最小（或最大）的一个元素，放到已排序序列的末尾，直到全部元素排序完毕。算法不稳定，但交换次数少。',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function SelectionSort(A[], n):',
      '    for i = 1 to n-1 do',
      '        minIndex = i       // 假设当前位置最小',
      '        // 在 [i+1, n] 中查找更小的元素',
      '        for j = i+1 to n do',
      '            if A[j] < A[minIndex] then',
      '                minIndex = j',
      '        // 将最小元素交换到位置 i',
      '        if minIndex != i then',
      '            swap(A[i], A[minIndex])',
      '    return A',
    ],
  };

  execute(inputArray: number[]): void {
    this.reset();
    const arr = inputArray.map((value, index) => ({
      id: `element-${index}`,
      value,
      state: 'default' as ArrayElementState,
    }));
    const sortedIndices: number[] = [];

    this.addSnapshot(
      '初始数组',
      { array: [...arr], sortedIndices: [] },
      [],
      0
    );

    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      arr[i].state = 'selected';
      
      this.addSnapshot(
        `从索引 ${i} 开始查找最小元素`,
        {
          array: arr.map(el => ({ ...el })),
          sortedIndices: [...sortedIndices],
        },
        [arr[i].id],
        3
      );

      for (let j = i + 1; j < n; j++) {
        arr[j].state = 'comparing';
        this.addSnapshot(
          `比较 arr[${j}]=${arr[j].value} 与当前最小值 arr[${minIndex}]=${arr[minIndex].value}`,
          {
            array: arr.map(el => ({ ...el })),
            comparingIndices: [j, minIndex] as [number, number],
            sortedIndices: [...sortedIndices],
          },
          [arr[j].id, arr[minIndex].id],
          5
        );

        if (arr[j].value < arr[minIndex].value) {
          if (minIndex !== i) arr[minIndex].state = 'default';
          minIndex = j;
          arr[minIndex].state = 'selected';
          
          this.addSnapshot(
            `更新最小值索引为 ${minIndex}，值为 ${arr[minIndex].value}`,
            {
              array: arr.map(el => ({ ...el })),
              sortedIndices: [...sortedIndices],
            },
            [arr[minIndex].id],
            6
          );
        } else {
          arr[j].state = 'default';
        }
      }

      if (minIndex !== i) {
        arr[i].state = 'swapping';
        arr[minIndex].state = 'swapping';
        this.addSnapshot(
          `交换 arr[${i}]=${arr[i].value} 和 arr[${minIndex}]=${arr[minIndex].value}`,
          {
            array: arr.map(el => ({ ...el })),
            swappingIndices: [i, minIndex] as [number, number],
            sortedIndices: [...sortedIndices],
          },
          [arr[i].id, arr[minIndex].id],
          7
        );
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      }

      arr[i].state = 'sorted';
      if (minIndex !== i) arr[minIndex].state = 'default';
      sortedIndices.push(i);

      this.addSnapshot(
        `第 ${i + 1} 轮结束，arr[${i}]=${arr[i].value} 已排序`,
        {
          array: arr.map(el => ({ ...el })),
          sortedIndices: [...sortedIndices],
        },
        [arr[i].id],
        3
      );
    }

    arr[n - 1].state = 'sorted';
    sortedIndices.push(n - 1);
    this.addSnapshot(
      '排序完成！',
      {
        array: arr.map(el => ({ ...el })),
        sortedIndices: [...sortedIndices],
      },
      arr.map(el => el.id),
      8
    );
  }
}

/**
 * 插入排序执行器
 */
export class InsertionSortExecutor extends AlgorithmExecutor<SortSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'insertion-sort',
    name: '插入排序',
    category: '排序算法',
    description: '插入排序是一种简单直观的排序算法。它将数组分为"有序区"和"无序区"，每次从无序区取出第一个元素，在有序区中从后向前扫描，找到合适位置插入。算法稳定，对基本有序的数据效率很高。',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function InsertionSort(A[], n):',
      '    // A[0] 作为哨兵，实际数据从 A[1] 开始',
      '    for i = 2 to n do',
      '        if A[i] < A[i-1] then   // 需要插入',
      '            A[0] = A[i]         // 设置哨兵',
      '            A[i] = A[i-1]       // 后移一位',
      '            // 从后向前查找插入位置',
      '            j = i - 2',
      '            while A[0] < A[j] do',
      '                A[j+1] = A[j]   // 元素后移',
      '                j = j - 1',
      '            A[j+1] = A[0]       // 插入到正确位置',
      '    return A',
    ],
  };

  execute(inputArray: number[]): void {
    this.reset();
    const arr = inputArray.map((value, index) => ({
      id: `element-${index}`,
      value,
      state: 'default' as ArrayElementState,
    }));
    const sortedIndices: number[] = [0];
    arr[0].state = 'sorted';

    this.addSnapshot(
      '初始数组，第一个元素视为已排序',
      { array: [...arr], sortedIndices: [0] },
      [arr[0].id],
      0
    );

    const n = arr.length;
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      key.state = 'selected';
      
      this.addSnapshot(
        `取出 arr[${i}]=${key.value} 准备插入`,
        {
          array: arr.map(el => ({ ...el })),
          sortedIndices: [...sortedIndices],
        },
        [key.id],
        2
      );

      let j = i - 1;
      while (j >= 0 && arr[j].value > key.value) {
        arr[j].state = 'comparing';
        this.addSnapshot(
          `比较 arr[${j}]=${arr[j].value} > ${key.value}，向右移动`,
          {
            array: arr.map(el => ({ ...el })),
            comparingIndices: [j, i] as [number, number],
            sortedIndices: [...sortedIndices],
          },
          [arr[j].id, key.id],
          4
        );

        arr[j + 1] = arr[j];
        arr[j].state = 'sorted';
        j--;
      }

      arr[j + 1] = key;
      key.state = 'sorted';
      sortedIndices.push(i);

      this.addSnapshot(
        `将 ${key.value} 插入到索引 ${j + 1}`,
        {
          array: arr.map(el => ({ ...el })),
          sortedIndices: [...sortedIndices],
        },
        [key.id],
        7
      );
    }

    this.addSnapshot(
      '排序完成！',
      {
        array: arr.map(el => ({ ...el })),
        sortedIndices: arr.map((_, i) => i),
      },
      arr.map(el => el.id),
      8
    );
  }
}

/**
 * 归并排序执行器
 */
export class MergeSortExecutor extends AlgorithmExecutor<SortSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'merge-sort',
    name: '归并排序',
    category: '排序算法',
    description: '归并排序是基于分治法的排序算法。将序列递归地分成两半，分别排序后再合并为有序序列。时间复杂度稳定为 O(n log n)，是稳定排序，但需要 O(n) 的辅助空间。',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function MergeSort(A[], low, high):',
      '    if low < high then',
      '        mid = (low + high) / 2',
      '        MergeSort(A, low, mid)      // 递归排序左半部分',
      '        MergeSort(A, mid+1, high)   // 递归排序右半部分',
      '        Merge(A, low, mid, high)    // 合并两个有序序列',
      '',
      'function Merge(A[], low, mid, high):',
      '    // 将 A[low..mid] 和 A[mid+1..high] 合并到 Temp',
      '    i = low, j = mid + 1, k = low',
      '    while i <= mid and j <= high do',
      '        if A[i] <= A[j] then',
      '            Temp[k++] = A[i++]',
      '        else',
      '            Temp[k++] = A[j++]',
      '    // 将剩余部分复制',
      '    while i <= mid do Temp[k++] = A[i++]',
      '    while j <= high do Temp[k++] = A[j++]',
      '    // 拷回原数组',
      '    copy Temp[low..high] to A[low..high]',
    ],
  };

  private arr: ArrayElement[] = [];
  private sortedIndices: number[] = [];

  execute(inputArray: number[]): void {
    this.reset();
    this.arr = inputArray.map((value, index) => ({
      id: `element-${index}`,
      value,
      state: 'default' as ArrayElementState,
    }));
    this.sortedIndices = [];

    this.addSnapshot(
      '初始数组',
      { array: this.arr.map(el => ({ ...el })), sortedIndices: [] },
      [],
      0
    );

    this.mergeSort(0, this.arr.length - 1);

    // 标记所有元素为已排序
    this.arr.forEach(el => el.state = 'sorted');
    this.addSnapshot(
      '排序完成！',
      {
        array: this.arr.map(el => ({ ...el })),
        sortedIndices: this.arr.map((_, i) => i),
      },
      this.arr.map(el => el.id),
      0
    );
  }

  private mergeSort(left: number, right: number): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      this.addSnapshot(
        `分割: [${left}...${mid}] 和 [${mid + 1}...${right}]`,
        {
          array: this.arr.map(el => ({ ...el })),
          comparingIndices: [left, right] as [number, number],
          pivotIndex: mid,
          sortedIndices: [...this.sortedIndices],
        },
        [],
        2
      );

      this.mergeSort(left, mid);
      this.mergeSort(mid + 1, right);
      this.merge(left, mid, right);
    }
  }

  private merge(left: number, mid: number, right: number): void {
    const leftArr = this.arr.slice(left, mid + 1).map(el => ({ ...el }));
    const rightArr = this.arr.slice(mid + 1, right + 1).map(el => ({ ...el }));

    this.addSnapshot(
      `合并: [${left}...${mid}] 和 [${mid + 1}...${right}]`,
      {
        array: this.arr.map(el => ({ ...el })),
        comparingIndices: [left, right] as [number, number],
        sortedIndices: [...this.sortedIndices],
      },
      [],
      7
    );

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      // 高亮比较的元素
      this.arr[k].state = 'comparing';
      
      if (leftArr[i].value <= rightArr[j].value) {
        this.arr[k] = { ...leftArr[i], state: 'sorted' };
        this.addSnapshot(
          `比较: ${leftArr[i].value} <= ${rightArr[j].value}，放入 ${leftArr[i].value}`,
          {
            array: this.arr.map(el => ({ ...el })),
            comparingIndices: [k, k] as [number, number],
            sortedIndices: [...this.sortedIndices],
          },
          [this.arr[k].id],
          11
        );
        i++;
      } else {
        this.arr[k] = { ...rightArr[j], state: 'sorted' };
        this.addSnapshot(
          `比较: ${leftArr[i].value} > ${rightArr[j].value}，放入 ${rightArr[j].value}`,
          {
            array: this.arr.map(el => ({ ...el })),
            comparingIndices: [k, k] as [number, number],
            sortedIndices: [...this.sortedIndices],
          },
          [this.arr[k].id],
          13
        );
        j++;
      }
      k++;
    }

    // 复制剩余的左边元素
    while (i < leftArr.length) {
      this.arr[k] = { ...leftArr[i], state: 'sorted' };
      i++;
      k++;
    }

    // 复制剩余的右边元素
    while (j < rightArr.length) {
      this.arr[k] = { ...rightArr[j], state: 'sorted' };
      j++;
      k++;
    }

    this.addSnapshot(
      `合并完成: [${left}...${right}]`,
      {
        array: this.arr.map(el => ({ ...el })),
        sortedIndices: [...this.sortedIndices],
      },
      [],
      16
    );
  }
}

/**
 * 堆排序执行器
 */
export class HeapSortExecutor extends AlgorithmExecutor<SortSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'heap-sort',
    name: '堆排序',
    category: '排序算法',
    description: '堆排序是一种利用堆(完全二叉树)进行排序的算法。首先将数组建成大顶堆，然后将堆顶元素与末尾交换，再对剩余元素调整堆结构。时间复杂度稳定为 O(n log n)，原地排序，但不稳定。',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function HeapSort(A[], n):',
      '    // 1. 初建大顶堆（从最后一个非叶结点开始）',
      '    for i = n/2 downto 1 do',
      '        HeapAdjust(A, i, n)',
      '    // 2. 排序输出',
      '    for i = n downto 2 do',
      '        swap(A[1], A[i])     // 堆顶与末尾交换',
      '        HeapAdjust(A, 1, i-1) // 调整剩余元素为堆',
      '',
      'function HeapAdjust(A[], start, end):',
      '    // 向下调整（筛选），使以 start 为根的子树成为大顶堆',
      '    temp = A[start]',
      '    for j = 2*start; j <= end; j = j*2 do',
      '        // 让 j 指向左右孩子中较大者',
      '        if j < end and A[j] < A[j+1] then',
      '            j = j + 1',
      '        if temp >= A[j] then',
      '            break              // 根已经最大，无需调整',
      '        A[start] = A[j]        // 孩子上移',
      '        start = j              // 继续向下层比较',
      '    A[start] = temp            // 放入最终位置',
    ],
  };

  private arr: ArrayElement[] = [];
  private sortedIndices: number[] = [];

  execute(inputArray: number[]): void {
    this.reset();
    this.arr = inputArray.map((value, index) => ({
      id: `element-${index}`,
      value,
      state: 'default' as ArrayElementState,
    }));
    this.sortedIndices = [];
    const n = this.arr.length;

    this.addSnapshot(
      '初始数组',
      { array: this.arr.map(el => ({ ...el })), sortedIndices: [] },
      [],
      0
    );

    // 建立大顶堆
    this.addSnapshot(
      '开始建立大顶堆',
      { array: this.arr.map(el => ({ ...el })), sortedIndices: [] },
      [],
      3
    );

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapify(n, i);
    }

    this.addSnapshot(
      '大顶堆建立完成',
      { array: this.arr.map(el => ({ ...el })), sortedIndices: [] },
      [],
      4
    );

    // 依次取出堆顶
    for (let i = n - 1; i > 0; i--) {
      // 交换堆顶和末尾
      this.arr[0].state = 'swapping';
      this.arr[i].state = 'swapping';
      this.addSnapshot(
        `交换堆顶 ${this.arr[0].value} 和 arr[${i}]=${this.arr[i].value}`,
        {
          array: this.arr.map(el => ({ ...el })),
          swappingIndices: [0, i] as [number, number],
          sortedIndices: [...this.sortedIndices],
        },
        [this.arr[0].id, this.arr[i].id],
        7
      );

      [this.arr[0], this.arr[i]] = [this.arr[i], this.arr[0]];
      this.arr[i].state = 'sorted';
      this.sortedIndices.push(i);
      this.arr[0].state = 'default';

      this.addSnapshot(
        `arr[${i}]=${this.arr[i].value} 已排序`,
        {
          array: this.arr.map(el => ({ ...el })),
          sortedIndices: [...this.sortedIndices],
        },
        [this.arr[i].id],
        8
      );

      // 重新调整堆
      this.heapify(i, 0);
    }

    // 标记第一个元素为已排序
    this.arr[0].state = 'sorted';
    this.sortedIndices.push(0);

    this.addSnapshot(
      '排序完成！',
      {
        array: this.arr.map(el => ({ ...el })),
        sortedIndices: this.arr.map((_, i) => i),
      },
      this.arr.map(el => el.id),
      0
    );
  }

  private heapify(n: number, i: number): void {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    // 比较左子节点
    if (left < n) {
      this.arr[i].state = 'comparing';
      this.arr[left].state = 'comparing';
      
      if (this.arr[left].value > this.arr[largest].value) {
        largest = left;
      }
    }

    // 比较右子节点
    if (right < n) {
      this.arr[right].state = 'comparing';
      
      if (this.arr[right].value > this.arr[largest].value) {
        largest = right;
      }
    }

    // 如果最大值不是根节点，交换并继续调整
    if (largest !== i) {
      this.addSnapshot(
        `调整堆: 比较 arr[${i}]=${this.arr[i].value}，最大值在索引 ${largest}`,
        {
          array: this.arr.map(el => ({ ...el })),
          comparingIndices: [i, largest] as [number, number],
          sortedIndices: [...this.sortedIndices],
        },
        [this.arr[i].id, this.arr[largest].id],
        14
      );

      [this.arr[i], this.arr[largest]] = [this.arr[largest], this.arr[i]];
      
      // 重置状态
      this.arr.forEach((el, idx) => {
        if (!this.sortedIndices.includes(idx)) {
          el.state = 'default';
        }
      });

      this.heapify(n, largest);
    } else {
      // 重置状态
      this.arr.forEach((el, idx) => {
        if (!this.sortedIndices.includes(idx)) {
          el.state = 'default';
        }
      });
    }
  }
}

/**
 * 希尔排序执行器
 */
export class ShellSortExecutor extends AlgorithmExecutor<SortSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'shell-sort',
    name: '希尔排序',
    category: '排序算法',
    description: '希尔排序是插入排序的改进版本，又称"缩小增量排序"。将序列按增量 d 分组，对每组进行直接插入排序，然后缩小增量重复此过程，直到 d=1。通过让序列"基本有序"，大大提高了插入排序的效率。',
    timeComplexity: 'O(n^1.3) ~ O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function ShellSort(A[], n):',
      '    // 增量 d 逐步减半，直到 1',
      '    for d = n/2; d >= 1; d = d/2 do',
      '        // 对每一组进行直接插入排序',
      '        for i = d+1 to n do',
      '            if A[i] < A[i-d] then',
      '                A[0] = A[i]       // 暂存（哨兵）',
      '                // 在子序列中查找插入位置',
      '                j = i - d',
      '                while j > 0 and A[0] < A[j] do',
      '                    A[j+d] = A[j] // 后移，跨度为 d',
      '                    j = j - d',
      '                A[j+d] = A[0]     // 插入',
      '    return A',
    ],
  };

  execute(inputArray: number[]): void {
    this.reset();
    const arr = inputArray.map((value, index) => ({
      id: `element-${index}`,
      value,
      state: 'default' as ArrayElementState,
    }));
    const n = arr.length;

    this.addSnapshot(
      '初始数组',
      { array: arr.map(el => ({ ...el })), sortedIndices: [] },
      [],
      0
    );

    // 初始间隔
    let gap = Math.floor(n / 2);

    while (gap > 0) {
      this.addSnapshot(
        `当前间隔 gap = ${gap}`,
        {
          array: arr.map(el => ({ ...el })),
          sortedIndices: [],
        },
        [],
        3
      );

      for (let i = gap; i < n; i++) {
        const temp = { ...arr[i] };
        temp.state = 'comparing';
        let j = i;

        this.addSnapshot(
          `选取 arr[${i}]=${arr[i].value}，准备插入`,
          {
            array: arr.map(el => ({ ...el })),
            comparingIndices: [i, i] as [number, number],
            sortedIndices: [],
          },
          [arr[i].id],
          5
        );

        while (j >= gap && arr[j - gap].value > temp.value) {
          arr[j - gap].state = 'comparing';
          arr[j].state = 'swapping';

          this.addSnapshot(
            `比较: arr[${j - gap}]=${arr[j - gap].value} > ${temp.value}，移动`,
            {
              array: arr.map(el => ({ ...el })),
              comparingIndices: [j - gap, j] as [number, number],
              sortedIndices: [],
            },
            [arr[j - gap].id, arr[j].id],
            7
          );

          arr[j] = { ...arr[j - gap] };
          arr[j - gap].state = 'default';
          j -= gap;
        }

        arr[j] = temp;
        arr[j].state = 'default';

        // 重置状态
        arr.forEach(el => el.state = 'default');

        this.addSnapshot(
          `将 ${temp.value} 插入到索引 ${j}`,
          {
            array: arr.map(el => ({ ...el })),
            sortedIndices: [],
          },
          [arr[j].id],
          10
        );
      }

      gap = Math.floor(gap / 2);
    }

    // 标记所有元素为已排序
    arr.forEach(el => el.state = 'sorted');
    this.addSnapshot(
      '排序完成！',
      {
        array: arr.map(el => ({ ...el })),
        sortedIndices: arr.map((_, i) => i),
      },
      arr.map(el => el.id),
      12
    );
  }
}
