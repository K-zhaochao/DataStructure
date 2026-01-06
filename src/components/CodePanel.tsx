import { motion } from 'framer-motion';
import { AlgorithmMeta } from '../types';
import { Code2, Clock, HardDrive } from 'lucide-react';

interface CodePanelProps {
  meta: AlgorithmMeta;
  currentLineIndex: number;
}

export default function CodePanel({ meta, currentLineIndex }: CodePanelProps) {
  return (
    <div className="glass rounded-2xl border border-slate-700/50 overflow-hidden h-full flex flex-col">
      {/* 头部 */}
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-white">{meta.name}</h3>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-green-400" />
            <span className="text-slate-400">时间:</span>
            <span className="text-green-400 font-mono font-medium">{meta.timeComplexity}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-lg">
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">空间:</span>
            <span className="text-blue-400 font-mono font-medium">{meta.spaceComplexity}</span>
          </div>
        </div>
      </div>

      {/* 伪代码 */}
      <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar">
        <div className="space-y-0.5">
          {meta.pseudocode.map((line, index) => (
            <motion.div
              key={index}
              className={`py-1.5 px-3 rounded-lg transition-all duration-200 ${
                index === currentLineIndex
                  ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/20 border-l-3 border-blue-400 shadow-lg shadow-blue-500/10'
                  : 'hover:bg-slate-700/30 border-l-3 border-transparent'
              }`}
              initial={false}
              animate={{
                scale: index === currentLineIndex ? 1.01 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-slate-600 select-none w-8 inline-block text-right mr-3">
                {index + 1}
              </span>
              <span className={index === currentLineIndex ? 'text-blue-200' : 'text-slate-400'}>
                {line || '\u00A0'}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 描述 */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <p className="text-sm text-slate-400 leading-relaxed">{meta.description}</p>
      </div>
    </div>
  );
}
