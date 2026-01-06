import { NavLink } from 'react-router-dom';
import { 
  Home, 
  List, 
  Layers, 
  GitBranch, 
  Share2, 
  BarChart3, 
  Search,
  Github,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/linear-list', label: '线性表', icon: List },
  { path: '/stack-queue', label: '栈与队列', icon: Layers },
  { path: '/tree', label: '树', icon: GitBranch },
  { path: '/graph', label: '图', icon: Share2 },
  { path: '/sort', label: '排序', icon: BarChart3 },
  { path: '/search', label: '查找', icon: Search },
];

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* 移动端菜单按钮 */}
      <motion.button
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isSidebarOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* 侧边栏 */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 glass border-r border-slate-700/50
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  DS Visualizer
                </h1>
                <p className="text-xs text-slate-500">数据结构可视化学习</p>
              </div>
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              数据结构
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-lg shadow-blue-600/25'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-3">
                      <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-blue-400'} />
                      <span className="font-medium">{item.label}</span>
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* 底部链接 */}
          <div className="p-4 border-t border-slate-700/50">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-all duration-200 rounded-xl hover:bg-slate-800/50 group"
            >
              <Github size={20} className="group-hover:text-purple-400" />
              <span className="font-medium">GitHub</span>
              <span className="ml-auto text-xs px-2 py-0.5 bg-slate-700 rounded-full text-slate-400 group-hover:bg-purple-600/20 group-hover:text-purple-400">
                Star
              </span>
            </a>
          </div>
        </div>
      </aside>

      {/* 遮罩层（移动端） */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
            onClick={() => setIsSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* 主内容区 */}
      <main className="flex-1 min-h-screen overflow-auto">
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
