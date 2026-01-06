import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import LinearList from './pages/LinearList'
import StackQueue from './pages/StackQueue'
import TreePage from './pages/TreePage'
import GraphPage from './pages/GraphPage'
import SortPage from './pages/SortPage'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/linear-list" element={<LinearList />} />
          <Route path="/stack-queue" element={<StackQueue />} />
          <Route path="/tree" element={<TreePage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/sort" element={<SortPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
