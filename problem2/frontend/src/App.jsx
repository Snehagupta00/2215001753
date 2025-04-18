import { Routes, Route, Link } from 'react-router-dom';
import TopUsers from './pages/TopUsers';
import TrendingPosts from './pages/TrendingPosts';
import Feed from './pages/Feed';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <ul className="flex space-x-4 text-white">
          <li><Link to="/top-users" className="hover:underline">Top Users</Link></li>
          <li><Link to="/trending-posts" className="hover:underline">Trending Posts</Link></li>
          <li><Link to="/feed" className="hover:underline">Live Feed</Link></li>
        </ul>
      </nav>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/top-users" element={<TopUsers />} />
          <Route path="/trending-posts" element={<TrendingPosts />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/" element={<TopUsers />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;