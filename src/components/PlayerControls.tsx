import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Snapshot, AnimationState } from '../types';

interface PlayerControlsProps<T> {
  snapshots: Snapshot<T>[];
  currentStep: number;
  onStepChange: (step: number | ((prev: number) => number)) => void;
  onReset: () => void;
}

export default function PlayerControls<T>({
  snapshots,
  currentStep,
  onStepChange,
  onReset,
}: PlayerControlsProps<T>) {
  const [state, setState] = useState<AnimationState>('idle');
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSteps = snapshots.length;
  const currentSnapshot = snapshots[currentStep];

  const clearPlayInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      onStepChange(0);
    }
    setState('playing');
  }, [currentStep, totalSteps, onStepChange]);

  const pause = useCallback(() => {
    setState('paused');
    clearPlayInterval();
  }, [clearPlayInterval]);

  const togglePlay = useCallback(() => {
    if (state === 'playing') {
      pause();
    } else {
      play();
    }
  }, [state, play, pause]);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      onStepChange(currentStep + 1);
    } else {
      setState('finished');
    }
  }, [currentStep, totalSteps, onStepChange]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  }, [currentStep, onStepChange]);

  const reset = useCallback(() => {
    clearPlayInterval();
    setState('idle');
    onReset();
  }, [clearPlayInterval, onReset]);

  // 自动播放
  useEffect(() => {
    if (state === 'playing') {
      intervalRef.current = setInterval(() => {
        onStepChange((prev: number) => {
          if (prev >= totalSteps - 1) {
            clearPlayInterval();
            setState('finished');
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }

    return clearPlayInterval;
  }, [state, speed, totalSteps, onStepChange, clearPlayInterval]);

  // 进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newStep = Math.floor(percentage * totalSteps);
    onStepChange(Math.min(Math.max(newStep, 0), totalSteps - 1));
  };

  if (totalSteps === 0) {
    return null;
  }

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="glass rounded-2xl p-5 border border-slate-700/50">
      {/* 当前步骤描述 */}
      <div className="mb-5">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-mono font-medium">
            {currentStep + 1} / {totalSteps}
          </span>
          <p className="text-slate-300 text-sm">
            {currentSnapshot?.description || '等待开始...'}
          </p>
        </motion.div>
      </div>

      {/* 进度条 */}
      <div
        className="relative h-2 bg-slate-700/50 rounded-full cursor-pointer mb-5 overflow-hidden group"
        onClick={handleProgressClick}
      >
        <motion.div
          className="absolute inset-y-0 left-0 progress-bar rounded-full"
          initial={false}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
        {/* 进度指示器 */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progressPercentage}% - 8px)` }}
        />
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-1.5">
          <motion.button
            onClick={reset}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all"
            title="重置"
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={20} />
          </motion.button>
          <motion.button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="上一步"
            whileTap={{ scale: 0.95 }}
          >
            <SkipBack size={20} />
          </motion.button>
          <motion.button
            onClick={togglePlay}
            className={`p-3.5 text-white rounded-xl transition-all shadow-lg ${
              state === 'playing'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-500/30'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-blue-500/30'
            }`}
            title={state === 'playing' ? '暂停' : '播放'}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            {state === 'playing' ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </motion.button>
          <motion.button
            onClick={nextStep}
            disabled={currentStep >= totalSteps - 1}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="下一步"
            whileTap={{ scale: 0.95 }}
          >
            <SkipForward size={20} />
          </motion.button>
        </div>

        {/* 速度控制 */}
        <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl px-4 py-2">
          <span className="text-xs text-slate-500 uppercase tracking-wider">速度</span>
          <div className="flex items-center gap-2">
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 text-xs rounded-lg transition-all ${
                  speed === s
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
