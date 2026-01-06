import { AlgorithmExecutor } from '../AlgorithmExecutor';
import { AlgorithmMeta } from '../../types';

/**
 * 循环队列元素
 */
interface CircularQueueElement {
  value: number | null;
  state: 'empty' | 'occupied' | 'front' | 'rear' | 'both';
}

/**
 * 循环队列快照
 */
interface CircularQueueSnapshot {
  elements: CircularQueueElement[];
  front: number;
  rear: number;
  size: number;
  capacity: number;
  message: string;
}

/**
 * 循环队列执行器
 */
export class CircularQueueExecutor extends AlgorithmExecutor<CircularQueueSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'circular-queue',
    name: '循环队列',
    category: '栈与队列',
    description: '循环队列将顺序队列首尾相连成环形，解决"假溢出"问题。约定：牺牲一个存储单元区分队空与队满。front 指向队头元素，rear 指向队尾元素的下一位置。',
    timeComplexity: 'O(1) 入队/出队',
    spaceComplexity: 'O(n)',
    pseudocode: [
      '// 循环队列定义（数组实现）',
      'MaxSize = N              // 队列最大容量',
      'front = 0                // 队头指针',
      'rear = 0                 // 队尾指针',
      '',
      '// 队空条件: front = rear',
      '// 队满条件: (rear + 1) mod MaxSize = front',
      '// 队长度: (rear - front + MaxSize) mod MaxSize',
      '',
      'function EnQueue(Q, x):',
      '    if (Q.rear+1) mod MaxSize = Q.front then',
      '        return OVERFLOW       // 队满',
      '    Q.data[Q.rear] = x',
      '    Q.rear = (Q.rear + 1) mod MaxSize',
      '    return OK',
      '',
      'function DeQueue(Q):',
      '    if Q.front = Q.rear then',
      '        return UNDERFLOW      // 队空',
      '    x = Q.data[Q.front]',
      '    Q.front = (Q.front + 1) mod MaxSize',
      '    return x',
    ],
  };

  private capacity: number = 8;
  private queue: (number | null)[] = [];
  private front: number = 0;
  private rear: number = 0;

  /**
   * 演示入队出队操作
   */
  execute(operations: Array<{ type: 'enqueue' | 'dequeue'; value?: number }>): void {
    this.reset();
    this.capacity = 8;
    this.queue = new Array(this.capacity).fill(null);
    this.front = 0;
    this.rear = 0;

    this.addSnapshot(
      `初始化容量为 ${this.capacity} 的循环队列`,
      this.createSnapshot('初始化'),
      [],
      1
    );

    for (const op of operations) {
      if (op.type === 'enqueue' && op.value !== undefined) {
        this.enqueue(op.value);
      } else if (op.type === 'dequeue') {
        this.dequeue();
      }
    }
  }

  private enqueue(value: number): void {
    const isFull = (this.rear + 1) % this.capacity === this.front;

    if (isFull) {
      this.addSnapshot(
        `队列已满！无法入队 ${value}`,
        this.createSnapshot('队列已满'),
        [],
        11
      );
      return;
    }

    this.addSnapshot(
      `入队 ${value}，rear = ${this.rear}`,
      this.createSnapshot(`准备入队 ${value}`),
      [],
      10
    );

    this.queue[this.rear] = value;
    
    this.addSnapshot(
      `在位置 ${this.rear} 放入 ${value}`,
      this.createSnapshot(`queue[${this.rear}] = ${value}`),
      [],
      12
    );

    this.rear = (this.rear + 1) % this.capacity;

    this.addSnapshot(
      `更新 rear = (${this.rear === 0 ? this.capacity - 1 : this.rear - 1} + 1) % ${this.capacity} = ${this.rear}`,
      this.createSnapshot('rear 移动'),
      [],
      13
    );
  }

  private dequeue(): void {
    const isEmpty = this.front === this.rear;

    if (isEmpty) {
      this.addSnapshot(
        `队列为空！无法出队`,
        this.createSnapshot('队列为空'),
        [],
        17
      );
      return;
    }

    const value = this.queue[this.front];

    this.addSnapshot(
      `出队元素: ${value}，front = ${this.front}`,
      this.createSnapshot(`出队 ${value}`),
      [],
      18
    );

    this.queue[this.front] = null;
    this.front = (this.front + 1) % this.capacity;

    this.addSnapshot(
      `更新 front = ${this.front}`,
      this.createSnapshot('front 移动'),
      [],
      19
    );
  }

  private createSnapshot(message: string): CircularQueueSnapshot {
    const elements: CircularQueueElement[] = this.queue.map((value, index) => {
      let state: CircularQueueElement['state'] = value !== null ? 'occupied' : 'empty';
      if (index === this.front && index === this.rear) {
        state = 'both';
      } else if (index === this.front) {
        state = 'front';
      } else if (index === this.rear) {
        state = 'rear';
      }
      return { value, state };
    });

    const size = (this.rear - this.front + this.capacity) % this.capacity;

    return {
      elements,
      front: this.front,
      rear: this.rear,
      size,
      capacity: this.capacity,
      message,
    };
  }
}

/**
 * 表达式求值快照
 */
interface ExpressionEvalSnapshot {
  expression: string;
  currentIndex: number;
  operandStack: number[];
  operatorStack: string[];
  currentToken?: string;
  result?: number;
  message: string;
  step: string;
}

/**
 * 表达式求值执行器 (中缀表达式计算)
 */
export class ExpressionEvaluatorExecutor extends AlgorithmExecutor<ExpressionEvalSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'expression-evaluator',
    name: '表达式求值',
    category: '栈与队列',
    description: '中缀表达式求值使用两个栈：操作数栈(OPND)和运算符栈(OPTR)。遇到操作数入 OPND 栈；遇到运算符，与 OPTR 栈顶比较优先级，决定入栈或运算。括号影响优先级判断。',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function EvaluateExpression(exp):',
      '    OPTR.push("#")           // 运算符栈，# 为结束符',
      '    OPND = ∅                  // 操作数栈',
      '    while 未读完表达式 do',
      '        读取下一字符 ch',
      '        if ch 是操作数 then',
      '            OPND.push(ch)',
      '        else                  // ch 是运算符',
      '            switch Compare(OPTR.top, ch)',
      '                case "<":     // 栈顶优先级低',
      '                    OPTR.push(ch)',
      '                case "=":     // 脱括号或结束',
      '                    OPTR.pop()',
      '                case ">":     // 栈顶优先级高，计算',
      '                    op = OPTR.pop()',
      '                    b = OPND.pop()',
      '                    a = OPND.pop()',
      '                    OPND.push(Operate(a, op, b))',
      '    return OPND.top()         // 返回最终结果',
    ],
  };

  private operandStack: number[] = [];
  private operatorStack: string[] = [];
  private expression: string = '';
  private currentIndex: number = 0;

  execute(expression: string): void {
    this.reset();
    this.operandStack = [];
    this.operatorStack = [];
    this.expression = expression.replace(/\s/g, '');
    this.currentIndex = 0;

    this.addSnapshot(
      `计算表达式: ${expression}`,
      this.createSnapshot('开始计算'),
      [],
      0
    );

    while (this.currentIndex < this.expression.length) {
      const char = this.expression[this.currentIndex];

      if (this.isDigit(char)) {
        let num = '';
        while (this.currentIndex < this.expression.length && 
               this.isDigit(this.expression[this.currentIndex])) {
          num += this.expression[this.currentIndex];
          this.currentIndex++;
        }
        const value = parseInt(num);
        this.operandStack.push(value);

        this.addSnapshot(
          `读取数字 ${value}，入操作数栈`,
          this.createSnapshot('入操作数栈', num),
          [],
          5
        );
      } else if (char === '(') {
        this.operatorStack.push(char);
        this.currentIndex++;

        this.addSnapshot(
          `遇到 '('，入运算符栈`,
          this.createSnapshot('入运算符栈', char),
          [],
          12
        );
      } else if (char === ')') {
        this.addSnapshot(
          `遇到 ')'，计算括号内的表达式`,
          this.createSnapshot('处理右括号', char),
          [],
          14
        );

        while (this.operatorStack.length > 0 && 
               this.operatorStack[this.operatorStack.length - 1] !== '(') {
          this.calculate();
        }
        
        if (this.operatorStack.length > 0) {
          this.operatorStack.pop(); // 弹出 '('
          this.addSnapshot(
            `弹出 '('`,
            this.createSnapshot('弹出左括号'),
            [],
            16
          );
        }
        this.currentIndex++;
      } else if (this.isOperator(char)) {
        this.addSnapshot(
          `遇到运算符 '${char}'`,
          this.createSnapshot('处理运算符', char),
          [],
          7
        );

        while (this.operatorStack.length > 0 &&
               this.operatorStack[this.operatorStack.length - 1] !== '(' &&
               this.priority(this.operatorStack[this.operatorStack.length - 1]) >= this.priority(char)) {
          this.calculate();
        }

        this.operatorStack.push(char);
        this.addSnapshot(
          `'${char}' 入运算符栈`,
          this.createSnapshot('入运算符栈'),
          [],
          10
        );
        this.currentIndex++;
      } else {
        this.currentIndex++;
      }
    }

    this.addSnapshot(
      `处理完表达式，清空运算符栈`,
      this.createSnapshot('清空运算符栈'),
      [],
      17
    );

    while (this.operatorStack.length > 0) {
      this.calculate();
    }

    const result = this.operandStack[0];
    this.addSnapshot(
      `计算结果: ${result}`,
      this.createSnapshot('完成', undefined, result),
      [],
      19
    );
  }

  private calculate(): void {
    if (this.operandStack.length < 2 || this.operatorStack.length < 1) return;

    const b = this.operandStack.pop()!;
    const a = this.operandStack.pop()!;
    const op = this.operatorStack.pop()!;
    
    let result: number;
    switch (op) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = Math.floor(a / b); break;
      default: result = 0;
    }

    this.operandStack.push(result);

    this.addSnapshot(
      `计算: ${a} ${op} ${b} = ${result}`,
      this.createSnapshot(`${a} ${op} ${b} = ${result}`),
      [],
      9
    );
  }

  private isDigit(char: string): boolean {
    return /\d/.test(char);
  }

  private isOperator(char: string): boolean {
    return ['+', '-', '*', '/'].includes(char);
  }

  private priority(op: string): number {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    return 0;
  }

  private createSnapshot(message: string, token?: string, result?: number): ExpressionEvalSnapshot {
    return {
      expression: this.expression,
      currentIndex: this.currentIndex,
      operandStack: [...this.operandStack],
      operatorStack: [...this.operatorStack],
      currentToken: token,
      result,
      message,
      step: message,
    };
  }
}

/**
 * 括号匹配快照
 */
interface BracketMatchSnapshot {
  expression: string;
  currentIndex: number;
  stack: string[];
  currentChar?: string;
  isMatched?: boolean;
  message: string;
  matchedPairs: Array<[number, number]>;
}

/**
 * 括号匹配执行器
 */
export class BracketMatchExecutor extends AlgorithmExecutor<BracketMatchSnapshot> {
  readonly meta: AlgorithmMeta = {
    id: 'bracket-match',
    name: '括号匹配',
    category: '栈与队列',
    description: '括号匹配是栈的典型应用。遇到左括号入栈，遇到右括号检查栈顶是否匹配。最后栈空则全部匹配。支持 ()、[]、{} 三种括号的嵌套检查。',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function BracketCheck(str):',
      '    S = InitStack()           // 初始化空栈',
      '    for i = 0 to len(str) - 1 do',
      '        ch = str[i]',
      '        if ch in "([{" then',
      '            S.push(ch)        // 左括号入栈',
      '        else if ch in ")]}" then',
      '            if S.isEmpty() then',
      '                return FALSE  // 右括号多余',
      '            top = S.pop()',
      '            if not Match(top, ch) then',
      '                return FALSE  // 左右不匹配',
      '    if S.isEmpty() then',
      '        return TRUE           // 完全匹配',
      '    else',
      '        return FALSE          // 左括号多余',
    ],
  };

  private stack: Array<{ char: string; index: number }> = [];
  private matchedPairs: Array<[number, number]> = [];

  execute(expression: string): void {
    this.reset();
    this.stack = [];
    this.matchedPairs = [];

    this.addSnapshot(
      `检查括号匹配: "${expression}"`,
      this.createSnapshot(expression, -1, '开始检查'),
      [],
      0
    );

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      if ('([{'.includes(char)) {
        this.stack.push({ char, index: i });

        this.addSnapshot(
          `遇到左括号 '${char}'，入栈`,
          this.createSnapshot(expression, i, '入栈', char),
          [],
          4
        );
      } else if (')]}'.includes(char)) {
        this.addSnapshot(
          `遇到右括号 '${char}'`,
          this.createSnapshot(expression, i, '检查匹配', char),
          [],
          5
        );

        if (this.stack.length === 0) {
          this.addSnapshot(
            `栈为空，无法匹配 '${char}'，匹配失败！`,
            this.createSnapshot(expression, i, '匹配失败', char, false),
            [],
            7
          );
          return;
        }

        const top = this.stack.pop()!;
        if (!this.isMatch(top.char, char)) {
          this.addSnapshot(
            `'${top.char}' 与 '${char}' 不匹配，匹配失败！`,
            this.createSnapshot(expression, i, '匹配失败', char, false),
            [],
            10
          );
          return;
        }

        this.matchedPairs.push([top.index, i]);
        this.addSnapshot(
          `'${top.char}' 与 '${char}' 匹配成功`,
          this.createSnapshot(expression, i, '匹配成功'),
          [],
          9
        );
      }
    }

    const isValid = this.stack.length === 0;
    this.addSnapshot(
      isValid ? `所有括号匹配成功！` : `栈不为空，有未匹配的左括号，匹配失败！`,
      this.createSnapshot(expression, expression.length, isValid ? '完全匹配' : '匹配失败', undefined, isValid),
      [],
      11
    );
  }

  private isMatch(left: string, right: string): boolean {
    return (left === '(' && right === ')') ||
           (left === '[' && right === ']') ||
           (left === '{' && right === '}');
  }

  private createSnapshot(
    expression: string,
    index: number,
    message: string,
    currentChar?: string,
    isMatched?: boolean
  ): BracketMatchSnapshot {
    return {
      expression,
      currentIndex: index,
      stack: this.stack.map(item => item.char),
      currentChar,
      isMatched,
      message,
      matchedPairs: [...this.matchedPairs],
    };
  }
}
