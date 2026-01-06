import { motion } from 'framer-motion';
import { ArrayElement } from '../types';

interface ArrayVisualizerProps {
  data: ArrayElement[];
  maxValue?: number;
  comparingIndices?: [number, number];
  swappingIndices?: [number, number];
  sortedIndices?: number[];
  pivotIndex?: number;
}

export default function ArrayVisualizer({
  data,
  maxValue,
  comparingIndices,
  swappingIndices,
  sortedIndices = [],
  pivotIndex,
}: ArrayVisualizerProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.max(20, Math.min(60, 800 / data.length - 4));

  const getBarColor = (index: number, state: string) => {
    if (swappingIndices?.includes(index)) {
      return 'from-red-500 to-red-600';
    }
    if (comparingIndices?.includes(index)) {
      return 'from-amber-400 to-amber-500';
    }
    if (index === pivotIndex) {
      return 'from-purple-500 to-purple-600';
    }
    if (state === 'sorted' || sortedIndices.includes(index)) {
      return 'from-green-500 to-green-600';
    }
    if (state === 'selected') {
      return 'from-cyan-400 to-cyan-500';
    }
    return 'from-blue-500 to-blue-600';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h3 className="text-sm font-medium text-slate-400 mb-4">数组可视化</h3>
      
      {/* 柱状图 */}
      <div 
        className="flex items-end justify-center gap-1 h-64 p-4"
        style={{ minWidth: data.length * (barWidth + 4) }}
      >
        {data.map((item, index) => {
          const height = (item.value / max) * 200;
          const isSwapping = swappingIndices?.includes(index);
          const isComparing = comparingIndices?.includes(index);

          return (
            <motion.div
              key={item.id}
              className="flex flex-col items-center"
              layout
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              <motion.div
                className={`rounded-t-md bg-gradient-to-b ${getBarColor(index, item.state)} relative`}
                style={{ width: barWidth }}
                initial={false}
                animate={{
                  height,
                  scale: isSwapping ? 1.1 : isComparing ? 1.05 : 1,
                }}
                transition={{
                  height: { duration: 0.3 },
                  scale: { duration: 0.2 },
                }}
              >
                {/* 数值标签 */}
                <motion.span
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {item.value}
                </motion.span>

                {/* 高亮效果 */}
                {(isSwapping || isComparing) && (
                  <motion.div
                    className={`absolute inset-0 rounded-t-md ${
                      isSwapping ? 'bg-red-400' : 'bg-amber-400'
                    }`}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 0.2, 0.5] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* 索引标签 */}
              <span className="text-xs text-slate-500 mt-2 font-mono">{index}</span>
            </motion.div>
          );
        })}
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-b from-blue-500 to-blue-600" />
          <span className="text-slate-400">未排序</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-b from-amber-400 to-amber-500" />
          <span className="text-slate-400">比较中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-b from-red-500 to-red-600" />
          <span className="text-slate-400">交换中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-b from-purple-500 to-purple-600" />
          <span className="text-slate-400">基准</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-b from-green-500 to-green-600" />
          <span className="text-slate-400">已排序</span>
        </div>
      </div>
    </div>
  );
}
