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
    description: '冒泡排序是一种简单的排序算法，它重复地遍历待排序的数列，一次比较两个元素，如果顺序错误就交换它们。',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function bubbleSort(arr):',
      '    n = arr.length',
      '    for i from 0 to n-1:',
      '        for j from 0 to n-i-1:',
      '            if arr[j] > arr[j+1]:',
      '                swap(arr[j], arr[j+1])',
      '    return arr',
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
    description: '快速排序使用分治法策略，通过选择一个基准元素，将数组分为两部分，左边小于基准，右边大于基准。',
    timeComplexity: 'O(n log n) 平均',
    spaceComplexity: 'O(log n)',
    pseudocode: [
      'function quickSort(arr, low, high):',
      '    if low < high:',
      '        pivot = partition(arr, low, high)',
      '        quickSort(arr, low, pivot - 1)',
      '        quickSort(arr, pivot + 1, high)',
      '',
      'function partition(arr, low, high):',
      '    pivot = arr[high]',
      '    i = low - 1',
      '    for j from low to high-1:',
      '        if arr[j] <= pivot:',
      '            i++',
      '            swap(arr[i], arr[j])',
      '    swap(arr[i+1], arr[high])',
      '    return i + 1',
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
    description: '选择排序每次从未排序部分选择最小元素，放到已排序部分的末尾。',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function selectionSort(arr):',
      '    n = arr.length',
      '    for i from 0 to n-1:',
      '        minIndex = i',
      '        for j from i+1 to n:',
      '            if arr[j] < arr[minIndex]:',
      '                minIndex = j',
      '        swap(arr[i], arr[minIndex])',
      '    return arr',
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
    description: '插入排序将数组分为已排序和未排序两部分，每次将未排序的第一个元素插入到已排序部分的正确位置。',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function insertionSort(arr):',
      '    for i from 1 to n-1:',
      '        key = arr[i]',
      '        j = i - 1',
      '        while j >= 0 and arr[j] > key:',
      '            arr[j+1] = arr[j]',
      '            j = j - 1',
      '        arr[j+1] = key',
      '    return arr',
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
    description: '归并排序是一种分治算法，将数组分成两半，分别排序后合并。时间复杂度稳定为O(n log n)。',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function mergeSort(arr, left, right):',
      '    if left < right:',
      '        mid = (left + right) / 2',
      '        mergeSort(arr, left, mid)',
      '        mergeSort(arr, mid+1, right)',
      '        merge(arr, left, mid, right)',
      '',
      'function merge(arr, left, mid, right):',
      '    创建左右临时数组',
      '    i = 0, j = 0, k = left',
      '    while i < n1 and j < n2:',
      '        if L[i] <= R[j]:',
      '            arr[k] = L[i]; i++',
      '        else:',
      '            arr[k] = R[j]; j++',
      '        k++',
      '    复制剩余元素',
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
    description: '堆排序利用堆这种数据结构进行排序。先建立大顶堆，然后依次将堆顶元素与末尾交换并调整堆。',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function heapSort(arr):',
      '    n = arr.length',
      '    // 建立大顶堆',
      '    for i from n/2-1 downto 0:',
      '        heapify(arr, n, i)',
      '    // 依次取出堆顶',
      '    for i from n-1 downto 1:',
      '        swap(arr[0], arr[i])',
      '        heapify(arr, i, 0)',
      '',
      'function heapify(arr, n, i):',
      '    largest = i',
      '    left = 2*i + 1',
      '    right = 2*i + 2',
      '    if left < n and arr[left] > arr[largest]:',
      '        largest = left',
      '    if right < n and arr[right] > arr[largest]:',
      '        largest = right',
      '    if largest != i:',
      '        swap(arr[i], arr[largest])',
      '        heapify(arr, n, largest)',
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
    description: '希尔排序是插入排序的改进版，通过比较相隔一定间隔的元素，逐步缩小间隔直到为1。',
    timeComplexity: 'O(n log n) ~ O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function shellSort(arr):',
      '    n = arr.length',
      '    gap = n / 2',
      '    while gap > 0:',
      '        for i from gap to n-1:',
      '            temp = arr[i]',
      '            j = i',
      '            while j >= gap and arr[j-gap] > temp:',
      '                arr[j] = arr[j-gap]',
      '                j = j - gap',
      '            arr[j] = temp',
      '        gap = gap / 2',
      '    return arr',
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
