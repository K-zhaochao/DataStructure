import { Snapshot, AlgorithmMeta } from '../types';

/**
 * 算法执行器基类
 * 所有算法执行器都应继承此类
 */
export abstract class AlgorithmExecutor<T> {
  protected snapshots: Snapshot<T>[] = [];
  protected currentStep = 0;

  abstract readonly meta: AlgorithmMeta;

  /**
   * 生成唯一ID
   */
  protected generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  /**
   * 添加快照
   */
  protected addSnapshot(
    description: string,
    data: T,
    highlightedElements: string[],
    codeLineIndex: number,
    variables?: Record<string, unknown>
  ): void {
    this.snapshots.push({
      id: this.generateId(),
      step: this.snapshots.length,
      description,
      data: JSON.parse(JSON.stringify(data)), // 深拷贝
      highlightedElements,
      codeLineIndex,
      variables,
    });
  }

  /**
   * 执行算法并生成快照
   */
  abstract execute(...args: unknown[]): void;

  /**
   * 获取所有快照
   */
  getSnapshots(): Snapshot<T>[] {
    return this.snapshots;
  }

  /**
   * 获取当前快照
   */
  getCurrentSnapshot(): Snapshot<T> | null {
    return this.snapshots[this.currentStep] || null;
  }

  /**
   * 获取快照总数
   */
  getTotalSteps(): number {
    return this.snapshots.length;
  }

  /**
   * 重置执行器
   */
  reset(): void {
    this.snapshots = [];
    this.currentStep = 0;
  }

  /**
   * 前进一步
   */
  nextStep(): Snapshot<T> | null {
    if (this.currentStep < this.snapshots.length - 1) {
      this.currentStep++;
      return this.getCurrentSnapshot();
    }
    return null;
  }

  /**
   * 后退一步
   */
  prevStep(): Snapshot<T> | null {
    if (this.currentStep > 0) {
      this.currentStep--;
      return this.getCurrentSnapshot();
    }
    return null;
  }

  /**
   * 跳转到指定步骤
   */
  goToStep(step: number): Snapshot<T> | null {
    if (step >= 0 && step < this.snapshots.length) {
      this.currentStep = step;
      return this.getCurrentSnapshot();
    }
    return null;
  }
}
