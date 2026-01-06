import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  List,
  Layers,
  GitBranch,
  Share2,
  BarChart3,
  Search,
  Zap,
  BookOpen,
  Play,
  ArrowRight,
  Sparkles,
  Code2,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: List,
    title: '线性表',
    description: '顺序表与链表的核心概念、时间复杂度分析与动画演示',
    path: '/linear-list',
    color: 'from-blue-500 to-cyan-500',
    shadowColor: 'shadow-blue-500/25',
  },
  {
    icon: Layers,
    title: '栈与队列',
    description: '栈的 LIFO 与队列的 FIFO 原理讲解及应用场景',
    path: '/stack-queue',
    color: 'from-purple-500 to-pink-500',
    shadowColor: 'shadow-purple-500/25',
  },
  {
    icon: GitBranch,
    title: '树与二叉树',
    description: '二叉树遍历算法、赫夫曼树编码与核心公式讲解',
    path: '/tree',
    color: 'from-green-500 to-emerald-500',
    shadowColor: 'shadow-green-500/25',
  },
  {
    icon: Share2,
    title: '图',
    description: 'DFS/BFS遍历、最短路径算法与最小生成树理论',
    path: '/graph',
    color: 'from-orange-500 to-amber-500',
    shadowColor: 'shadow-orange-500/25',
  },
  {
    icon: BarChart3,
    title: '排序算法',
    description: '四大类排序算法详解：插入、交换、选择、归并',
    path: '/sort',
    color: 'from-red-500 to-rose-500',
    shadowColor: 'shadow-red-500/25',
  },
  {
    icon: Search,
    title: '查找算法',
    description: '静态查找、BST、AVL 与哈希表原理及 ASL 计算',
    path: '/search',
    color: 'from-indigo-500 to-violet-500',
    shadowColor: 'shadow-indigo-500/25',
  },
];

const highlights = [
  {
    icon: BookOpen,
    title: '理论讲解',
    description: '结合讲解文档，系统学习数据结构核心概念',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    icon: Zap,
    title: '动画演示',
    description: '流畅动画辅助理解，让抽象概念可视化',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Play,
    title: '考试要点',
    description: '必考公式、避坑指南，助力考试复习',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.section
        className="text-center py-12 lg:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 装饰元素 */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-full" />
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-purple-500/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
        </motion.div>

        <h1 className="text-4xl lg:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            数据结构与算法
          </span>
          <br />
          <span className="text-white mt-2 block">可视化学习平台</span>
        </h1>
        <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          <span className="text-blue-400">理论讲解</span>为主，<span className="text-purple-400">动画演示</span>为辅，
          <br className="hidden sm:block" />
          系统学习数据结构与算法核心知识
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/linear-list"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105"
          >
            开始学习
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://github.com/K-zhaochao/DataStructure"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-800/80 text-white rounded-xl font-medium hover:bg-slate-700/80 transition-all duration-300 border border-slate-700 hover:border-slate-600"
          >
            <Code2 className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </motion.section>

      {/* Highlights */}
      <section className="py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              className={`flex items-center gap-4 p-5 rounded-2xl ${item.bg} border border-slate-700/50`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <div className={`p-3 rounded-xl bg-slate-800/50 ${item.color}`}>
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
            探索数据结构
          </h2>
          <p className="text-slate-400">选择一个主题开始你的学习之旅</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            >
              <Link
                to={feature.path}
                className={`block h-full p-6 glass rounded-2xl card-hover group overflow-hidden relative`}
              >
                {/* 背景装饰 */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative z-10">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4 shadow-lg ${feature.shadowColor}`}
                  >
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                  
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 group-hover:text-blue-400 transition-colors">
                    <span>开始学习</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Time Complexity Chart */}
      <motion.section
        className="py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="glass rounded-2xl p-8 relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-500/10 to-cyan-500/10 blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                时间复杂度对比
              </h2>
            </div>
            <p className="text-slate-400 mb-8 max-w-2xl">
              直观比较不同算法的时间复杂度，理解为什么选择正确的算法如此重要。
              复杂度决定了算法的可扩展性和效率。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { complexity: 'O(1)', name: '常数', color: 'from-green-500 to-emerald-500', textColor: 'text-green-400', desc: '最快' },
                { complexity: 'O(log n)', name: '对数', color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-400', desc: '很快' },
                { complexity: 'O(n)', name: '线性', color: 'from-yellow-500 to-amber-500', textColor: 'text-yellow-400', desc: '一般' },
                { complexity: 'O(n²)', name: '平方', color: 'from-red-500 to-rose-500', textColor: 'text-red-400', desc: '较慢' },
              ].map((item, index) => (
                <motion.div
                  key={item.complexity}
                  className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className={`text-3xl font-mono font-bold ${item.textColor} mb-1`}>
                    {item.complexity}
                  </div>
                  <div className="text-sm text-slate-400">{item.name}复杂度</div>
                  <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${item.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                  <div className="mt-2 text-xs text-slate-500">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-10 text-center">
        <div className="glass rounded-2xl p-6 inline-block">
          <p className="text-slate-400">DS Visualizer - 让学习数据结构变得有趣</p>
          <p className="mt-2 text-slate-500 text-sm">
            基于 React + TypeScript + Framer Motion 构建
          </p>
        </div>
      </footer>
    </div>
  );
}
