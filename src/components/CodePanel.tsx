import { motion } from 'framer-motion';
import { AlgorithmMeta } from '../types';
import { Code2, Clock, HardDrive, BookOpen } from 'lucide-react';
import { useMemo } from 'react';

interface CodePanelProps {
  meta: AlgorithmMeta;
  currentLineIndex: number;
}

/**
 * 语法高亮处理函数
 * 识别关键字、函数名、数字、字符串、注释等
 */
function highlightSyntax(line: string): JSX.Element[] {
  const elements: JSX.Element[] = [];
  
  // 关键字定义
  const keywords = [
    'function', 'if', 'else', 'while', 'for', 'return', 'do', 'end',
    'then', 'to', 'and', 'or', 'not', 'true', 'false', 'null', 'NULL',
    'new', 'delete', 'break', 'continue', 'switch', 'case', 'default'
  ];
  
  // 内置函数/操作
  const builtins = [
    'swap', 'max', 'min', 'length', 'size', 'push', 'pop', 'enqueue', 'dequeue',
    'isEmpty', 'isFull', 'print', 'output', 'input', 'Visit', 'Create'
  ];

  // 处理缩进（保留前导空格）
  const leadingSpaces = line.match(/^(\s*)/)?.[1] || '';
  const content = line.slice(leadingSpaces.length);
  
  if (leadingSpaces) {
    elements.push(
      <span key="indent" className="whitespace-pre">{leadingSpaces}</span>
    );
  }
  
  if (!content) {
    return elements;
  }
  
  // 分词处理
  const tokens = content.split(/(\s+|[()[\]{},;:.])/);
  
  tokens.forEach((token, idx) => {
    if (!token) return;
    
    let className = 'text-slate-300';
    
    // 检查是否是关键字
    if (keywords.includes(token)) {
      className = 'text-blue-400 font-semibold';
    }
    // 检查是否是内置函数
    else if (builtins.includes(token)) {
      className = 'text-yellow-400';
    }
    // 检查数字
    else if (/^\d+(?:\.\d+)?$/.test(token)) {
      className = 'text-purple-400';
    }
    // 检查变量（小写字母开头）
    else if (/^[a-z][a-zA-Z0-9_]*$/.test(token)) {
      className = 'text-cyan-300';
    }
    // 检查类型/函数名（大写字母开头）
    else if (/^[A-Z][a-zA-Z0-9_]*$/.test(token)) {
      className = 'text-emerald-400';
    }
    // 运算符和符号
    else if (/^[+\-*/%<>=!&|]+$/.test(token)) {
      className = 'text-pink-400';
    }
    // 括号
    else if (/^[()[\]{}]$/.test(token)) {
      className = 'text-slate-400';
    }
    // 空白
    else if (/^\s+$/.test(token)) {
      className = '';
    }
    
    elements.push(
      <span key={idx} className={className}>{token}</span>
    );
  });
  
  return elements;
}

export default function CodePanel({ meta, currentLineIndex }: CodePanelProps) {
  // 预处理伪代码，检测缩进级别
  const processedCode = useMemo(() => {
    return meta.pseudocode.map((line, index) => {
      // 计算缩进级别（每4个空格或每个制表符算一级）
      const indentMatch = line.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1].length : 0;
      const indentLevel = Math.floor(indent / 4);
      
      return {
        line,
        index,
        indentLevel,
        isEmpty: line.trim() === '',
      };
    });
  }, [meta.pseudocode]);

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
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
            <Clock className="w-3.5 h-3.5 text-green-400" />
            <span className="text-slate-400">时间:</span>
            <span className="text-green-400 font-mono font-medium">{meta.timeComplexity}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">空间:</span>
            <span className="text-blue-400 font-mono font-medium">{meta.spaceComplexity}</span>
          </div>
        </div>
      </div>

      {/* 伪代码区域 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900/50">
        <div className="p-4 font-mono text-sm">
          {/* 代码块标题 */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700/50">
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">伪代码 Pseudocode</span>
          </div>
          
          {/* 代码行 */}
          <div className="space-y-0">
            {processedCode.map(({ line, index, isEmpty }) => (
              <motion.div
                key={index}
                className={`flex items-start rounded-md transition-all duration-200 ${
                  index === currentLineIndex
                    ? 'bg-gradient-to-r from-blue-600/25 to-purple-600/15 border-l-[3px] border-blue-400 shadow-lg shadow-blue-500/10'
                    : 'border-l-[3px] border-transparent hover:bg-slate-800/40'
                }`}
                initial={false}
                animate={{
                  backgroundColor: index === currentLineIndex ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                }}
                transition={{ duration: 0.15 }}
              >
                {/* 行号 */}
                <span className={`w-10 text-right pr-3 py-1.5 select-none text-xs font-medium ${
                  index === currentLineIndex ? 'text-blue-400' : 'text-slate-600'
                }`}>
                  {index + 1}
                </span>
                
                {/* 代码内容 */}
                <code className={`flex-1 py-1.5 pr-3 whitespace-pre ${
                  index === currentLineIndex ? 'text-white' : ''
                }`}>
                  {isEmpty ? (
                    <span className="text-transparent">&nbsp;</span>
                  ) : (
                    highlightSyntax(line)
                  )}
                </code>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 算法描述 */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/40">
        <div className="flex items-start gap-2">
          <div className="w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full flex-shrink-0" />
          <p className="text-sm text-slate-400 leading-relaxed">{meta.description}</p>
        </div>
      </div>
    </div>
  );
}
